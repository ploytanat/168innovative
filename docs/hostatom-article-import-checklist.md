# HostAtom Article Import Checklist

This checklist covers the full article import flow for the WordPress environment hosted on HostAtom.

## 1. Preflight

1. Confirm the target site is the correct environment.
2. Back up the WordPress database before any import.
3. Confirm these already exist in WordPress:
   - CPT `article`
   - taxonomy `article_category`
   - taxonomy `article_tag`
   - ACF Pro with REST support enabled for the field group
4. Confirm the image URLs referenced in the source JSON already exist in the same WordPress media library if you want featured images to resolve automatically.

## 2. Import ACF Schema

1. Log in to WordPress admin on HostAtom.
2. Open `Custom Fields > Tools`.
3. Under `Import Field Groups`, select [168innovative-acf-field-groups.json](C:/Users/User/Desktop/168innovative/docs/acf-import/168innovative-acf-field-groups.json).
4. Import the bundle.
5. Open `Article Fields` once and verify these fields exist:
   - `Content Blocks`
   - `Primary Category`
   - `Article Tags`
   - `Published At`
   - `Updated At`
   - `Legacy Content TH`
   - `Legacy Content EN`

## 3. Prepare Local Environment

1. On the machine that will run the import, set:
   - `WP_API_URL`
   - `WP_USERNAME`
   - `WP_APP_PASSWORD`
2. Prepare the source JSON path, for example:
   - `C:\Users\User\Desktop\backup file\custom-product-rest\articles_wordpress_oem_updated.json`
3. Optional: prepare a taxonomy map JSON if you want to assign `article_category`, `article_tag`, related products, related articles, or custom author names during import.

Example taxonomy map:

```json
{
  "spout-oem-guide": {
    "article_category": [12],
    "article_tag": [4, 8],
    "primary_category": 12,
    "article_tags": [4, 8],
    "related_products": [101, 102],
    "related_articles": [55],
    "author_name": "168 Innovative Editorial"
  }
}
```

## 4. Dry Run

1. Run:

```bash
node docs/scripts/import-wordpress-articles.mjs \
  --mode dry-run \
  --status draft \
  --input "C:\Users\User\Desktop\backup file\custom-product-rest\articles_wordpress_oem_updated.json" \
  --report "docs/acf-import/backfill/article-import-dry-run.json"
```

2. Review the report:
   - each slug is present
   - `hasContentBlocks` is `true`
   - `contentBlockCount` is at least `1`
   - taxonomy assignment looks correct if you supplied a map

### Option B: WP-CLI dry-run on HostAtom

If you have shell access on the WordPress host and `wp` is available, run:

```bash
wp eval-file /path/to/repo/docs/scripts/wp-cli-import-articles.php dry-run \
  input=/path/to/articles_wordpress_oem_updated.json \
  report=/path/to/repo/docs/acf-import/backfill/wp-cli-article-import-dry-run.json
```

## 5. Apply Import

1. Run:

```bash
node docs/scripts/import-wordpress-articles.mjs \
  --mode apply \
  --status draft \
  --input "C:\Users\User\Desktop\backup file\custom-product-rest\articles_wordpress_oem_updated.json" \
  --report "docs/acf-import/backfill/article-import-apply.json"
```

2. If you created a taxonomy map, add:

```bash
--taxonomy-map "C:\path\to\article-taxonomy-map.json"
```

### Option B: WP-CLI apply on HostAtom

```bash
wp eval-file /path/to/repo/docs/scripts/wp-cli-import-articles.php apply \
  input=/path/to/articles_wordpress_oem_updated.json \
  report=/path/to/repo/docs/acf-import/backfill/wp-cli-article-import-apply.json \
  taxonomy-map=/path/to/repo/docs/acf-import/backfill/article-taxonomy-map.json
```

## 6. Post-Import Verification

1. In WordPress admin, open `Articles > All Articles`.
2. Confirm all imported articles exist.
3. Open 2-3 articles and verify:
   - title and excerpt fields are populated
   - `Content Blocks` contains one `Rich Text Section`
   - `Legacy Content TH/EN` still contain the original HTML
   - featured image is attached if the media resolver found a match
4. Load the frontend article pages and confirm:
   - article detail renders correctly
   - `content_blocks` render on the page
   - fallback still works for legacy content

## 7. Publish Workflow

1. Keep imported posts as `draft` first.
2. Review and clean up any article that still contains old inline-heavy HTML.
3. Assign proper taxonomy and relation fields where needed.
4. Publish only after frontend verification is complete.

## 8. Rollback

1. If the import result is bad, restore the database backup.
2. Do not hand-edit large batches first.
3. Fix the import map or source JSON, then re-run dry-run before apply again.
