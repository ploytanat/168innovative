# Backend SEO Field Spec

See also: `docs/acf-content-architecture.md`

This file is the SEO-focused subset. The full content model, slug strategy, and editor workflow live in `docs/acf-content-architecture.md`.

This spec is designed for WordPress + ACF and matches the current Next.js frontend structure and the WordPress export bundle from March 10, 2026.

## Rules

- Use one WordPress object per real entity. Do not create separate TH and EN posts for the same page.
- Keep native WordPress `slug` as one shared English-only slug for both locales.
- Use lowercase snake_case for all ACF field names.
- Keep Thai and English fields separate when content is locale-specific.
- Rows marked `Recommended new field` are not consistently present in the export yet.
- Do not publish content if required SEO fields are empty.

## 1. Global Options Page

Create one ACF Options Page: `SEO Settings`

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Site name TH | `site_name_th` | Text | Yes | Example: 168 Innovative |
| Site name EN | `site_name_en` | Text | Yes | Example: 168 Innovative |
| Default meta title TH | `default_meta_title_th` | Text | Yes | Homepage fallback |
| Default meta title EN | `default_meta_title_en` | Text | Yes | Homepage fallback |
| Default meta description TH | `default_meta_description_th` | Textarea | Yes | 140-160 chars |
| Default meta description EN | `default_meta_description_en` | Textarea | Yes | 140-160 chars |
| Default OG image | `default_og_image` | Image | Yes | 1200x630 |
| Organization logo | `organization_logo` | Image | Yes | PNG preferred |
| Primary phone | `organization_phone_primary` | Text | Yes | Schema use |
| Primary email | `organization_email_primary` | Email | Yes | Schema use |
| Street address TH | `street_address_th` | Text | Yes | Schema use |
| Street address EN | `street_address_en` | Text | Yes | Schema use |
| Address locality | `address_locality` | Text | Yes | Example: Bang Khun Thian |
| Address region | `address_region` | Text | Yes | Example: Bangkok |
| Postal code | `postal_code` | Text | Yes | Schema use |
| Country code | `address_country_code` | Text | Yes | Example: TH |
| Latitude | `geo_latitude` | Number | No | LocalBusiness schema |
| Longitude | `geo_longitude` | Number | No | LocalBusiness schema |
| Facebook URL | `facebook_url` | URL | No | `sameAs` |
| Line URL | `line_url` | URL | No | `sameAs` |
| LinkedIn URL | `linkedin_url` | URL | No | `sameAs` |
| Google Search Console verification | `gsc_verification` | Text | No | Meta tag |
| Bing verification | `bing_verification` | Text | No | Meta tag |
| Facebook App ID | `facebook_app_id` | Text | No | OG enhancement |

## 2. Article Field Group

Attach to post type: `article`

### Content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title TH | `title_th` | Text | Yes | Already used |
| Title EN | `title_en` | Text | Yes | Already used |
| Excerpt TH | `excerpt_th` | Textarea | Yes | Already used |
| Excerpt EN | `excerpt_en` | Textarea | Yes | Already used |
| Content TH | `content_th` | WYSIWYG | Yes | Already used |
| Content EN | `content_en` | WYSIWYG | Yes | Already used |
| Cover image | `image` | Image | Yes | Already used |
| Cover image alt TH | `image_alt_th` | Text | Yes | Already used |
| Cover image alt EN | `image_alt_en` | Text | Yes | Already used |
| Author name | `author_name` | Text | No | Recommended new field for Article schema |
| Reading time minutes | `reading_time_minutes` | Number | No | Recommended new field |
| Primary category | `primary_category` | Taxonomy | No | Recommended new field |
| Related products | `related_products` | Relationship | No | Recommended new field |
| Related articles | `related_articles` | Relationship | No | Recommended new field |

### SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already used |
| SEO title EN | `seo_title_en` | Text | Yes | Already used |
| Meta description TH | `meta_description_th` | Textarea | Yes | Already used |
| Meta description EN | `meta_description_en` | Textarea | Yes | Already used |
| Canonical URL TH | `canonical_url_th` | URL | No | Already used |
| Canonical URL EN | `canonical_url_en` | URL | No | Already used |
| Focus keyword | `focus_keyword` | Text | No | Already used, legacy single field |
| Focus keyword TH | `focus_keyword_th` | Text | No | Recommended new field |
| Focus keyword EN | `focus_keyword_en` | Text | No | Recommended new field |
| OG title TH | `og_title_th` | Text | No | Recommended new field |
| OG title EN | `og_title_en` | Text | No | Recommended new field |
| OG description TH | `og_description_th` | Textarea | No | Recommended new field |
| OG description EN | `og_description_en` | Textarea | No | Recommended new field |
| OG image | `og_image` | Image | No | Recommended new field |
| Robots index | `robots_index` | True/False | Yes | Recommended new field, default true |
| Robots follow | `robots_follow` | True/False | Yes | Recommended new field, default true |

### FAQ Repeater

Create repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | Textarea or WYSIWYG | Yes |
| Answer EN | `answer_en` | Textarea or WYSIWYG | Yes |

## 3. Product Field Group

Attach to post type: `product`

### Core Content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Product name TH | `name_th` | Text | Yes | Already used |
| Product name EN | `name_en` | Text | Yes | Already used |
| Short description TH | `description_th` | Textarea | Yes | Already used |
| Short description EN | `description_en` | Textarea | Yes | Already used |
| Long content TH | `content_th` | WYSIWYG | No | Recommended new field |
| Long content EN | `content_en` | WYSIWYG | No | Recommended new field |
| Main image alt TH | `image_alt_th` | Text | Yes | Already used |
| Main image alt EN | `image_alt_en` | Text | Yes | Already used |
| Application TH | `application_th` | Textarea | No | Already used |
| Application EN | `application_en` | Textarea | No | Already used |
| SKU | `sku` | Text | No | Recommended new field |
| Brand name | `brand_name` | Text | No | Recommended new field |
| Material | `material` | Text | No | Recommended new field |
| Capacity | `capacity` | Text | No | Recommended new field |
| Dimensions | `dimensions` | Text | No | Recommended new field |
| MOQ | `moq` | Text | No | Recommended new field |
| Lead time days | `lead_time_days` | Number | No | Recommended new field |
| Availability status | `availability_status` | Select | No | Recommended new field |
| Specs JSON | `specs_json` | Textarea | Yes | Already used by current code |
| Related products | `related_products` | Relationship | No | Recommended new field |
| Related articles | `related_articles` | Relationship | No | Recommended new field |

### SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already used |
| SEO title EN | `seo_title_en` | Text | Yes | Already used |
| SEO description TH | `seo_description_th` | Textarea | Yes | Already used |
| SEO description EN | `seo_description_en` | Textarea | Yes | Already used |
| Canonical URL TH | `canonical_url_th` | URL | No | Recommended new field |
| Canonical URL EN | `canonical_url_en` | URL | No | Recommended new field |
| Focus keyword TH | `focus_keyword_th` | Text | No | Recommended new field |
| Focus keyword EN | `focus_keyword_en` | Text | No | Recommended new field |
| OG title TH | `og_title_th` | Text | No | Recommended new field |
| OG title EN | `og_title_en` | Text | No | Recommended new field |
| OG description TH | `og_description_th` | Textarea | No | Recommended new field |
| OG description EN | `og_description_en` | Textarea | No | Recommended new field |
| OG image | `og_image` | Image | No | Recommended new field |
| Robots index | `robots_index` | True/False | Yes | Recommended new field, default true |
| Robots follow | `robots_follow` | True/False | Yes | Recommended new field, default true |

### Product FAQ Repeater

Create repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | Textarea or WYSIWYG | Yes |
| Answer EN | `answer_en` | Textarea or WYSIWYG | Yes |

## 4. Category Field Group

Attach to taxonomy: `product_category`

### Content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Name TH | `name_th` | Text | Yes | Recommended new field. Export shows ad hoc meta on 1 term but no official field definition yet |
| Name EN | `name_en` | Text | Yes | Already used |
| Description TH | `description_th` | Textarea | Yes | Already used |
| Description EN | `description_en` | Textarea | Yes | Already used |
| Intro content TH | `intro_html_th` | WYSIWYG | No | Recommended new field |
| Intro content EN | `intro_html_en` | WYSIWYG | No | Recommended new field |
| Category image | `image` | Image | Yes | Already used |
| Category image alt TH | `image_alt_th` | Text | Yes | Recommended new field |
| Category image alt EN | `image_alt_en` | Text | Yes | Recommended new field |
| Featured products | `featured_products` | Relationship | No | Recommended new field |
| Related articles | `related_articles` | Relationship | No | Recommended new field |

### SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already used |
| SEO title EN | `seo_title_en` | Text | Yes | Already used |
| SEO description TH | `seo_description_th` | Textarea | Yes | Already used |
| SEO description EN | `seo_description_en` | Textarea | Yes | Already used |
| Canonical URL TH | `canonical_url_th` | URL | No | Recommended new field |
| Canonical URL EN | `canonical_url_en` | URL | No | Recommended new field |
| Focus keyword TH | `focus_keyword_th` | Text | No | Recommended new field |
| Focus keyword EN | `focus_keyword_en` | Text | No | Recommended new field |
| OG title TH | `og_title_th` | Text | No | Recommended new field |
| OG title EN | `og_title_en` | Text | No | Recommended new field |
| OG description TH | `og_description_th` | Textarea | No | Recommended new field |
| OG description EN | `og_description_en` | Textarea | No | Recommended new field |
| OG image | `og_image` | Image | No | Recommended new field |
| Robots index | `robots_index` | True/False | Yes | Recommended new field, default true |
| Robots follow | `robots_follow` | True/False | Yes | Recommended new field, default true |

### Category FAQ Repeater

Create repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | Textarea or WYSIWYG | Yes |
| Answer EN | `answer_en` | Textarea or WYSIWYG | Yes |

## 5. Singleton Page SEO

Apply these fields to singleton content such as `home` page and `about` entry.

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | `about` already has this pattern |
| SEO title EN | `seo_title_en` | Text | Yes | `about` already has this pattern |
| SEO description TH | `seo_description_th` | Textarea | Yes | `about` already has this pattern |
| SEO description EN | `seo_description_en` | Textarea | Yes | `about` already has this pattern |
| Canonical URL TH | `canonical_url_th` | URL | No | Recommended new field |
| Canonical URL EN | `canonical_url_en` | URL | No | Recommended new field |
| OG title TH | `og_title_th` | Text | No | Recommended new field |
| OG title EN | `og_title_en` | Text | No | Recommended new field |
| OG description TH | `og_description_th` | Textarea | No | Recommended new field |
| OG description EN | `og_description_en` | Textarea | No | Recommended new field |
| OG image | `og_image` | Image | No | Recommended new field |
| Robots index | `robots_index` | True/False | Yes | Recommended new field, default true |
| Robots follow | `robots_follow` | True/False | Yes | Recommended new field, default true |

## 6. Redirect Field Group

Recommended custom post type: `seo_redirect`

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Old path | `old_path` | Text | Yes | Example: `/product/old-slug` |
| New path | `new_path` | Text | Yes | Example: `/categories/pump-bottle/new-slug` |
| Status code | `status_code` | Select | Yes | `301`, `302` |
| Locale | `locale` | Select | No | `th`, `en`, `all` |
| Enabled | `enabled` | True/False | Yes | Default true |

## 7. Publish Validation Checklist

### Article

- `title_th`, `title_en`
- `excerpt_th`, `excerpt_en`
- `content_th`, `content_en`
- `seo_title_th`, `seo_title_en`
- `meta_description_th`, `meta_description_en`
- `image_alt_th`, `image_alt_en`
- featured image assigned

### Product

- `name_th`, `name_en`
- `description_th`, `description_en`
- `seo_title_th`, `seo_title_en`
- `seo_description_th`, `seo_description_en`
- `image_alt_th`, `image_alt_en`
- featured image assigned
- product category assigned

### Category

- `name_th`, `name_en`
- `description_th`, `description_en`
- `seo_title_th`, `seo_title_en`
- `seo_description_th`, `seo_description_en`
- taxonomy image assigned

## 8. Priority Order

### P0

- all current SEO fields already used by code
- official `product_category.name_th` field
- category/product/article canonical fields
- robots index/follow
- localized image alt fields

### P1

- FAQ repeaters
- related content fields
- OG overrides
- author and reading time
- category intro content
- product long content

### P2

- redirect post type
- verification tokens
- geo/opening hours
- manual featured content controls
