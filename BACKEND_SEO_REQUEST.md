# Backend request — Hayyak

Nothing here is blocking. The site passes its SEO audit without any of it. These are
small API gaps we hit while closing that audit, listed shortest-path first.

---

## 1. Poster frame for the hero video

The homepage hero is a video. Until it downloads, the hero is black — and Google measures
that wait as the page's load time (currently 4.6s on mobile; the target is 2.5s).

**Ask:** when a hero video is uploaded, save its first frame as an image and return it as
the hero's `image_url`.

```bash
ffmpeg -i <uploaded>.mp4 -frames:v 1 -q:v 5 -vf scale=1600:-2 poster.jpg
```

The frontend already reads `image_url` and uses it as the video's poster, so nothing has
to change on our side. A frame is ~140KB against a multi-megabyte video.

Doing it on upload rather than by hand matters: otherwise the next person to swap the
video has to remember, and the page gets slow again quietly.

---

## 2. Arabic unit names are English

Every unit's Arabic translation repeats the English name:

```json
"translations": [
  { "lang": "ar", "name": "Apartment 132", "location": null },
  { "lang": "en", "name": "Apartment 132", "location": null }
]
```

`unit_type_translations` is translated correctly (`شقة` / `Apartment`), so the mechanism
works — it is unit-level `name` and `location` that come through untranslated. Arabic
property pages therefore show English street and unit names.

**Ask:** confirm whether the CRM sync is meant to fill these. If Arabic will never exist
upstream, say so and we will stop reading the field.

---

## 3. Unit records missing data

Property descriptions are generated from each unit's own facts. Where a field is empty the
description is shorter — 22 of 187 come out slightly under the target length.

| field | units missing it |
|---|---|
| `bathrooms` | 70 |
| `size_sqft` | 12 |
| price (`sale_price` and `market_rent` both empty) | 3 |

**Ask:** confirm whether the CRM holds these and they are not syncing, or they were never
captured. No API change — the fields exist and are exposed, they are just empty.

---

## 4. `updated_at` on blog posts

`general/blog/posts/{slug}` returns `published_at` but no `updated_at`, so an edited post
shows no sign of being edited. Please expose the record's existing timestamp.

---

## Not needed

- **Image formats.** PNG/JPG sources are fine. The frontend converts every CMS image to
  WebP on request and caches it, so visitors already get WebP.
- **Video encoding.** The current 8.1MB hero was re-encoded to 1.4MB and will be uploaded
  through the CMS as normal content. Only the poster extraction above is requested.
- **Renaming units.** `Apartment 132` is fine as a CRM reference; nothing depends on it.
- **SEO title/description fields.** Titles and meta descriptions are generated and already
  pass the audit. If you ever add `meta_title` / `meta_description` to records, the
  frontend will prefer them automatically — but there is no need to.
