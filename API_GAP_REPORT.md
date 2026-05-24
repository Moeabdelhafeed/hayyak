# Hayyak — API / Data Gap Report

Audit of all current backend endpoints vs. the frontend design needs. Lists fields and endpoints that should be added or extended.

> **Naming convention used here**
> The API exposes `unit` and `property` as separate entities. In the UI/design, the listing the user browses (apartment, villa, office) maps to API `unit`. The API `property` is the parent building/project container. Wherever this report says **"property"** in a UI context, it refers to the API `unit`.

---

## 1. Existing endpoints (Postman collection)

```
GET    /general/settings
GET    /general/languages
GET    /general/slider-apps
GET    /general/pages
GET    /general/pages/{slug}
POST   /general/contact-us
GET    /general/translations
POST   /general/translations
DELETE /general/translations
GET    /general/careers
GET    /general/careers/{slug}
POST   /general/careers/{slug}/apply
GET    /general/cities
GET    /general/areas
GET    /general/areas/{id}
GET    /general/tags
GET    /general/tags/editorial
GET    /general/tags/amenities
GET    /properties
GET    /properties/discover
GET    /properties/best-sales
GET    /properties/{id}
GET    /units
GET    /units/types
GET    /units/{id}
POST   /leads
```

---

## 2. Gaps by domain

### 2.1 Unit (= UI "property")

**Currently returned and used:** `id, name, unit_type, transaction_type, sale_price, market_rent, currency, bedrooms, bathrooms, size_sqft, parking, floor, year_built, furnishing, marketing_description_plain, amenities, cover_image, images, property.area, property.city, property.location`

**Missing / inconsistent:**

| Field | Why needed |
|---|---|
| `latitude`, `longitude` | Map pin on detail + listing map view. Today the FE parses these out of `property.location` string — fragile. |
| `size_sqm` | UI labels every area value as "sqm" but API returns `size_sqft`. Either rename or add `size_sqm`. |
| `slug` | SEO-friendly URLs (`/properties/abdoun-villa-3br` vs `/properties/123`). |
| `tags[]` | Inline `["Featured","Hot Deal","Sea View"]` to render badge variants without an extra call. |
| `is_new` / `published_at` | "New" badge + "Newest" sort. |
| `view_count` | Powers `sort=popular`. |
| `available_from` | Move-in date for rentals. |
| `service_charge`, `deposit`, `min_lease_months` | Sidebar info / pricing breakdown. |
| `floor_plan_image` (or PDF) | Optional gallery tab. |
| `video_url`, `virtual_tour_url` | Optional gallery tab. |
| `images[].caption`, `images[].order`, `images[].is_cover` | Gallery ordering and accessibility. |
| `meta { title, description, og_image, canonical }` | Per-listing SEO. |
| Image variants: `image_thumb`, `image_medium`, `image_large` | Responsive `srcset` to avoid loading 4MB photos in card grids. |

### 2.2 Areas

**Currently used:** `id, name, image, city, neighborhoods`

**Missing:**

| Field | Why needed |
|---|---|
| `properties_count` (or `units_count`) | Card hover overlay shows count. FE is using deterministic random as a stub. |
| `avg_price_per_sqm`, `avg_unit_size_sqm` | Area detail page stats bar. Today computed client-side from unit list, which is slow and partial. |
| `slug` | Stable detail URL `/areas/abdoun`. |
| `tagline` | Subtitle on detail hero (e.g. "The Mayfair of Amman"). |
| `description` | About-the-area paragraph. |
| `practical_info` | Practical info block. |
| `dining[]`, `shopping[]`, `landmarks[]` | Each: `{ name, description, url?, image? }`. |
| `schools[]`, `healthcare[]` | Highlight cards under the about section. |
| `perks[]` | Resident discounts: `{ pct, partner, description, category }`. |
| `cover_image` (separate from card `image`) | Hero needs landscape, card needs square. |
| `latitude`, `longitude` | Map view center. |
| `polygon` / GeoJSON bounds | Future: draw the area outline on map. |

### 2.3 Services

**Currently used:** local file `app/components/Services/data.js` — no API call.

**Needs an endpoint** (e.g. `GET /services`, `GET /services/{slug}`):

```
{
  slug, title, tag, short, description, icon_key, cover_image,
  bullets: [string],
  hero: { eyebrow, title, highlight, sub },
  stats: [{ value, label }],
  sections: [
    {
      type: "cards" | "lifecycle" | "phases" | "deliverables" | "standards" | "process" | "timeline",
      eyebrow, title, intro?,
      items?: [{ title, body, tags[], icon_key, sub_items[] }],
      steps?: [...],
      rows?: [...]
    }
  ],
  cta: { eyebrow, title, body }
}
```

Plus icon resolution: either send `icon_key` (string) and FE maps to Lucide, or send hosted `icon_url`.

### 2.4 Footer

**Currently:** hardcoded translation keys + `/general/settings`.

**Should come from settings (or a dedicated `/footer` endpoint):**

- `footer_description`
- `social_links { facebook, instagram, linkedin, twitter, youtube?, tiktok? }`
- `address`, `address_url` (Google Maps directions link)
- `working_hours`
- `newsletter_active` (boolean — show subscribe form?)
- `legal_pages[]` — already covered by `/general/pages`, but pages need an `is_footer_legal` flag so FE can filter.

### 2.5 Home — Insights / Market data

**Currently:** 4 hardcoded KPI metrics + 3 hardcoded report cards.

**Needs:**

- `GET /market-insights` returning real KPIs:
  - `avg_price_per_sqm` (with currency)
  - `transaction_volume_yoy_pct`
  - `occupancy_rate_pct`
  - `avg_days_on_market`
- `GET /insights` (or re-expose `/blog/posts`) for the 3-card section:
  - `{ id, slug, title, excerpt, body_html, tag, date, cover_image, icon_key, read_minutes }`

### 2.6 Home — Hero stats

**Currently:** hardcoded translations (15+ years, 200+ sold, 98% satisfaction).

**Add settings keys** or a `/stats/home` endpoint:

- `years_experience`
- `properties_sold_count`
- `client_satisfaction_pct`
- `area_managed_sqm`

### 2.7 About page

Almost entirely translation-driven. If the team wants editorial control:

- `comparison_rows[] { traditional, hayyak }`
- `pillars[] { title, body, icon_key }`
- `welcome { paragraph_1, paragraph_2, quote }`
- `faq { owners[], tenants[] }` — each `{ question, answer }`
- `coverage_regions[]`
- `joint_venture { thabat: {title, body}, brightlevant: {title, body} }`

### 2.8 Properties listing — extra signals

- `editorial_tags[]` inline on each unit in the list response (avoids a second call).
- `price_history` — enables "price drop" badge.
- `compare_id` — stable id for compare feature.

### 2.9 Leads (POST `/leads`)

The endpoint already accepts a rich payload. The frontend only sends a subset.

**Need to add to UI** (depending on form_type):

| Field | Form |
|---|---|
| `country_code` | Phone input — separate country code select |
| `budget_min`, `budget_max` | buy / rent forms |
| `closing_date` | rent form ("move-in date") |
| `value`, `floor`, `private_garden`, `description` | sell / lease_out forms |
| `unit_ids[]` | property_management form (multi-unit) |

Implies separate dedicated forms for: **sell**, **lease_out**, **property_management**, **valuation** — not just the single property-sidebar form.

### 2.10 Navbar

**Currently:** hardcoded mega-menu entries.

**Add `/menus`** or a settings key `header_menu` returning:

```
{
  primary: [
    { label, slug, sub_label?, icon_key?, children?: [...] }
  ]
}
```

Top bar (phone, email, working hours, locale) — covered by `/settings` already.

### 2.11 Contact

- Multi-branch offices array if more than HQ.
- `map_lat`, `map_lng` (or embed `iframe_url`) — currently nothing on contact page references a map.

### 2.12 SEO / Meta

Add per-page `meta { title, description, og_image, keywords, canonical }` on:

- units
- areas
- services
- pages (CMS)
- blog / insights

Plus:
- `GET /sitemap.json` listing all public URLs for sitemap generation.
- `hreflang` alternates per locale.

### 2.13 i18n

- `/general/translations` already exists.
- Frontend currently bundles 600+ keys in `translations.{en,ar}.json`. Switch to fetch-from-API and remove static JSON, so non-devs can edit copy via CMS.

### 2.14 Misc nice-to-haves

- `GET /currencies` — multi-currency support
- `/wishlist` (currently hidden) — "save property" feature
- `/property-compare` — compare 2–3 units side by side
- `/notifications` — only if user auth lands

---

## 3. Priority

### High — blocking realism

1. **Unit:** `latitude`, `longitude`, `size_sqm`, `slug`, `tags[]`
2. **Area:** `properties_count`, `tagline`, `description`, `slug`, `lat/lng`
3. **Services endpoint** — replace local `data.js`
4. **Settings:** `social_links`, `footer_description`, full footer payload

### Medium

5. Insights/blog endpoint + market KPI endpoint
6. Image variants on all image URLs
7. Home/About stats from API
8. Per-page SEO meta

### Low

9. Menus endpoint
10. Multi-branch offices
11. Wishlist / Compare / Currencies / Notifications

---

## 4. Frontend cleanups that follow these additions

Once backend ships the above:

- Drop `app/components/Services/data.js`, fetch from API.
- Drop `app/components/Areas/data.js` fallback.
- Drop `randCount()` stub in `Home/Areas.vue` and `Areas/Grid.vue`.
- Drop static metric fallbacks in `Home/Insights.vue`.
- Drop static stat values in `Home/Hero.vue`.
- Move `translations.{en,ar}.json` content into the API and fetch on app boot.
- Replace `parseLatLng()` string parsing with the unit's explicit `lat/lng`.
- Remove the parent `/properties` proxy from `server/api/properties/` if it stays unused in UI.
