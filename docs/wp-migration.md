# WordPress to MariaDB Migration

Source dump used:
- `C:\Users\User\Desktop\innova_wp_8fju2_2026-03-31_11-13-41.sql`

Generated files:
- SQL data dump: [exports/innova_core_data_from_wp_2026-03-31.sql](C:/Users/User/Desktop/168innovative/exports/innova_core_data_from_wp_2026-03-31.sql)
- Generator script: [scripts/wp_dump_to_innova_core.py](C:/Users/User/Desktop/168innovative/scripts/wp_dump_to_innova_core.py)

## Import order
1. Import schema from [innova_core.sql](C:/Users/User/Desktop/168innovative/innova_core.sql)
2. Import data from [exports/innova_core_data_from_wp_2026-03-31.sql](C:/Users/User/Desktop/168innovative/exports/innova_core_data_from_wp_2026-03-31.sql)

## Migrated content
- `site_settings`
- `page_seo`
- `company_profiles`
- `company_contact_methods`
- `company_gallery_images`
- `home_hero_slides`
- `why_items`
- `about_sections`
- `categories`
- `products`
- `product_specs`
- `product_media`
- `faq_items`
- `articles`
- `article_categories`
- `article_tags`
- `article_blocks`

## Notes
- WordPress source uses custom post types plus ACF stored in `posts`, `postmeta`, `terms`, and `termmeta`.
- `content_blocks` from WordPress are preserved as full article HTML in `articles.content_*` and mirrored into one `rich_text` row in `article_blocks`.
- 52 products in the source dump had no `product_category` relation. They are preserved under a fallback category:
  - slug: `uncategorized-migrated`
  - Thai label: `สินค้ารอจัดหมวด`
- Sections that do not exist as structured content in the WordPress dump, such as `home_process_steps`, `testimonials`, `footer_links`, and `site_navigation_items`, are not auto-generated here.
