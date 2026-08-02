# Bucket C — Hostinger / host-layer SEO setup

Canonical origin: **https://hayyakpm.com** (HTTPS, non-www).
Deploy mode: **Nuxt SSR (Node app)** — `nuxt build` → run `.output/server/index.mjs`.

## What the app already handles (no action needed)
- **www → non-www + HTTP → HTTPS 301** — `server/middleware/canonical-host.js`
  (production only, scoped to `hayyakpm.com`).
- **Unprefixed → /en/ 301** — `server/middleware/redirect-unprefixed.js`.
- **Compression** — static assets pre-generated as `.gz`/`.br` (`nitro.compressPublicAssets`).
- **Immutable cache** on `/_nuxt/**` build assets.
- **No mixed content** — all first-party assets are HTTPS; CMS is HTTPS.

## Do in hPanel (one-time)
1. **SSL** → issue/verify the free SSL for `hayyakpm.com` (and `www`).
2. **SSL → Force HTTPS**: ON.
3. **Domain**: set `hayyakpm.com` as primary; add a redirect `www.hayyakpm.com → hayyakpm.com` if the panel offers it.
4. **Node.js app**: set the app root, startup file `.output/server/index.mjs`,
   Node 20+, and env:
   - `NODE_ENV=production`
   - (optional) `NUXT_PUBLIC_SCRIPTS_GOOGLE_MAPS_API_KEY=<key>`
5. Build command: `npm ci && npm run build`. Start: `node .output/server/index.mjs`.

## `.htaccess` (only if serving via Apache/LiteSpeed docroot or static export)
Copy `deploy/.htaccess` → `public_html/.htaccess`. Redundant with the app
middleware for the Node app, but harmless as an edge fallback.

## Post-deploy verification (run these)
```bash
# 301s to the canonical origin
curl -sI http://hayyakpm.com/         | grep -i location   # -> https://hayyakpm.com/
curl -sI https://www.hayyakpm.com/    | grep -i location   # -> https://hayyakpm.com/
curl -sI https://hayyakpm.com/properties | grep -i location # -> /en/properties

# compression active
curl -sI -H 'Accept-Encoding: br,gzip' https://hayyakpm.com/en | grep -i content-encoding

# canonical + hreflang present, server-rendered
curl -s https://hayyakpm.com/ar/about | grep -iE 'canonical|hreflang'

# sitemap + robots live
curl -sI https://hayyakpm.com/sitemap_index.xml | head -1
curl -s  https://hayyakpm.com/robots.txt
```

## Still on you (accounts / content — not code)
- Google Search Console verify + submit `https://hayyakpm.com/sitemap_index.xml`.
- Bing Webmaster Tools verify + submit sitemap.
- GA4 install + events (both /en and /ar).
- 301 map for any **old/retired URLs** (need the list).
- Professional Arabic content QA (home, services, contact).
- Final validation: Rich Results Test, Merkle hreflang tester, Screaming Frog crawl, PageSpeed/CWV.
- A real **1200×630 OG share image** (currently falls back to the logo).
