# Backend request — Research / Blog

The website's Insights section is now split into **Research** (price indices, market reports)
and **Blog** (written articles). An article also needs to carry **several PDFs** and **a list
of links**, both editable in the CMS without a developer.

The frontend is built and deployed against the shapes below, running on stand-in data until
these land. Nothing else is needed from us once they do.

| # | Endpoint | Change |
|---|---|---|
| 1 | `general/blog/categories` | add `section`, support `?section=` |
| 2 | `general/blog/posts` | support `?section=` |
| 3 | `general/blog/posts` + `/{id}` | add `pdfs[]` |
| 4 | `general/blog/posts` + `/{id}` | add `links[]` |

---

## 1. `section` on a blog category

A category belongs to exactly one section. It lives on the **category**, not the post: an
editor files a post by choosing its category, and moving a whole category between sections is
then one edit.

| | |
|---|---|
| Name | `section` |
| Type | string enum — **exactly** `"research"` or `"blog"` |
| Null | no. Not nullable, no empty string |
| Default | `"blog"` for new and existing categories |
| Localized | **no** — it is a key, like `slug`. Same value under `Accept-Language: en` and `ar` |
| Admin | a required two-option select on the category edit screen |

```jsonc
// GET general/blog/categories
{
  "data": [
    {
      "id": 2,
      "name": "Price Index",          // existing, localized
      "slug": "price-index",          // existing
      "description": null,            // existing
      "color": "#10b981",             // existing
      "cover_image": null,            // existing
      "posts_count": 4,               // existing
      "section": "research"           // <- NEW
    }
  ]
}
```

Filter:

```
GET general/blog/categories?section=research   -> Price Index, Market Report
GET general/blog/categories?section=blog       -> Investment Guide, TEST
GET general/blog/categories?section=nonsense   -> []     (empty, NOT the full list)
GET general/blog/categories                    -> all, unchanged
```

An unknown value must return an empty list. Today unknown params are ignored, which would
silently make a section page list every category.

### Seed values

Suggested mapping for the four categories that exist today. **Confirm with the client before
seeding** — it is their decision:

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
GET general/blog/posts?section=research&page=2&per_page=9      -> paginated, like the plain list
GET general/blog/posts?section=research&category=price-index   -> BOTH filters apply (AND)
GET general/blog/posts?section=nonsense                        -> []
```

Same contract as the existing `?category=`: a normal Laravel paginator, and an unknown value
returns an empty list rather than the full one. `section` and `category` combine with AND.

Without this we have to pull every page of posts and filter in our own API layer, which is
what we do today. Fine at 5 posts, not at 100.

**Side note:** `general/blog/posts` rejects `per_page` above 50 with a 422. Not blocking — our
full-pull helper is capped at 50 because of it — but if raising it is trivial, say so.

---

## 3. `pdfs[]` — several documents per post

Today a post has one `pdf` string. A quarterly report needs the report, its data appendix and
a methodology note.

| | |
|---|---|
| Name | `pdfs` |
| Type | array of objects |
| Empty | `[]` — **never `null`**, never omitted |
| Where | **both** the list endpoint and `/{id}`. The card shows a "3 PDF" badge from the count |
| Order | as the editor arranged them. First entry = the main document |

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | the button label, so **localized** (en/ar), like a post title |
| `url` | string | yes | absolute `https://…`, as `pdf` is today |
| `size` | integer | yes | **bytes** |

```jsonc
{
  "slug": "arpi-pulse-q12026",
  "pdf": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026.pdf",   // KEEP, see below
  "pdfs": [
    { "title": "Full report",            "url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026.pdf",       "size": 2412544 },
    { "title": "Data appendix (tables)", "url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026-data.pdf",  "size": 684032 },
    { "title": "Methodology note",       "url": "https://cms.hayyakpm.com/storage/.../arpi-q1-2026-method.pdf","size": 142336 }
  ]
}
```

**`size` is not optional.** The approved design prints it on every row — "PDF · 2.3 MB" — so a
reader knows what they are opening. Send the raw byte count; we format it.

**Keep `pdf`,** set to the first entry's URL. We read `pdfs` and fall back to `pdf`, so a
partial rollout breaks nothing and anything else still reading `pdf` keeps working.

**Admin:** repeatable file rows on the post edit screen — upload, a title per file (en + ar),
reorder, delete. Several files per post, no fixed maximum.

---

## 4. `links[]` — a list of links per post

Shown as a "Related links" block under the article. Today the only way to add one is to paste
an `<a>` into the body HTML.

| | |
|---|---|
| Name | `links` |
| Type | array of objects |
| Empty | `[]` — **never `null`**, never omitted |
| Where | **both** the list endpoint and `/{id}` |
| Order | as the editor arranged them |

| Key | Type | Required | Notes |
|---|---|---|---|
| `label` | string | yes | displayed, so **localized** (en/ar). Fall back to the URL if empty |
| `url` | string | yes | absolute, `http` or `https` only. **Validate on save** |

```jsonc
{
  "links": [
    { "label": "Department of Lands and Survey",      "url": "https://dls.gov.jo" },
    { "label": "Central Bank of Jordan — statistics", "url": "https://www.cbj.gov.jo/Pages/viewpage?pageID=132" }
  ]
}
```

**Validation matters here.** `url` goes straight into an `href`. Reject anything that is not
`http://` or `https://` on save — `javascript:` and `data:` in an editor field are an XSS
vector. We also drop non-http(s) URLs on render, but that is belt and braces, not a reason to
skip the check.

**Admin:** repeatable rows — label (en + ar) + URL, reorder, delete.

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

Written down so a near-miss does not get reported as a bug. We normalize before rendering:

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

`null` where an array is expected is handled, but please send `[]`.

---

## Acceptance — what we will check

```bash
# 1. section present, and a key not a label
curl -H 'Accept-Language: ar' .../general/blog/categories | jq '.data[] | {slug, section}'
#    -> section still reads "research" / "blog", NOT translated

# 2. category filter
curl '.../general/blog/categories?section=research' | jq '.data | length'   # 2
curl '.../general/blog/categories?section=xyz'      | jq '.data | length'   # 0

# 3. post filter — paginated, combinable
curl '.../general/blog/posts?section=research'                      | jq '.data.total'
curl '.../general/blog/posts?section=research&category=price-index' | jq '.data.total'
curl '.../general/blog/posts?section=xyz'                           | jq '.data.total'   # 0

# 4. arrays on BOTH endpoints, never null
curl '.../general/blog/posts'      | jq '.data.data[] | {slug, pdfs, links}'
curl '.../general/blog/posts/{id}' | jq '.data        | {slug, pdfs, links}'

# 5. titles and labels follow the language
curl -H 'Accept-Language: ar' '.../general/blog/posts/{id}' | jq '.data.pdfs[].title'

# 6. a post with no documents and no links
#    -> "pdfs": [], "links": []    (not null, not missing)
```

---

## Status — delivered, verified 13 October 2026

All four landed and pass every check above. The stand-in layer on our side has been removed;
the site reads the CMS directly.

| Check | Result |
|---|---|
| `section` present, not translated | pass — `"blog"` under `Accept-Language: ar` |
| `?section=` on categories, unknown → `[]` | pass |
| `?section=` on posts, unknown → `[]` | pass |
| `section` + `category` combine as AND | pass |
| `pdfs[]` / `links[]` on list and detail, `[]` not `null` | pass |
| Pagination unaffected | pass |

### One thing left: the seed values

Every category is currently `"blog"` — the default. Per the table above, these two should be
`"research"`:

| Category | Slug | Should be |
|---|---|---|
| Price Index | `price-index` | `research` |
| Market Report | `market-report` | `research` |

Until that is set, `/research` on the website is empty and every article shows under `/blog`.
It is one edit per category in the admin, no code involved.

`pdfs[]` and `links[]` are live but empty on every post, which is expected — nothing has been
attached yet.

## Already delivered, for reference

`?category=<slug>` on posts and `category_slug` / `category_id` on the post payload both
landed and are in use. Verified against production: `?category=price-index` → 4 posts,
`?category=market-report` → 0, unknown slug → 0. Thanks.
