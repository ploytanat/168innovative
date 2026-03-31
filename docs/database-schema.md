# Database Schema

The full MariaDB schema for this project lives in [innova_core.sql](/C:/Users/User/Desktop/168innovative/innova_core.sql).

## Coverage

This schema covers the whole website:

- global site settings and page SEO
- navigation and footer links
- company profile, contact methods, and company gallery
- home hero slides, hero stats, hero chips, ticker, process, testimonials
- about page sections
- why-us items
- categories, products, variants, specs, media, FAQs
- articles, article categories, article tags, content blocks, and block rows

## Table groups

### Global / shared

- `site_settings`
- `page_seo`
- `page_section_headers`
- `site_navigation_items`
- `footer_link_groups`
- `footer_links`

### Company

- `company_profiles`
- `company_contact_methods`
- `company_gallery_images`

### Home page

- `home_hero_slides`
- `home_hero_slide_stats`
- `home_hero_slide_chips`
- `home_ticker_items`
- `home_featured_product_slots`
- `home_process_steps`
- `testimonials`
- `why_items`

### About page

- `about_sections`

### Catalog

- `categories`
- `products`
- `product_variants`
- `product_variant_options`
- `product_specs`
- `product_media`
- `faq_items`

### Articles

- `articles`
- `article_categories`
- `article_tags`
- `article_category_relations`
- `article_tag_relations`
- `article_blocks`
- `article_block_checklist_items`
- `article_block_comparison_rows`

## Notes

- The schema follows the current codebase pattern of storing localized content as `*_th` and `*_en`.
- `faq_items` now supports `category`, `product`, `article`, and `page`.
- `page_section_headers` is the shared layer for section eyebrow, title, description, and CTA copy.
- `home_featured_product_slots` is intended to replace hardcoded featured product ordering later.
- `article_blocks` matches the richer article structure already defined in the view models.
