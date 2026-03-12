# ACF Import Bundle

Use this bundle to import the updated field groups into WordPress via ACF.

## Files

- `168innovative-acf-field-groups.json`
  Import this file in WordPress admin at `Custom Fields > Tools > Import Field Groups`
- `local-json/`
  One JSON file per field group, useful if the team later wants to use ACF local JSON sync

## Import Steps

1. Back up the WordPress database first.
2. In WordPress admin, open `Custom Fields > Tools`.
3. Under `Import Field Groups`, choose `168innovative-acf-field-groups.json`.
4. Import the bundle.
5. Open each field group once and confirm the location rules and labels look correct.

## What This Bundle Does

- preserves the existing ACF group keys from the live export
- preserves the existing field keys where possible, so the import is designed to update the current groups instead of creating a parallel schema
- adds the missing official `product_category.name_th` field using the legacy key already found in term meta
- fixes the broken duplicate About field by changing `field_699584280a900` to `hero_image_2_alt_en`
- cleans the company email label to `Email 3`
- adds the new SEO fields documented in `docs/backend-seo-field-spec.md`

## Notes

- the Home field group now targets `page_type == front_page` instead of a fixed page ID
- the Article field group now includes `Content Blocks` via ACF Flexible Content as the primary body model for new articles
- the legacy Article `content_th` and `content_en` fields are retained as fallback fields for migration and older content
- the Article canonical fields are upgraded to ACF `url` fields for better validation
- this bundle assumes the CPTs already exist on the WordPress site:
  `product`, `article`, `hero_slide`, `why`, `about`, `company`
- this bundle assumes taxonomy `product_category` already exists
- the Article flexible schema also assumes `article_category` and `article_tag` taxonomies already exist

## Generated From

- `scripts/generate-acf-import.mjs`
- `docs/168innovativecms.WordPress.2026-03-10.xml`
