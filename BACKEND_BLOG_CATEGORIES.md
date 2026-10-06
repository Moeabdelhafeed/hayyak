# Backend request — blog categories

We're adding a category view to the insights/blog section: categories listed, and the
posts shown under the category you pick.

`general/blog/categories` already gives us everything we need on the category side —
`id`, `name` (correctly localized), `slug`, `description`, `color`, `cover_image`,
`posts_count`. Thanks for `updated_at` on posts, that one landed and is in use.

Two gaps block the posts side. Both are small.

---

## 1. `general/blog/posts` ignores the category filter

There is no way to ask for the posts of one category. Unknown query params look like they
are dropped, so every variation returns the full list:

```
GET general/blog/posts?category=price-index      -> 3 posts
GET general/blog/posts?category_id=2             -> 3 posts
GET general/blog/posts?category_slug=price-index -> 3 posts
GET general/blog/posts?category=market-report    -> 3 posts   <- should be 0
```

That last one is the clearest case: `market-report` reports `posts_count: 0` in
`general/blog/categories`, but asking for its posts returns all three Price Index posts.

**Ask:** support `?category=<slug>` on `general/blog/posts`, paginated like the
unfiltered list. An unknown slug should return an empty list rather than everything.

Without it the only way to build the view is to fetch every page of posts and group them
in the browser. That works at 3 posts; it stops working as soon as posts span more than
one page.

---

## 2. Posts carry the category as a translated label, with no stable key

```json
// Accept-Language: en          // Accept-Language: ar
"category": "Price Index"       "category": "مؤشر الأسعار"
```

It is the display name, so matching a post to its category means string-comparing a
translated value. It breaks the moment someone renames a category in one language, and it
gives us nothing to put in a URL.

**Ask:** add `category_id` and `category_slug` alongside the existing `category` string,
on both the list and detail endpoints. Keep `category` as-is — we still want the
localized label for display.

```json
{
  "slug": "arpi-pulse-q12026",
  "title": "ARPI Pulse Q1/2026",
  "category": "Price Index",
  "category_id": 2,
  "category_slug": "price-index"
}
```

---
