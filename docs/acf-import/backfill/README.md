# SEO Backfill

This folder contains generated ACF value patches for the live WordPress content.

## What It Is

- `wp-seo-backfill-plan.json`
  Combined dry-run plan for all content types
- `products-patches.json`
- `categories-patches.json`
- `articles-patches.json`
- `about-patches.json`
- `home-patches.json`

These files do not create duplicate posts. They describe updates for existing records by `id`.

## How It Was Generated

Source script:

- `scripts/generate-wp-seo-backfill.mjs`

Default mode:

- dry-run only

Command:

```bash
node scripts/generate-wp-seo-backfill.mjs
```

## What It Backfills

- product canonical URLs
- category canonical URLs
- article canonical URLs
- OG title / OG description defaults
- OG image defaults where a source image already exists
- missing `product_category.name_th`
- `about.hero_image_2_alt_en`
- home page SEO defaults
- article `reading_time_minutes`

It only fills fields that are currently empty.

## Apply Options

### Option A: REST apply

```bash
node scripts/generate-wp-seo-backfill.mjs --apply
```

That mode attempts to write directly to WordPress over the REST API using the credentials in `.env.local`.

### Option B: WP-CLI apply

Source script:

- `scripts/wp-cli-apply-seo-backfill.php`

Run this from the WordPress site using `wp eval-file`.

Dry-run:

```bash
wp eval-file /path/to/repo/scripts/wp-cli-apply-seo-backfill.php dry-run report=/path/to/repo/docs/acf-import/backfill/wp-cli-dry-run.json
```

Apply:

```bash
wp eval-file /path/to/repo/scripts/wp-cli-apply-seo-backfill.php apply report=/path/to/repo/docs/acf-import/backfill/wp-cli-apply-result.json
```

Only selected sections:

```bash
wp eval-file /path/to/repo/scripts/wp-cli-apply-seo-backfill.php apply include=products,categories
```

Limit to a few items first:

```bash
wp eval-file /path/to/repo/scripts/wp-cli-apply-seo-backfill.php apply include=products limit=5
```

This importer:

- updates existing records only
- reads ACF field keys from `docs/acf-import/168innovative-acf-field-groups.json`
- skips fields that already have a saved value in WordPress
- supports `product`, `product_category`, `article`, `about`, and the `home` page

## Recommended Workflow

1. Review `wp-seo-backfill-plan.json`
2. Spot-check a few product/category/article patches
3. Back up the database
4. Prefer WP-CLI for production if REST write auth is unreliable
5. Run a small WP-CLI dry-run or `--limit=5` apply first

## If REST Write Auth Fails

Use one of these instead:

- fix the WordPress application password / REST auth
- run the same logic via WP-CLI on the server
- import the generated patch files through a bulk import tool such as WP All Import
