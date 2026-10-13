# Backend request — Research / Blog split, documents and links on a post

The nav is now **Research and Insights**, with two children: **Research** (price indices,
market reports) and **Blog** (written articles). A post also needs to carry **several PDFs**
and **a list of links**, both editable in the CMS without a developer.

The frontend is built, deployed and reading these exact shapes already — behind a mock, see
[Until this ships](#until-this-ships). Nothing further is needed from us once these land.

Thanks for `?category=<slug>` and `category_slug` from the last request: both are in and
working. Verified against production: `?category=price-index` → 4, `?category=market-report`
→ 0, unknown slug → 0.

Four changes, in the order we need them:

| # | Endpoint | Change |
|---|---|---|
| 1 | `general/blog/categories` | add `section`, support `?section=` |
| 2 | `general/blog/posts` | support `?section=` |
| 3 | `general/blog/posts` + `/{id}` | add `pdfs[]` |
| 4 | `general/blog/posts` + `/{id}` | add `links[]` |

---

## 1. `section` on a blog category

A category belongs to exactly one section. It lives on the **category**, not the post: an
editor files a post by choosing its category, and moving a whole category between sections
is then one edit.

### Field

| | |
|---|---|
| Name | `section` |
| Type | string enum — **exactly** `"research"` or `"blog"` |
| Null | no. Not nullable, no empty string |
| Default | `"blog"` for new and existing categories |
| Localized | **no** — it is a key, like `slug`. Same value under `Accept-Language: en` and `ar` |
| Admin | a required two-option select on the category edit screen |

### Response

```jsonc
// GET general/blog/categories
{
  "data": [
    {
      "id": 2,
      "name": "Price Index",          // already there, localized
      "slug": "price-index",          // already there
      "description": null,            // already there
      "color": "#10b981",             // already there
      "cover_image": null,            // already there
      "posts_count": 4,               // already there
      "section": "research"           // <- NEW
    }
  ]
}
```

### Filter

```
GET general/blog/categories?section=research   -> Price Index, Market Report
GET general/blog/categories?section=blog       -> Investment Guide, TEST
GET general/blog/categories?section=nonsense   -> []    (empty, NOT the full list)
GET general/blog/categories                    -> all, unchanged
```

An unknown value returns an empty list. Today unknown params are ignored, which would make a
section page list every category.

### Seed values

Our suggested mapping for the four categories that exist today. **Please confirm with the
client before seeding** — this is their decision, not ours:

| Category | Slug | Section |
|---|---|---|
| Price Index | `price-index` | `research` |
| Market Report | `market-report` | `research` |
| Investment Guide | `investment-guide` | `blog` |
| TEST | `test` | `blog` |

---

## 2. `?section=` on blog posts

```
GET general/blog/posts?section=research                        -> posts in research categories
GET general/blog/posts?section=blog                            -> posts in blog categories
GET general/blog/posts?section=research&page=2&per_page=9      -> paginated, same as the plain list
GET general/blog/posts?section=research&category=price-index   -> BOTH filters apply (AND)
GET general/blog/posts?section=nonsense                        -> []
```

Same contract as `?category=`: a normal Laravel paginator, and an unknown value returns an
empty list rather than the full one. `section` and `category` combine with AND.

**Also:** `general/blog/posts` rejects `per_page` above 50 with a 422. Not a blocker — our
full-pull helper is capped at 50 because of it — but if raising it is trivial, say so.

---

## 3. `pdfs[]` — several documents per post

Today a post has one `pdf` string. A quarterly report needs the report, its data appendix and
a methodology note.

### Field

| | |
|---|---|
| Name | `pdfs` |
| Type | array of objects |
| Empty | `[]` — **never `null`**, never omitted |
| Where | **both** the list endpoint and `/{id}`. The card shows a "3 PDF" badge from the count |
| Order | the order the editor arranged them in. First entry = the main document |

Each entry:

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | the button label, so **localized** (en/ar), like a post title |
| `url` | string | yes | absolute `https://…`, as `pdf` is today |
| `size` | integer | yes | **bytes**. See below |

```jsonc
{
  "slug": "arpi-pulse-q12026",
  "pdf": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026.pdf",   // KEEP, see below
  "pdfs": [
    { "title": "Full report",           "url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026.pdf",      "size": 2412544 },
    { "title": "Data appendix (tables)","url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026-data.pdf", "size": 684032 },
    { "title": "Methodology note",      "url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026-method.pdf","size": 142336 }
  ]
}
```

### `size` is not optional any more

The approved design prints it on every row — "PDF · 2.3 MB" — so a reader knows what they are
opening. Send the raw byte count; we format it. We render the row without it when it is
missing, but the row then looks unfinished.

### Keep `pdf`

Keep the existing `pdf` field, set to the **first** entry's URL. We read `pdfs` and fall back
to `pdf`, so a partial rollout breaks nothing and anything else still reading `pdf` keeps
working.

### Admin

Repeatable file rows on the post edit screen: upload, a title per file (en + ar), reorder,
delete. Several files per post, no fixed maximum.

---

## 4. `links[]` — a list of links per post

An editable list of outbound links, shown as a "Related links" block under the article. Today
the only way to add one is to paste an `<a>` into the body HTML.

### Field

| | |
|---|---|
| Name | `links` |
| Type | array of objects |
| Empty | `[]` — **never `null`**, never omitted |
| Where | **both** the list endpoint and `/{id}` |
| Order | the order the editor arranged them in |

Each entry:

| Key | Type | Required | Notes |
|---|---|---|---|
| `label` | string | yes | displayed, so **localized** (en/ar). Fall back to the URL if empty |
| `url` | string | yes | absolute, `http` or `https` only. **Validate on save** |

```jsonc
{
  "links": [
    { "label": "Department of Lands and Survey",   "url": "https://dls.gov.jo" },
    { "label": "Central Bank of Jordan — statistics", "url": "https://www.cbj.gov.jo/Pages/viewpage?pageID=132" }
  ]
}
```

### Validation is not cosmetic here

`url` goes straight into an `href`. Reject anything that is not `http://` or `https://` on
save — `javascript:` and `data:` in an editor field are an XSS vector. We also drop non-http(s)
URLs on render, but that is belt and braces, not a reason to skip the check.

### Admin

Repeatable rows: label (en + ar) + URL, reorder, delete.

---

## 5. The post body — a question, not an ask

The post body renders as HTML. That is deliberate: it is how embeds and inline links work. It
also means whatever is stored in `body` executes in the visitor's browser.

If more people are about to edit the blog, please confirm the admin editor sanitizes on save:
strip `<script>`, `on*=` attributes and `javascript:` URLs, and allow `<iframe>` only for the
embed hosts actually in use. If you would rather we sanitize on render, say so — it needs to
happen on exactly one side, and right now it happens on neither.

---

## What the frontend accepts

Written down so a near-miss does not read as a bug. We normalize before rendering:

| We read | We also accept | We fall back to |
|---|---|---|
| `pdfs[].title` | `pdfs[].name` | `"PDF"` |
| `pdfs[].url` | `pdfs[].file` | entry dropped if neither is a valid http(s) URL |
| `pdfs[].size` | — | hidden when missing or `0` |
| `pdfs` (array) | — | a one-entry list built from `pdf` |
| `links[].label` | `links[].title` | the URL itself |
| `links[].url` | — | entry dropped if not http(s) |
| `links` (array) | — | `[]` |
| `category.section` | — | treated as `research` |

Empty arrays are fine. `null` where an array is expected is also handled, but please send `[]`.

---

## Acceptance — what we will check

```bash
# 1. section is present, and is a key not a label
curl -H 'Accept-Language: ar' .../general/blog/categories | jq '.data[] | {slug, section}'
#    -> section must still read "research" / "blog", NOT translated

# 2. category filter
curl '.../general/blog/categories?section=research' | jq '.data | length'   # 2
curl '.../general/blog/categories?section=xyz'      | jq '.data | length'   # 0

# 3. post filter, paginated, combinable
curl '.../general/blog/posts?section=research'                      | jq '.data.total'
curl '.../general/blog/posts?section=research&category=price-index' | jq '.data.total'
curl '.../general/blog/posts?section=xyz'                           | jq '.data.total'   # 0

# 4. arrays on BOTH endpoints, never null
curl '.../general/blog/posts'            | jq '.data.data[] | {slug, pdfs, links}'
curl '.../general/blog/posts/{id}'       | jq '.data        | {slug, pdfs, links}'

# 5. titles and labels follow the language
curl -H 'Accept-Language: ar' '.../general/blog/posts/{id}' | jq '.data.pdfs[].title'

# 6. a post with no documents and no links
#    -> "pdfs": [], "links": []    (not null, not missing)
```

---

## Until this ships

All of it is faked in [`server/utils/blogMock.js`](server/utils/blogMock.js) so the pages could
be reviewed before any back-end work was booked. The mock:

- derives `section` from the hardcoded slug map above
- invents two categories (`rental-yields`, `buying-guides`) with negative ids, and reassigns
  the five real posts across them, so the category-card row shows more than one card
- fills `pdfs[]` and `links[]` from tables for three ARPI posts. Every mocked document points
  at the post's **real** `pdf` URL, so each button downloads something real — only the titles
  and sizes are invented
- applies `?section=` in our own API layer by pulling every page of posts and filtering there

**To go live, set one env var:**

```
NUXT_BLOG_API_LIVE=true
```

Every mock helper becomes a no-op and `?section=` passes straight through to the CMS. Flip it
as soon as the fields are on staging — no code change, no deploy. Each helper also returns the
CMS value untouched whenever the real field is present, so a partial rollout (say `section`
live but `pdfs` not yet) works with the flag still off.

Once all four are live, delete `server/utils/blogMock.js` and the `mock*` calls in
`server/api/blog/categories.js`, `server/api/blog/posts/index.js` and
`server/api/blog/posts/[id].js`. Nothing else changes — the rest of the frontend already reads
the real shape.

---

## What the frontend does with it

| URL | Shows |
|---|---|
| `/research` | `?section=research` + that section's categories |
| `/blog` | `?section=blog` + that section's categories |
| `/insights/category/<slug>` | one category |
| `/insights/<slug>` | the post, its PDFs and its links |
| `/insights` | 301 → `/research` (the old hub is gone) |

Post and category URLs keep the `/insights/` prefix: they are indexed, and moving them costs a
redirect per post plus re-indexing. Not planned unless the client asks.

Category cards are hidden when a section has only one category with posts — one card is just a
second link to the same list. So `/research` and `/blog` show a plain post grid until a second
category in that section has something in it.
