# Discounts, packages and Saudi settings

What actually happens to a price, case by case. The API shapes live in
[PACKAGES_API.md](PACKAGES_API.md) and [API_UPDATES.md](API_UPDATES.md); this document is
about the *rules* — which discount wins, when a package can be bought, and where the two
disagree. Usage limits and minimum spend have their own document:
[DISCOUNT_LIMITS.md](DISCOUNT_LIMITS.md).

Everything below was read off the running code, including the parts that do not work yet.
Those are marked **Gap**. Seed a working example of every target type with
`php artisan db:seed --class=DiscountSeeder`.

---

## Contents

- [Discounts vs coupons](#discounts-vs-coupons)
- [What a discount targets](#what-a-discount-targets)
- [The arithmetic](#the-arithmetic)
- [Which discount wins](#which-discount-wins)
- [When a discount is live](#when-a-discount-is-live)
- [What the API tells the client](#what-the-api-tells-the-client)
- [Usage limits and minimum spend](#usage-limits-and-minimum-spend)
- [What a package is](#what-a-package-is)
- [Variant rules](#variant-rules)
- [Package stock](#package-stock)
- [Discounts on packages](#discounts-on-packages)
- [Saudi settings](#saudi-settings)

---

## Discounts vs coupons

Two different things that both reduce a total, and they are easy to confuse:

| | Discount | Coupon |
| --- | --- | --- |
| Who applies it | the shop — it is simply *on* | the customer, by typing a code |
| What it attaches to | a **line**: this product, this category, this colour | the **order** |
| Where the customer sees it | the price itself, struck through | a field at checkout |
| Stacking | one per line, the best of them | one per order |
| Table | `discounts` + `discountables` | `coupons` |

A line can carry a discount *and* the order can carry a coupon; they are applied at
different levels and neither knows about the other.

---

## What a discount targets

`discounts.target_type` decides what a discount attaches to, and the matching rows live in
the polymorphic `discountables` table:

| `target_type` | Applies to | Matched by |
| --- | --- | --- |
| `all` | every line in the shop | nothing to attach |
| `products` | the listed products | `discountables` → `Product` |
| `categories` | the listed categories **and everything beneath them** | the product's category chain |
| `fit_type` | products with that fit | `products.fit_type_id` |
| `color` | lines whose chosen colour matches | the cart line's SKU colour |
| `packages` | the listed packages | `discountables` → `Package` |

**`categories` walks the tree.** A discount on *Tops* covers *T-Shirts*, *Blouses* and
*Shirts* without listing them, because the match runs against
`Product::categoryChainIds()` — the product's own category plus every ancestor. Adding a
sub-category later inherits the campaign automatically.

**`color` is the only target that depends on what was chosen, not on what the product is.**
It matches the SKU's colour, so the same product can be discounted in red and full price in
black. On a product listing — where no colour has been picked yet — a colour discount is
matched if *any* of the product's colours qualify, so the card can advertise it.

`subcategories` is still in the column's enum but has been **removed from the validation
rules**, so it can no longer be chosen: no pricing code ever matched on it, and a discount
saved with it applied to nobody. `categories` already covers descendants.

---

## The arithmetic

One implementation, `apply_discount()` in `app/Helpers/GeneralHelper.php`, is used by every
caller — the cart, the order, the product API and packages — so the price shown is the price
charged.

```
net       = gross ÷ (1 + tax%)          ← strip tax first
off       = percentage ? net × value%   : value
off       = min(off, max_amount)        ← the cap, if one is set
discounted= (net − off) × (1 + tax%)    ← put tax back
```

Three consequences worth knowing:

1. **The deduction is pre-tax.** A "10 off" takes 10 off the *net*, then tax is re-applied,
   so the customer does not see exactly 10 come off the gross. This is deliberate — tax is
   owed on what was actually charged, so the discount has to happen before it.
2. **`max_amount` is a cap on the deduction, also pre-tax** — not a maximum order value. On
   a percentage discount it is what stops "20% off" from taking 400 off a 2,000 item.
3. **A discount that does not reduce the price is reported as none at all.** If the maths
   lands on the same gross, `apply_discount()` returns `null` rather than a "discount" of
   zero, so nothing is struck through in the UI.

**Feed it the gross price.** `apply_discount()` strips the tax itself, so handing it a
net price strips twice. The product listing did exactly that and quoted 282.455 for a 333
item where the cart charged 316.35 — the customer was shown less than they were asked to
pay, and the listing disagreed with the detail endpoint, which had always passed the gross
price. Both pass gross now.

---

## Which discount wins

Only one discount applies to a line, and **the cheapest one wins** — everywhere:

| Where | How it picks |
| --- | --- |
| Cart, order | every applicable discount is priced; the lowest result is charged |
| Product list, product detail, wishlist | the same |
| Packages | the same, via `Package::bestDiscount()` |

This used to differ. The listing took the *first* match from a list sorted by raw `value`,
which is not the same as the best saving: against a 1,000 item a `fixed 50` outranks a
`percentage 20` on `value` while saving a quarter as much, so the product page advertised
one price and the cart charged a lower one. `resolveProductDiscount()` now prices every
candidate and keeps the cheapest, which is what the cart always did.

---

## When a discount is live

`status = 1`, and today falls inside `start_date … end_date`. Both dates are **nullable**,
meaning "from now on" and "until switched off", and every reader now honours that:

```php
->where(fn($q) => $q->whereNull('start_date')->orWhere('start_date', '<=', now()))
->where(fn($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', now()))
```

`Discount::scopeActive()` — used by the cart and the order — previously compared the
columns directly. `NULL >= now()` is never true, so an open-ended discount was **excluded
from the cart while the product page was already advertising it**: shown less, charged
more. It is null-tolerant now, matching the product path.

`DiscountSeeder` still writes both dates on everything it creates. A window with two ends
is easier to reason about than one that relies on a NULL being read correctly in four
places.

---

## What the API tells the client

A product carries one price and one `discount` object. The object says what the campaign is
attached to, so the app can explain a price rather than just show a smaller number:

```json
"price": 13,
"discounted_price": 9.64,
"discount": {
  "type": "fixed", "value": 3, "min_amount": 0, "max_amount": 0, "tax_percentage": 12,
  "target_type": "color",
  "applies_to_whole_product": false,
  "matched": { "colors": [ { "id": 1, "name": "Jet Black" } ] }
}
```

| Field | |
| --- | --- |
| `target_type` | which kind of campaign this is — the same values as the table above |
| `applies_to_whole_product` | whether `discounted_price` holds for **every** variant |
| `matched` | the records that caused the match, one key chosen by `target_type`; `null` for `all` |

`matched` carries `products`, `categories`, `fit_type`, `colors` or `packages`:

| `target_type` | `matched` | `applies_to_whole_product` |
| --- | --- | --- |
| `all` | `null` | always true |
| `products` | `{products: [{id, name}]}` | always true |
| `categories` | `{categories: [{id, name}]}` — the ancestor that matched, not the child | always true |
| `fit_type` | `{fit_type: {id, name}}` | always true |
| `color` | `{colors: [{id, name}]}` | **true only when every colour qualifies** |
| `packages` | `{packages: [{id, name}]}` | always true (on the packages endpoints) |

### Why `applies_to_whole_product` exists

Colour is the only thing a shopper chooses **after** the listing is drawn, so it is the only
target that can apply to part of a product. The cart matches a colour discount against the
SKU that was picked; the listing has no SKU yet, and marks the product down if *any* of its
colours qualify.

So a product with Jet Black on sale and Olive Green not is advertised at 9.64 and charged 13
if the shopper picks green. Rather than move price onto every colour — which would change
the payload's whole shape — the discount admits it:

- `applies_to_whole_product: false` → the price holds only for the colours in `matched`
- `applies_to_whole_product: true` → every variant is charged this price

A colour discount that happens to cover **all** of a product's colours reports `true`, so the
client never has to compare lists to work it out.

### Packages carry the same object

`GET /api/packages` and `GET /api/packages/{slug}` return `discounted_price`,
`discount_amount`, `has_discount` and the identical `discount` object, so one renderer
serves both. The listing used to omit all of it — `Package::discountedPrice()` existed and
the cart used it, but the endpoint never called it, so a bundle on sale looked full price
until it reached the cart.

`applies_to_whole_product` is always `true` for a bundle: it is one priced item with no
variants to escape the deduction.

---

## Usage limits and minimum spend

All three are enforced. `0` means "no limit" on every one, which is what the admin form
writes for a blank field.

| Field | Measured against |
| --- | --- |
| `max_uses_limit` | orders that redeemed this campaign, across all customers |
| `max_uses_per_user` | orders that redeemed it for **this** customer |
| `min_amount` | the cart subtotal, before any discount |

Three things worth knowing here; the rest is in
[DISCOUNT_LIMITS.md](DISCOUNT_LIMITS.md):

- **A "use" is an order, not a line.** `discount_usages` holds one row per
  `(discount, order)`, so a campaign reducing three lines of one order is one use.
- **Running out makes a campaign invisible**, not merely refused at checkout.
  `Discount::scopeAvailableTo()` is applied by every reader, so the product page goes quiet
  at the same moment the cart stops honouring it.
- **`min_amount` is judged on the basket**, so a product page cannot promise that price. It
  reports `requires_subtotal` and `price_when_met` instead, and the cart returns
  `unmet_discounts` saying how much more is needed.

---

## What a package is

A fixed-price bundle of products. The customer pays the package price, not the sum of its
parts, and **chooses the variants** within the rules each line sets.

| Table | Holds |
| --- | --- |
| `packages` | `title`, `slug`, `price`, `images`, `featured`, per country, soft-deletes |
| `package_items` | one line: which product, and how many of it per copy |
| `package_item_colors` | the colours that line allows — empty means any |
| `package_item_sizes` | the sizes that line allows — empty means any |
| `cart_package_selections` | what this shopper picked, one row per line |
| `order_item_package_items` | what was actually bought, denormalised for history |

`order_item_package_items` stores the product name, colour and size **as text** alongside
nullable ids. An order from last year still reads correctly after the SKU is deleted and
the product renamed — history is a record of what happened, not a live join.

---

## Variant rules

Colour and size are **independent sets** on each line, and each set has three states:

| Rows | Meaning | The customer |
| --- | --- | --- |
| none | unrestricted | picks any colour / size the product offers |
| one | fixed | picks nothing; it is decided |
| many | a choice | picks one of exactly those |

Because the two sets are independent, all of these are expressible on one line:

- *any colour, but only XL* — no colour rows, one size row
- *red or blue, any size* — two colour rows, no size rows
- *red XL only* — one colour row, one size row
- *red or blue, in M or L* — two and two

A line also carries `quantity`: how many units of that product go into **one copy** of the
package. Two of the same shirt in a bundle is `quantity: 2`, not two lines.

---

## Package stock

A package has no stock of its own — it is only as available as its scarcest line:

```
availableCopies(package) = min over lines of:
    max over the line's eligible SKUs of:
        floor(sku.stock ÷ line.quantity)
```

Three cases fall out of that:

- **A line takes the best of its options, not the sum.** A line allowing red or blue with 3
  red and 4 blue in stock supports **4** copies, not 7 — one copy must come from a single
  SKU, so the deepest option is what counts.
- **`quantity` divides.** A line needing 2 units of a SKU with 5 in stock supports 2 copies,
  and the odd unit is unreachable through the package.
- **A package with no lines is never in stock.** `hasStockFor()` returns false on an empty
  bundle rather than true-by-vacuous-truth, so a half-built package cannot be sold.

Stock is counted per country, since SKU stock hangs off `country_products`.

---

## Discounts on packages

Packages price themselves, through `Package::discountedPrice()`, and they recognise only
two targets:

| `target_type` | Applies to a package? |
| --- | --- |
| `all` | **yes** |
| `packages` | yes, if this package is listed |
| `products`, `categories`, `fit_type`, `color` | **no** |

**The case that surprises people:** a discount on a product does **not** reduce a package
containing that product. The bundle is priced as one item at `packages.price`, so a
campaign on the shirt inside it changes nothing. Only `all` and `packages` reach it.

Packages take the genuinely **best** price — every applicable discount is priced and the
lowest kept, the way the cart does. `Package::bestDiscount()` returns the campaign that
won as well as the price, which is what the API's `discount` object is built from.

---

## Saudi settings

Saudi law requires a storefront trading there to display its **commercial registration
number** and **VAT account number**. No other market has the concept, so they are the first
settings in the CMS that exist for one country only.

| Setting key | |
| --- | --- |
| `commercial_registration` | Commercial Registration No. |
| `vat_number` | VAT Account Number |

Both are ordinary `system_settings` rows — global (`lang = null`), scoped by `country_id`,
so they behave like every other storefront text setting.

### Where the country rule lives

One helper answers it, `country_is_saudi()` in `app/Helpers/GeneralHelper.php`. It matches
on the **country code, not an id**, because ids differ between environments, and accepts
`KSA`, `SA` and `SAU` — the shop writes the first, ISO writes the others. The Saudi national
address on a delivery uses the same helper, so the two can never disagree about what
"Saudi" means.

### In the CMS

**Settings → Commercial Registration & VAT**, its own card, rendered only when the
`saudiRegistration` prop arrives. Outside Saudi the controller sends `null` and the card
does not exist — the page never asks a Jordanian admin for a VAT number they do not have.

The save endpoint refuses outright when the active country is not Saudi, rather than
quietly writing the value:

```
PUT /settings/saudi-registration   →  error: "These details apply to Saudi Arabia only."
```

A value stored against the wrong country would never be read back, and working out why
months later is expensive.

### In the API

`GET /api/general/app-info` returns them **alongside the social links**, but only for Saudi:

```json
{
  "phone": "…", "email": "…", "whatsapp": "…",
  "facebook": "…", "instagram": "…", "twitter": "…", "tiktok": "…",
  "commercial_registration": "1010123456",
  "vat_number": "300012345600003"
}
```

The country comes from the **`X-Country-Code` header** (`SetApiCountry`), not a query
parameter — a request without it falls back to the default country, which is Jordan.

Outside Saudi the two keys are **absent, not null**. That is the deliberate difference from
every other field in this payload: a null phone number means "the shop has not filled it
in", while a missing VAT number means "this market has no such thing". A client should
render the row only when the key is sent.

### The settings endpoint resolves per country too

`GET /api/general/settings` returns these two keys as ordinary rows, and — like everything
else it serves — resolves each key **for the requesting country**, with the same precedence
`system_setting()` uses for a single key:

1. this country, this language
2. this country, no language
3. the global row, this language
4. the global row, no language

`unique('key')` then keeps the most specific match.

| Request | `app_phone` | `vat_number` |
| --- | --- | --- |
| `X-Country-Code: JO` | Jordan's own row | absent |
| `X-Country-Code: KSA` | Saudi's own row, or the global row if it has none | Saudi's row |

**Both halves of that query matter.** It used to filter on language alone, so a key stored
once globally and once per country was answered from whichever row came back first — a
Saudi shopper could be served Jordan's phone number, and a Saudi-only key was visible
everywhere. Narrowing it to a strict `country_id = X` fixes that but breaks the other half:
the shop defines most settings **once, globally**, so KSA — which has no row of its own for
`site_icon`, `site_name` or the hero images — lost twenty of them outright. The condition
has to be `country_id = X OR country_id IS NULL`, ordered so the country row wins.
