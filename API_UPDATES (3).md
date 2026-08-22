# Customer API — what changed

Everything added or altered on the storefront API by the courier, returns, blog and account
work.
Every example below was captured from the running application.

Existing endpoints keep their shapes; the changes are additive except where noted.

- [Shipping options](#shipping-options)
- [Order tracking](#order-tracking)
- [Refunds](#refunds)
- [Announcements](#announcements)
- [Size charts](#size-charts)
- [Blogs](#blogs)
- [Discounts](#discounts)
- [Phone number change](#phone-number-change)
- [Wishlist](#wishlist)
- [Hero images](#hero-images)
- [What decides visibility](#what-decides-visibility)

---

## Shipping options

`GET /api/general/shipping-options`

Two fields added. They describe the *promise* the customer is choosing, so the app can
label it; which courier carries the parcel is the country's business and stays internal.

```json
{
  "status": true,
  "success": true,
  "status_code": 200,
  "message": "Shipping options retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "domestic shipping",
      "price": 2,
      "is_express": true,
      "try_on": true
    },
    {
      "id": 2,
      "name": "international shipping",
      "price": 25,
      "is_express": false,
      "try_on": false
    }
  ],
  "errors": null
}
```

| Field | Meaning for the app |
| --- | --- |
| `is_express` | badge it as express — the courier prices it as an express delivery |
| `try_on` | the customer may try the item at the door and only accept it if it fits; worth saying so on the checkout row |

`price` is unchanged and still what the customer pays.

---

## Order tracking

`GET /api/orders/{id}/tracking` — **new**. The customer's own order only (404 otherwise).

With the parcel at the courier:

```json
{
  "status": true,
  "success": true,
  "status_code": 200,
  "message": "Tracking retrieved successfully.",
  "data": {
    "status": "shipped",
    "with_courier": true,
    "courier_status": "Processing",
    "courier_status_code": 3,
    "delivered": false,
    "tracking_id": "WK2408120001",
    "tracking_url": "https://track.wakilni.com/WK2408120001",
    "shipped_at": "2026-08-12T11:25:02+00:00",
    "delivered_at": null,
    "events": [
      { "status": "Pending", "status_code": 1, "at": "2026-08-12T11:25:02+00:00" }
    ]
  },
  "errors": null
}
```

Before it gets there — no courier fields at all, so the app has nothing to guess at:

```json
{
  "data": {
    "status": "confirmed",
    "with_courier": false,
    "tracking_id": null,
    "tracking_url": null,
    "events": []
  }
}
```

Notes for the client:

- `events` is **oldest first**, so a timeline reads downwards.
- Courier status codes: `1` pending, `2` confirmed, `3` processing, `4` success,
  `5` failed, `6` declined, `7` cancelled, `8` closed failed, `9` postponed,
  `10` pending cancellation. `delivered` is the boolean to key a "delivered" state off —
  code `4` also covers a parcel the customer *rejected*.
- Safe to call on screen open: it answers from stored data and only refreshes from the
  courier when its record is older than 15 minutes. A courier that cannot be reached
  degrades to the last known state rather than erroring.

---

## Refunds

`POST /api/orders/{id}/refund` is **unchanged** for the client. What changed is behind it:
accepting a refund no longer restores stock on its own, and staff decide whether a driver
collects the goods. Nothing the app sends is affected.

Asking for one takes `reason` (required), `reason_details` (optional) and **1–4 photos**
(`images[]`, required — a refund is a claim about the goods, so it wants evidence). Only a
`delivered` order qualifies, and only once: a second request answers `422`. The order moves
to `refund_requested` on success.

### Reading the decision back

Both `GET /api/orders` and `GET /api/orders/{id}` carry a **`refund`** object once a request
exists — this is what the order screen renders, so the app never needs a separate call to
find out what staff decided:

```json
"refund": {
  "status": "rejected",
  "reason": "Wrong size",
  "notes": "The waist is much tighter than the chart said.",
  "admin_response": "Measured against the chart on return — within tolerance.",
  "images": ["https://…/storage/uploads/refund-requests/….jpg"],
  "reviewed_at": "2026-08-14 11:20",
  "created_at": "2026-08-13 09:02"
}
```

Two fields are easy to confuse and carry different voices: **`notes`** is what the customer
wrote, **`admin_response`** is the reply from staff. Show the second one whenever it is
present — on a rejection it is the only explanation the customer gets. It is `null` while
the request is still `pending`, as is `reviewed_at`.

`refund` is `null` when the order never had a request, and is only ever populated for orders
sitting at `delivered`, `refund_requested` or `refunded`.

`POST /api/orders/{id}/cancel` is unchanged too — still `confirmed` or `processing` only.
Cancelling now also tells the courier to drop the parcel when one is already booked.

---

## Announcements

`GET /api/general/announcements` — **new**. The bar across the top of the storefront:
whatever is live for this country right now, in `sort_order`. An empty array means show
nothing, so the client needs no other rule. See
[ANNOUNCEMENTS.md](ANNOUNCEMENTS.md) for the payload.

Each row carries `message`, `link`, `link_label` and `ends_at`. There are no colours or
icons: the storefront owns the look, and `link_label` is what to render for a link — never
the address itself.

**`link` is new and is the field to route on.** A bar can now point at the shop, a category,
a product, a package, the blog index, an article or a CMS page as well as at an external
address, so a destination arrives as `{type, id, slug, url}` rather than as a path — a
server-baked `/products/42` would mean nothing to the app. `link: null` means the bar has
nowhere to go, or that its destination has since been deleted or hidden; render the words
without a link either way. `link_url` remains for older clients, carrying the address of an
`external` link and `null` for every internal one.

---

## Size charts

### Diagrams

`GET /api/products/{id}` gained **`size_chart_images`** — the diagrams for the chart that
applies to that product, in the order the shop arranged them, or `[]`. Up to seven: a
garment is measured in several ways, and one picture cannot show the bust, the waist and
the length at once.

It replaces the shop-wide `size_chart_image` **system setting**, which has been removed. One
image per shop only worked while every garment was measured the same way; a dress chart and
a shoe chart need different pictures, so the images now belong to the chart. `size_chart`
itself is unchanged, so nothing else in the payload moves.

### Column labels

`GET /api/products/{id}` also gained **`size_chart_labels`** — what to print above each
column of the chart, in the shopper's language:

```json
"size_chart_labels": {
  "chest": "Chest",
  "waist": "Waist",
  "sleeve_length": "Sleeve length"
}
```

`measurements` inside `size_chart` is keyed by our canonical column names (`chest`,
`sleeve_length`, …). Those are storage keys, not headings — printing them raw gives the
shopper `sleeve_length` in an Arabic table. Look each key up in `size_chart_labels` instead.

Every key that appears in any entry's `measurements` is present, so the lookup never misses.
A column the shop has not translated yet falls back to the canonical name rather than to a
blank header — an ugly heading beats an empty one. Charts vary in which columns they carry,
so build the table from these keys rather than from a fixed list. `{}` means the product has
no chart.

---

## Blogs

Four endpoints, all **new**: see [BLOGS.md](BLOGS.md) for the full reference.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/blogs` | published articles, paginated (`category_id`, `category_slug`, `tag_id`, `featured`, `search`, `per_page`) |
| `GET /api/blogs/categories` | categories with their published counts |
| `GET /api/blogs/{id}` or `{slug}` | one article with its ordered blocks |
| `GET /api/blogs/{id}/related` | other articles in the same category |

Two additions since that document was first written:

- **Category icons.** `GET /api/blogs/categories` returns `icon` (a URL or `null`), and the
  `category` object on an article carries the same field.
- **Publish states.** An article is served only when it is `published`, or `scheduled` with
  its moment already passed. Drafts, archived articles and future schedules answer `404` —
  deliberately indistinguishable from a missing article. Hidden blocks are simply absent
  from `sections`.

A section's media always arrives resolved, so the client never guesses:

```json
"images": ["https://…/storage/uploads/blogs/….jpg"],
"video":  { "kind": "embed", "url": "https://www.youtube.com/watch?v=…" }
```

`kind` is `file` (play it directly) or `embed` (rewrite YouTube/Vimeo links to their embed
form before putting them in an iframe).

---

## Phone number change

**Breaking.** `POST /api/auth/update-profile` no longer accepts `phone_number` — the field
was dropped from the request, so sending it is now silently ignored rather than applied. It
had let an account move to a number nobody had proved they owned. Changing a number is two
calls now, both authenticated.

### 1. Ask for the code

`POST /api/auth/request-phone-change`

```json
{ "phone_number": "+96170123456" }
```

```json
{
  "status": true,
  "success": true,
  "status_code": 200,
  "message": "A verification code has been sent to the new phone number.",
  "data": { "phone_number": "+96170123456" }
}
```

**The code goes to the number being claimed, not the one on the account.** That is the whole
point of the flow: an OTP to the current number proves the customer still holds the number
they already have, which says nothing about the new one, and would let a typo be saved as
verified. Outside production the response also carries `otp` so testers do not need the SMS.

### 2. Confirm it

`POST /api/auth/change-phone-number` — the number is sent **again** alongside the code:

```json
{ "phone_number": "+96170123456", "code": "483920" }
```

```json
{
  "status": true,
  "success": true,
  "status_code": 200,
  "message": "Your phone number has been updated.",
  "data": { "phone_number": "+96170123456" }
}
```

On success the account moves to the new number and `phone_verified_at` is stamped — the
customer does not have to verify again afterwards.

### What can come back

| Case | Response |
| --- | --- |
| Already the account's number | `400` "This is already your phone number." |
| Taken by another account | `422` "The phone number has already been taken." |
| Taken by a **deleted** account | `403` "This phone number belongs to a deleted account. Please contact support." |
| Too many codes asked for | `429` — five per ten minutes |
| Too many wrong codes | `429` "Too many attempts. Please try again in :seconds seconds." — ten per ten minutes |
| Code expired | `422` — a phone code lives **5 minutes** |
| Wrong code / no code outstanding | `422` |

The `403` deserves its own screen: it is the one failure the customer cannot fix by picking
a different number or retyping the code. Both steps check availability — the number can be
claimed by someone else in the minutes between them — so step two can fail on a number step
one accepted.

The code is issued under its own purpose, so asking for a phone change does **not** cancel
an outstanding signup verification, and vice versa. `POST /api/auth/resend-otp` verifies the
account's current number and will not resend this one; call step one again instead.

---

## Wishlist

`not_guest` has been **lifted** from the whole `wishlist` prefix. A signed-out shopper
holding a guest token from `POST /api/auth/guest` can now add to a wishlist, list it, and
check membership — the same way they already hold a cart. Nothing about the payloads
changed.

| Endpoint | Now reachable by |
| --- | --- |
| `GET /api/wishlist` | guests and accounts |
| `POST /api/wishlist/toggle` | guests and accounts |
| `GET /api/wishlist/check/{productId}` | guests and accounts |
| `GET /api/wishlist/check-package/{packageId}` | guests and accounts |
| `POST /api/wishlist/merge` | guests and accounts |

The wishlist hangs off the token's user row, and a guest token is a real (if throwaway) one,
so a guest's list survives until that token does. `POST /api/wishlist/merge` is what carries
it across when they sign in — call it after login, the same as for the cart, or the list
stays behind on the guest token.

Orders and profile stay account-only: there is no such thing as a guest's order history.

---

## Hero images

`GET /api/general/hero-images` gained a **`packages`** key. Every key is a URL or `null`,
and `null` means the shop has not uploaded one — render the screen without it rather than
holding the screen back.

```json
"data": { "home": "https://…", "packages": "https://…", "verify_otp": null }
```

---

## Discounts

`discounted_price` was already on a product; what is **new** is that the `discount` object
beside it now says what the campaign is attached to, so the app can explain the price
rather than just print a smaller number:

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
| `target_type` | `all` / `products` / `categories` / `fit_type` / `color` / `packages` |
| `applies_to_whole_product` | whether `discounted_price` holds for **every** variant |
| `matched` | the records that caused it — one key picked by `target_type`, `null` for `all` |

**`applies_to_whole_product: false` is the one to build around.** It only ever happens on a
`color` campaign, because colour is the one thing chosen *after* the listing is drawn: the
cart matches the discount against the SKU picked, while the listing marks the product down
if any of its colours qualify. False means the price holds **only** for the colours in
`matched.colors` — show the badge against those swatches, not across the product. A colour
discount covering every colour reports `true`, so there is nothing to compare client-side.

`matched` carries `products`, `categories`, `fit_type`, `colors` or `packages`, each
`{id, name}` in the requested language. `categories` names the ancestor that matched, so a
campaign on *Tops* reads "Tops" on a T-shirt rather than naming the child.

**Packages carry the identical object**, alongside `discounted_price`, `discount_amount` and
`has_discount` — one renderer serves both. `GET /api/packages` previously omitted all of it,
so a discounted bundle looked full price until it reached the cart.

Three pricing corrections landed with this, all in the direction of the app having shown
*less* than the cart charged:

- the product listing stripped tax twice, quoting 282.455 for a 333 item the cart billed at
  316.35 — listing and detail now agree
- the listing picked the discount with the highest `value` rather than the best saving, so a
  `fixed 50` beat a `percentage 20` that saved four times as much — cheapest wins everywhere
- a discount with no end date was live on the product page but excluded from the cart

**Usage limits are now enforced**, which changes what a client sees: a campaign whose total
or per-customer limit is spent disappears from the payload entirely — `discount: null`,
`discounted_price: null`, indistinguishable from a product that was never on sale. Send the
customer's bearer token on product requests (the endpoints are public but read it when
present) or a signed-in shopper will be shown a campaign they have already used.

A campaign with a minimum spend cannot be promised from a product page, so it arrives with
`requires_subtotal` and `price_when_met` and **no** `discounted_price`; the cart returns
`unmet_discounts` with how much more is needed. Full reference:
[DISCOUNT_LIMITS.md](DISCOUNT_LIMITS.md).

Rules and edge cases in full: [DISCOUNTS_AND_PACKAGES.md](DISCOUNTS_AND_PACKAGES.md).

---

## Saudi legal identifiers

`GET /api/general/app-info` gained **`commercial_registration`** and **`vat_number`** — the
registration and VAT numbers a storefront trading in Saudi Arabia must display by law.

They are sent **only for Saudi Arabia**, and are **absent rather than null** elsewhere. That
is the one field pair in this payload where a missing key carries meaning: `null` means the
shop has not filled it in, absent means the market has no such concept. Render the row only
when the key arrives.

The country comes from the **`X-Country-Code` header**, as everywhere else — a request
without it falls back to the shop's default country.

`GET /api/general/settings` carries the same two keys as ordinary rows, and now resolves
**every** key for the requesting country: this country's row first, the global row as the
fallback, and within each, this language before the language-less one. It previously
filtered on language alone, so a key stored both globally and per country was answered from
whichever row came back first — Jordan's phone number could reach a Saudi shopper. Detail in
[DISCOUNTS_AND_PACKAGES.md](DISCOUNTS_AND_PACKAGES.md#the-settings-endpoint-resolves-per-country-too).

---

## What decides visibility

Worth knowing when a client sees less than expected:

| Thing | Rule |
| --- | --- |
| Blog article | `published`, or `scheduled` and its time has passed; per country |
| Blog section | `status = 1` |
| Shipping option | `status = 1`, per country. An option marked *no courier* still appears — it is a real choice, just not carried by the courier |
| Tracking | the customer's own orders only; guests cannot reach it (`not_guest`) |
| Wishlist | anyone with a token, guest or account — the list belongs to the token's user row |
| Refund object on an order | present once a request exists, on `delivered` / `refund_requested` / `refunded` orders; `null` otherwise |
| Size chart column | appears in `size_chart_labels` when at least one entry measures it |
