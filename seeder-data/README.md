# Seeder Data (for backend Laravel seeders)

Real content currently shown on the site, extracted for seeding the CMS. **Images and icons are left blank** (`""`) — upload those in the CMS. All content is bilingual: each file has an `en` and an `ar` block (same structure, translated text). Seed translatable fields per language.

Regenerate anytime: `node scripts/gen-seeders.mjs`

| File | Maps to endpoint | Shape |
|---|---|---|
| `home.json` | `GET /general/home` | object: `hero{title,title_accent,subtitle,stats[]}`, `why_us{eyebrow,title,title_accent,body,points[],stats[]}`, `market_metrics[]`, `cta{title,body}`. `hero.stats` values & `market_metrics` values are real; labels translated. |
| `services.json` | `GET /general/services` + `/{id}` | array of 5 services: `slug,title,tag,short,desc,order,bullets[],hero{eyebrow,title,highlight,sub},stats[],sections[],cta`. `sections[]` are typed blocks (`cards/lifecycle/phases/deliverables/standards/process/timeline`) — see each `type`. |
| `about.json` | `GET /general/about` | object: `hero`, `why_hayyak`, `ventures[]`, `pillars[]`, `comparison[]`. `why_hayyak.description` uses `\n\n` between paragraphs. |
| `faqs.json` | `GET /general/faqs` | flat list `{group:owners|tenants, question, answer, order}`. |
| `insights.json` | `GET /general/blog/posts` | 3 sample posts `{title, excerpt, body, category, published_at}`. `published_at` is a display string — convert to a real date. |
| `areas.json` | `GET /general/areas/{id}` (editorial) | 4 areas `{name, tagline, description, practical_info, dining[], shopping[], landmarks[]}`. **EN only** — Arabic editorial not in source; translate. Match to existing area rows by `name`. |
| `settings.json` | `GET /general/settings` | contact + social: `app_phone, app_whatsapp, app_email, app_address, app_address_url, working_hours, logo_en, logo_ar, social{}`. `ar` block overrides localized fields (address, working_hours). |

Notes:
- `slug` on services is for reference/SEO; routing is by `id`.
- Empty `icon`/`image`/`logo`/`cover_image`/`video_url` = upload in CMS.
- `order` fields define display order (ascending).
