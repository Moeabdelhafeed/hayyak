# Backend request — SEO fields on content records

**To:** Hayyak CMS / API team
**From:** Frontend (hayyakpm.com)
**Date:** 2026-09-16
**Priority:** Medium — nothing is broken, this unblocks the content team
**Scope:** Public API (`https://cms.hayyakpm.com/api`) — additive fields only, no behaviour changes

---

## Summary

The public API exposes no SEO fields on any content record. There is no `meta_title` or
`meta_description` on units, areas, services or blog posts, so the marketing/content team
has no way to set a page's title tag or meta description from the CMS.

The frontend has worked around this: detail-page titles are now generated from fields the
API already returns. That closed the immediate SEO issue, so **this request is not urgent
and nothing is waiting on it**. What it buys is the ability to override a single listing's
title from the CMS without a frontend deploy.

---

## What we found

Audit of all 418 indexable URLs on 2026-09-16.

### 1. No SEO fields exist on any record

`GET /api/units/apartment-132` returns 38 fields:

```
id, slug, external_id, name, translations, unit_type, unit_type_name,
unit_type_translations, bedrooms, bathrooms, parking, floor, size_sqft,
latitude, longitude, is_for_sale, is_for_rent, transaction_type, is_published,
featured, status, sale_price, market_rent, market_rent_cents, deposit,
deposit_cents, currency, cover_image, amenities, litigations, crm_tags, tags,
property, marketing_description_html, marketing_description_plain, ...
```

No `meta_title`, no `meta_description`. Same for `general/areas/{slug}`,
`general/services` and `general/blog/posts`.

Jobs are the exception — `careers/{slug}` does return `meta_title` and `meta_description`,
and the frontend already reads them. That is the pattern we would like extended.

### 2. Consequence: duplicate title tags across the catalogue

With no SEO field, the only usable value was `name`. `name` is a CRM reference, not a
title, and it repeats:

| `name` | units sharing it |
|---|---|
| `Apartment 132` | 13 |
| `Apartment -101` | 11 |
| `Apartment 131` | 10 |

187 units carried 133 distinct names. On the live site that produced 68 URLs with a
duplicate `<title>`, which is the specific error the SEO audit flagged.

### 3. Arabic `name` values are English

Every unit's Arabic translation row repeats the English name:

```json
"translations": [
  { "lang": "ar", "name": "Apartment 132", "description": null, "location": null },
  { "lang": "en", "name": "Apartment 132", "description": null, "location": null }
]
```

`unit_type_translations` is populated correctly (`شقة` / `Apartment`), so the mechanism
works — it is the unit-level `name` and `location` that come through untranslated. Arabic
property pages therefore show English street and unit names.

---

## What the frontend already does (so you don't duplicate it)

Detail-page titles are composed from existing API fields against a pattern stored as a CMS
translation key, e.g. `seo_property_title`:

```
EN  "{beds} {type} {deal} in {place}{size}"  ->  3-Bed Apartment For Sale in Tabarbour, 133m²
AR  "{type} {beds} {deal} في {place}{size}"  ->  شقة 3 غرف للبيع في طبربور، 133م²
```

Sources: `bedrooms`, `unit_type_translations[lang].name`, `transaction_type`,
`property.location`, `size_sqft`. Result: 179 of 187 units now have a unique title,
duplicates down from 68 URLs to 15.

**The frontend already prefers `meta_title` when it is present on the record.** The moment
you ship the field, a value entered in the CMS wins over the generated title — no frontend
change needed.

---

## The ask

### 1. Add SEO fields to content records (main request)

Add nullable, per-locale `meta_title` and `meta_description` to:

- units
- areas
- services
- blog posts

Translatable the same way existing content is — either as columns on the translation rows,
or alongside `name` in the `translations[]` array. Expose them in the public API responses
for both the list and detail endpoints.

Suggested shape, matching what `careers/{slug}` already returns:

```json
{
  "slug": "apartment-132",
  "name": "Apartment 132",
  "meta_title": "3-Bed Apartment for Sale in Abdoun, 252m²",
  "meta_description": "Spacious third-floor apartment in Abdoun with ...",
  "translations": [
    { "lang": "ar", "name": "...", "meta_title": "...", "meta_description": "..." },
    { "lang": "en", "name": "...", "meta_title": "...", "meta_description": "..." }
  ]
}
```

Constraints worth enforcing in the CMS editor, not the API: `meta_title` around 50–60
characters, `meta_description` around 150–160. Both should be optional — when empty, the
frontend keeps generating the title, which is the desired default for 187 listings nobody
wants to write by hand.

### 2. Unit records are missing data the descriptions are built from

Meta descriptions are now generated from the unit's own facts (beds, baths, size, price,
street). Where a field is empty the sentence is shorter, which is why 22 of 187 EN
descriptions land at 116-119 characters instead of the 120-160 target.

Counts across all 187 published units:

| field | units missing it |
|---|---|
| `bathrooms` | 70 |
| `size_sqft` | 12 |
| `sale_price` / `market_rent` (both empty) | 3 |
| `property.location` | 0 |

This is not an API change — the fields exist and are exposed. It is either a CRM sync gap
or a data-entry gap. Filling them lengthens the affected descriptions automatically, with
no frontend deploy. Worth confirming whether the CRM holds these values upstream and they
are simply not syncing, or whether they were never captured.

### 3. Check the Arabic translation sync (smaller)

`translations[ar].name` and `translations[ar].location` on units are filled with the
English values. Please confirm whether the CRM sync is supposed to populate these, and
whether Arabic content exists upstream. If Arabic names are never going to exist, say so —
the frontend will stop reading them and rely on the generated Arabic titles instead.

### 4. Blog posts return no `updated_at`

`GET /api/general/blog/posts/{slug}` returns `published_at` but no `updated_at`:

```json
{
  "slug": "arpi-pulse-q12026",
  "title": "ARPI Pulse Q1/2026",
  "published_at": "2026-02-02T03:00:00.000000Z",
  "cover_image": "...",
  "category": "Price Index"
}
```

The pages emit `BlogPosting` structured data, where Google reads `dateModified` as a
freshness signal. With no `updated_at` the frontend falls back to `datePublished`, so the
two dates are always identical — editing a post produces no freshness signal at all.

Please expose the record's `updated_at` timestamp on blog posts (and on the other content
types, if it is tracked). No new column should be needed — the ORM almost certainly already
maintains it; it is simply not in the API response.

### 5. Store CMS media in modern formats (images WebP, hero video WebM)

Most property images already come through as `.webp` — that part works. The gaps are the
remaining raster uploads and, above all, the hero video.

Measured on the live API today:

| endpoint | formats returned |
|---|---|
| `general/areas` | 122 webp, 3 png, 2 jpg |
| `general/settings` (logos) | 2 png |
| `general/home` (hero) | 1 mp4, **8.1 MB** |

**Images.** Please convert on upload and serve `.webp` for area images, logos and any other
raster upload, as already happens for property images. The frontend re-encodes what it can
at request time, but it cannot undo a large source file, and the logo PNGs are served
straight through.

**Hero video.** 8.1 MB is the single heaviest asset on the site. It is the homepage's
Largest Contentful Paint element, and Core Web Vitals is the one SEO row still failing —
LCP measures 4.6s on mobile against a 2.5s threshold, essentially all of it this download.

Two asks on the video:

1. **Re-encode it.** A looping muted background clip at 1080p, a few seconds long, should
   land around 1-1.5 MB. Current file is roughly 5-8x that.
2. **Store a WebM alongside the MP4** (VP9 or AV1) and expose both URLs on the hero object,
   e.g. `video_url` plus `video_url_webm`. WebM is typically 30-50% smaller than H.264 at
   equal quality. Keep the MP4 — Safari needs it — and the frontend will offer both via
   `<source>` so each browser takes the smaller one it supports.

Also worth setting `image_url` on the hero record. It is currently empty, so the hero has
no poster frame and paints black until the video buffers. A poster would both fix that and
become the LCP element, which is the cheapest single win available on this page.

---

## What we are NOT asking for

- **Renaming units.** `Apartment 132` is fine as a CRM reference. Titles no longer depend
  on it, and renaming would change the H1 and card labels across the site.
- **Writing 194 meta titles.** The generated titles cover the catalogue. `meta_title` is
  an override for the handful of listings worth hand-writing.
- **Any change to the translations endpoint.** `POST /general/translations` works as
  documented (per-key upsert, `X-Translation-Group` + `X-Translation-Locale`). The SEO
  title keys are already stored there.

---

## Acceptance

- [ ] `meta_title` and `meta_description` present in the public API response for a unit, an
      area, a service and a blog post — both locales, null when unset
- [ ] A value set in the CMS appears in the page's `<title>` within one cache cycle (5 min)
- [ ] Clearing the value falls back to the generated title, no empty or `undefined` title
- [ ] Answer on whether `translations[ar].name` will ever carry Arabic
- [ ] `updated_at` present on blog post responses and changing when a post is edited
- [ ] Area images, logos and other raster uploads returned as `.webp`
- [ ] Hero video re-encoded to ~1-1.5MB, with a WebM URL exposed alongside the MP4
- [ ] Hero `image_url` populated so the homepage has a poster frame
