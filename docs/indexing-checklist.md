# Indexing Checklist

Use this checklist after deploying SEO or routing changes.

## 1. Check Live HTML

Verify representative URLs in the browser and page source:

- `https://168innovative.co.th/categories/spout`
- `https://168innovative.co.th/categories/spout/plastic-spout-hl086d-8-6mm`
- `https://168innovative.co.th/categories/dispensing-press-cap/q20-04`
- `https://168innovative.co.th/articles/spout-oem-guide`

Confirm all of the following:

- No `noindex` in `<meta name="robots">`
- Canonical points to the current public URL
- Page returns `200 OK`
- Main content is visible in rendered HTML
- Internal links to related product/category pages are present

## 2. Check Redirects

Verify legacy URLs return a single `301` to the correct destination:

- `/product/...`
- `/category?category=...`
- `https://www.168innovative.co.th/...`
- `http://168innovative.co.th/...`
- `/index`

Good result:

- Legacy URL -> `301` -> final canonical URL

Bad result:

- redirect chain longer than 1 hop
- redirect to unrelated category root
- `302` instead of `301`

## 3. Check Sitemap

Open:

- `https://168innovative.co.th/sitemap.xml`

Confirm:

- target category URLs exist
- target product URLs exist
- article URLs exist
- URLs use `https://168innovative.co.th` non-www

## 4. Check Internal Links

Confirm these pages link deeper into product pages:

- homepage
- category pages
- article detail pages

Priority:

- article -> category
- article -> product
- category -> product

## 5. Check Google Search Console

Use URL Inspection on:

- homepage
- one category
- one product
- one article

Confirm:

- URL is available to Google
- user-declared canonical matches Google-selected canonical
- indexing allowed
- sitemap detected

Then:

- request indexing for priority pages
- validate fixes for redirect/indexing issues

## 6. Priority Pages To Submit First

- `/categories/spout`
- `/categories/spout/plastic-spout-hl086d-8-6mm`
- `/categories/spout/plastic-spout-hl160d-16mm`
- `/categories/dispensing-press-cap`
- `/categories/dispensing-press-cap/q20-04`
- `/articles/spout-oem-guide`
- `/articles/pump-dispenser-oem-guide`
- `/articles/mascara-packaging-oem`

## 7. Watch For

- pages marked `Discovered - currently not indexed`
- pages marked `Crawled - currently not indexed`
- Google selecting a different canonical
- legacy URLs still being crawled more often than canonical URLs
- pages with thin content or missing product specs
