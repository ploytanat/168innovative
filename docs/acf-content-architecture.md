# ACF Content Architecture

This document defines the recommended WordPress + ACF structure for the current project.

Use this document as the main source of truth for content modeling, editor workflow, and future API changes.

## 1. Recommended Architecture

### Core decision

Use **one WordPress object per real entity**, with **Thai and English fields stored inside the same ACF record**.

That means:

- one `product` post stores both Thai and English content
- one `article` post stores both Thai and English content
- one `product_category` term stores both Thai and English content
- one `about` record stores both Thai and English content
- one `company` record stores both Thai and English content

This matches how the code already works today.

### Why this is the right fit now

- your routes already assume one shared slug for TH and EN
- the frontend already switches fields by locale, not by different WP records
- editors only manage one content record per product/article instead of two
- it avoids hreflang and canonical complexity from cross-post translation mapping

### Observed current state from the March 10, 2026 export bundle

- the export bundle confirms this single-record bilingual model for categories, company, home content, and ACF schemas
- `product_category` currently has an official ACF field for `name_en`, but not for `name_th`
- one category term already contains ad hoc `name_th` term meta, which means the team started the migration but did not finish it
- `company` data contains a stale duplicate key `email3` in addition to `email_3`
- the `About Fields` group has a label typo where `hero_image_2_alt_en` is labeled as `Hero Image 1 Alt EN`
- the export bundle still does not include actual `product`, `article`, `about`, `why`, or `hero_slide` content records, so those CPTs still need a clean re-export if you want a full migration snapshot

## 2. Slug Strategy

### Recommendation

Keep **native WordPress slug** as **English-only shared slug** for both locales.

Examples:

- TH: `/categories/lipstick-bottle`
- EN: `/en/categories/lipstick-bottle`
- TH product: `/categories/lipstick-bottle/round-gold-case`
- EN product: `/en/categories/lipstick-bottle/round-gold-case`

### Why keep English slug only

- WordPress native post/term slug supports only one value
- your Next.js routes already use one shared slug across locales
- English slugs are stable, ASCII-safe, and easier for redirects/import/export
- Thai URLs are possible later, but they require route and API refactor

### Important rule

Do **not** create `slug_th` and `slug_en` now unless you plan to change routing.

For the current system:

- use native WP `slug` as the canonical route slug
- keep it English only
- store localized display text in ACF

## 3. What Should Live in Native WP Fields vs ACF

### Native WP fields

Use native WordPress fields only for:

- `slug`
- publish status
- publish date
- modified date
- featured image where appropriate
- taxonomy assignment

### ACF fields

Use ACF for:

- all localized text
- SEO fields
- alt text per locale
- CTA labels
- repeater content
- FAQ
- ordering
- related content
- schema-supporting fields

### Practical note

For categories, your current code still reads native WP term `name` as Thai display text. Long term, the cleaner model is:

- native `name`: admin-friendly label only
- ACF `name_th`
- ACF `name_en`

But because the current code uses WP `name` for Thai, you have two options:

1. Keep native term `name` as Thai for now
2. Later migrate code to read `name_th` from ACF for consistency

I recommend option 2 as the future target.

## 4. Content Types You Should Have

### Custom Post Types

- `product`
- `article`
- `hero_slide`
- `why`
- `about`
- `company`
- `seo_redirect` optional but recommended

### Taxonomies

- `product_category`
- `article_category`
- `article_tag`

### Options Pages

- `site_settings`
- `seo_settings`
- `schema_settings`

You can keep `about` and `company` as single-entry CPTs if you prefer, but `site_settings` and `seo_settings` should still exist as options pages.

## 5. Field Group Naming Convention

Create ACF field groups with names like:

- `FG - Product - Content`
- `FG - Product - SEO`
- `FG - Product Category - Content`
- `FG - Product Category - SEO`
- `FG - Article - Content`
- `FG - Article - SEO`
- `FG - Hero Slide`
- `FG - About`
- `FG - Company`
- `FG - Site Settings`
- `FG - SEO Settings`

Use lowercase snake_case for every field name.

## 6. Product Category Structure

Attach this field group to taxonomy: `product_category`

### Native WordPress term fields

- `slug`
  Notes:
  English-only shared slug
- `name`
  Notes:
  short admin label; for now can remain Thai if code still depends on it

### ACF fields: Content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Name TH | `name_th` | Text | Yes | Recommended target field. Must be added to the field group officially |
| Name EN | `name_en` | Text | Yes | Frontend EN label |
| Short description TH | `description_th` | Textarea | Yes | Short card/intro text |
| Short description EN | `description_en` | Textarea | Yes | Short card/intro text |
| Long intro TH | `intro_html_th` | WYSIWYG | No | For category landing content |
| Long intro EN | `intro_html_en` | WYSIWYG | No | For category landing content |
| Category image | `image` | Image | Yes | Main category visual |
| Category image alt TH | `image_alt_th` | Text | Yes | Localized alt text |
| Category image alt EN | `image_alt_en` | Text | Yes | Localized alt text |
| Sort order | `sort_order` | Number | No | Manual ordering in listings |
| Is featured | `is_featured` | True/False | No | Homepage/category promotion |
| Related articles | `related_articles` | Relationship | No | Article internal links |
| Featured products | `featured_products` | Relationship | No | Optional manual highlight |

### ACF fields: SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already aligned with code |
| SEO title EN | `seo_title_en` | Text | Yes | Already aligned with code |
| SEO description TH | `seo_description_th` | Textarea | Yes | Already aligned with code |
| SEO description EN | `seo_description_en` | Textarea | Yes | Already aligned with code |
| Focus keyword TH | `focus_keyword_th` | Text | No | For editorial targeting |
| Focus keyword EN | `focus_keyword_en` | Text | No | For editorial targeting |
| Canonical URL TH | `canonical_url_th` | URL | No | Only for override cases |
| Canonical URL EN | `canonical_url_en` | URL | No | Only for override cases |
| OG title TH | `og_title_th` | Text | No | Optional override |
| OG title EN | `og_title_en` | Text | No | Optional override |
| OG description TH | `og_description_th` | Textarea | No | Optional override |
| OG description EN | `og_description_en` | Textarea | No | Optional override |
| OG image | `og_image` | Image | No | Optional override |
| Robots index | `robots_index` | True/False | Yes | Default true |
| Robots follow | `robots_follow` | True/False | Yes | Default true |

### ACF fields: FAQ repeater

Repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | WYSIWYG | Yes |
| Answer EN | `answer_en` | WYSIWYG | Yes |
| Sort order | `sort_order` | Number | No |

## 7. Product Structure

Attach to CPT: `product`

### Native WordPress fields

- `slug`
  Notes:
  English-only shared slug
- `featured_image`
  Notes:
  Main product image
- taxonomy assignment: `product_category`

### ACF fields: Core identity

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Product name TH | `name_th` | Text | Yes | Already aligned with code |
| Product name EN | `name_en` | Text | Yes | Already aligned with code |
| SKU | `sku` | Text | No | Strongly recommended |
| Product code | `product_code` | Text | No | Internal reference |
| Brand name | `brand_name` | Text | No | Schema/Product detail |
| Manufacturer name | `manufacturer_name` | Text | No | Schema/Product detail |
| Availability status | `availability_status` | Select | No | `in_stock`, `preorder`, `out_of_stock` |
| MOQ | `moq` | Text | No | Commerce intent |
| Lead time | `lead_time` | Text | No | Commerce intent |
| Country of origin | `country_of_origin` | Text | No | Optional |

### ACF fields: Localized content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Short description TH | `description_th` | Textarea | Yes | Already aligned with code |
| Short description EN | `description_en` | Textarea | Yes | Already aligned with code |
| Long content TH | `content_th` | WYSIWYG | No | Recommended for richer product pages |
| Long content EN | `content_en` | WYSIWYG | No | Recommended for richer product pages |
| Image alt TH | `image_alt_th` | Text | Yes | Already available in code now |
| Image alt EN | `image_alt_en` | Text | Yes | Already available in code now |
| Summary bullets TH | `summary_bullets_th` | Repeater | No | Optional |
| Summary bullets EN | `summary_bullets_en` | Repeater | No | Optional |

### ACF fields: Media gallery

Repeater: `gallery_images`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Image | `image` | Image | Yes |
| Alt TH | `alt_th` | Text | Yes |
| Alt EN | `alt_en` | Text | Yes |
| Sort order | `sort_order` | Number | No |

### ACF fields: Specifications

#### Recommended model

Use repeater `specs` instead of raw JSON.

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Spec label TH | `label_th` | Text | Yes | Example: วัสดุ |
| Spec label EN | `label_en` | Text | Yes | Example: Material |
| Spec value TH | `value_th` | Text | Yes | Example: พลาสติก PP |
| Spec value EN | `value_en` | Text | Yes | Example: PP Plastic |
| Sort order | `sort_order` | Number | No | Display order |

#### Backward compatibility

Keep existing field:

- `specs_json`

Short-term rule:

- editors use repeater `specs`
- backend/API layer converts `specs` to frontend shape
- once code is migrated, `specs_json` can be deprecated

### ACF fields: Related content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Related products | `related_products` | Relationship | No | Manual override |
| Related articles | `related_articles` | Relationship | No | Topic cluster linking |
| Use cases TH | `use_cases_th` | WYSIWYG | No | SEO enrichment |
| Use cases EN | `use_cases_en` | WYSIWYG | No | SEO enrichment |

### ACF fields: SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already present in export |
| SEO title EN | `seo_title_en` | Text | Yes | Already present in export |
| SEO description TH | `seo_description_th` | Textarea | Yes | Already present in export |
| SEO description EN | `seo_description_en` | Textarea | Yes | Already present in export |
| Focus keyword TH | `focus_keyword_th` | Text | No | Recommended |
| Focus keyword EN | `focus_keyword_en` | Text | No | Recommended |
| Canonical URL TH | `canonical_url_th` | URL | No | Only override if needed |
| Canonical URL EN | `canonical_url_en` | URL | No | Only override if needed |
| OG title TH | `og_title_th` | Text | No | Optional override |
| OG title EN | `og_title_en` | Text | No | Optional override |
| OG description TH | `og_description_th` | Textarea | No | Optional override |
| OG description EN | `og_description_en` | Textarea | No | Optional override |
| OG image | `og_image` | Image | No | Optional override |
| Robots index | `robots_index` | True/False | Yes | Default true |
| Robots follow | `robots_follow` | True/False | Yes | Default true |

### ACF fields: FAQ

Repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | WYSIWYG | Yes |
| Answer EN | `answer_en` | WYSIWYG | Yes |
| Sort order | `sort_order` | Number | No |

## 8. Article Structure

Attach to CPT: `article`

### Native WordPress fields

- `slug`
  Notes:
  English-only shared slug
- `featured_image`
  Notes:
  Main article cover
- `date`
  Notes:
  Publish date
- taxonomies:
  `article_category`, `article_tag`

### ACF fields: Localized content

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title TH | `title_th` | Text | Yes | Already aligned with code |
| Title EN | `title_en` | Text | Yes | Already aligned with code |
| Excerpt TH | `excerpt_th` | Textarea | Yes | Already aligned with code |
| Excerpt EN | `excerpt_en` | Textarea | Yes | Already aligned with code |
| Content TH | `content_th` | WYSIWYG | Yes | Already aligned with code |
| Content EN | `content_en` | WYSIWYG | Yes | Already aligned with code |
| Cover alt TH | `image_alt_th` | Text | Yes | Already aligned with code |
| Cover alt EN | `image_alt_en` | Text | Yes | Already aligned with code |
| Author name | `author_name` | Text | No | Schema |
| Reading time minutes | `reading_time_minutes` | Number | No | Better than hardcoded UI |
| Related products | `related_products` | Relationship | No | Commerce linking |
| Related articles | `related_articles` | Relationship | No | Topic cluster |

### ACF fields: SEO

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes | Already aligned with code |
| SEO title EN | `seo_title_en` | Text | Yes | Already aligned with code |
| Meta description TH | `meta_description_th` | Textarea | Yes | Already aligned with code |
| Meta description EN | `meta_description_en` | Textarea | Yes | Already aligned with code |
| Focus keyword TH | `focus_keyword_th` | Text | No | Recommended new field |
| Focus keyword EN | `focus_keyword_en` | Text | No | Recommended new field |
| Canonical URL TH | `canonical_url_th` | URL | No | Already aligned in concept |
| Canonical URL EN | `canonical_url_en` | URL | No | Already aligned in concept |
| OG title TH | `og_title_th` | Text | No | Optional override |
| OG title EN | `og_title_en` | Text | No | Optional override |
| OG description TH | `og_description_th` | Textarea | No | Optional override |
| OG description EN | `og_description_en` | Textarea | No | Optional override |
| OG image | `og_image` | Image | No | Optional override |
| Robots index | `robots_index` | True/False | Yes | Default true |
| Robots follow | `robots_follow` | True/False | Yes | Default true |

### ACF fields: FAQ

Repeater: `faq_items`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Question TH | `question_th` | Text | Yes |
| Question EN | `question_en` | Text | Yes |
| Answer TH | `answer_th` | WYSIWYG | Yes |
| Answer EN | `answer_en` | WYSIWYG | Yes |
| Sort order | `sort_order` | Number | No |

## 9. Hero Slide Structure

Attach to CPT: `hero_slide`

### Native WordPress fields

- featured image
- slug optional, not public-facing

### ACF fields

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title TH | `title_th` | Text | Yes | Already aligned with code |
| Title EN | `title_en` | Text | Yes | Already aligned with code |
| Subtitle TH | `subtitle_th` | Text | No | Already aligned with code |
| Subtitle EN | `subtitle_en` | Text | No | Already aligned with code |
| Description TH | `description_th` | Textarea | Yes | Already aligned with code |
| Description EN | `description_en` | Textarea | Yes | Already aligned with code |
| CTA primary text TH | `cta_primary_text_th` | Text | Yes | Already aligned |
| CTA primary text EN | `cta_primary_text_en` | Text | Yes | Already aligned |
| CTA primary link | `cta_primary_link` | URL | Yes | Already aligned |
| CTA secondary text TH | `cta_secondary_text_th` | Text | No | Already aligned |
| CTA secondary text EN | `cta_secondary_text_en` | Text | No | Already aligned |
| CTA secondary link | `cta_secondary_link` | URL | No | Already aligned |
| Featured image alt TH | `image_alt_th` | Text | Yes | Recommended new field |
| Featured image alt EN | `image_alt_en` | Text | Yes | Recommended new field |
| Order | `order` | Number | No | Manual hero order |
| Is active | `is_active` | True/False | Yes | Default true |

## 10. Why Structure

Attach to CPT: `why`

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title TH | `title_th` | Text | Yes | Already aligned with code |
| Title EN | `title_en` | Text | Yes | Already aligned with code |
| Description TH | `description_th` | Textarea | Yes | Already aligned with code |
| Description EN | `description_en` | Textarea | Yes | Already aligned with code |
| Image | `image` | Image | Yes | Already aligned with code |
| Image alt TH | `image_alt_th` | Text | Yes | Recommended new field |
| Image alt EN | `image_alt_en` | Text | Yes | Recommended new field |
| Order | `order` | Number | No | Already aligned in concept |
| Is active | `is_active` | True/False | Yes | Default true |

## 11. About Structure

Attach to single-entry CPT: `about`

Only one published record should exist.

### Hero

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Hero title TH | `hero_title_th` | Text | Yes |
| Hero title EN | `hero_title_en` | Text | Yes |
| Hero description TH | `hero_description_th` | Textarea | Yes |
| Hero description EN | `hero_description_en` | Textarea | Yes |
| Hero image 1 | `hero_image_1` | Image | No |
| Hero image 1 alt TH | `hero_image_1_alt_th` | Text | No |
| Hero image 1 alt EN | `hero_image_1_alt_en` | Text | No |
| Hero image 2 | `hero_image_2` | Image | No |
| Hero image 2 alt TH | `hero_image_2_alt_th` | Text | No |
| Hero image 2 alt EN | `hero_image_2_alt_en` | Text | No |

### Who We Are

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Who title TH | `who_title_th` | Text | Yes |
| Who title EN | `who_title_en` | Text | Yes |
| Who description TH | `who_description_th` | WYSIWYG | Yes |
| Who description EN | `who_description_en` | WYSIWYG | Yes |
| Who image | `who_image` | Image | No |
| Who image alt TH | `who_image_alt_th` | Text | No |
| Who image alt EN | `who_image_alt_en` | Text | No |

### SEO

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| SEO title TH | `seo_title_th` | Text | Yes |
| SEO title EN | `seo_title_en` | Text | Yes |
| SEO description TH | `seo_description_th` | Textarea | Yes |
| SEO description EN | `seo_description_en` | Textarea | Yes |
| OG image | `og_image` | Image | No |

## 12. Company Structure

Attach to single-entry CPT: `company`

Only one published record should exist.

### Identity

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Company name TH | `name_th` | Text | Yes |
| Company name EN | `name_en` | Text | Yes |
| Legal name TH | `legal_name_th` | Text | No |
| Legal name EN | `legal_name_en` | Text | No |
| Logo | `logo` | Image | Yes |

### Address

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Address TH | `address_th` | Textarea | Yes |
| Address EN | `address_en` | Textarea | Yes |
| Street address TH | `street_address_th` | Text | No |
| Street address EN | `street_address_en` | Text | No |
| Locality | `address_locality` | Text | No |
| Region | `address_region` | Text | No |
| Postal code | `postal_code` | Text | No |
| Country code | `address_country_code` | Text | No |
| Latitude | `geo_latitude` | Number | No |
| Longitude | `geo_longitude` | Number | No |

### Phones

Keep current compact structure if preferred:

- `phone_1_number`
- `phone_1_label_th`
- `phone_1_label_en`
- `phone_2_number`
- `phone_2_label_th`
- `phone_2_label_en`
- `phone_3_number`
- `phone_3_label_th`
- `phone_3_label_en`

Long-term cleaner model:

Repeater `phones`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Number | `number` | Text | Yes |
| Label TH | `label_th` | Text | Yes |
| Label EN | `label_en` | Text | Yes |
| Sort order | `sort_order` | Number | No |

### Emails

Current compact structure:

- `email_1`
- `email_2`
- `email_3`

Long-term cleaner model:

Repeater `emails`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Email | `email` | Email | Yes |
| Sort order | `sort_order` | Number | No |

### Socials

Current structure already works but is rigid:

- `social_1_type`
- `social_1_url`
- `social_1_icon`
- `social_2_type`
- `social_2_url`
- `social_2_icon`
- `social_3_type`
- `social_3_url`
- `social_3_icon`

Recommended future structure:

Repeater `social_links`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Type | `type` | Select | Yes |
| URL | `url` | URL | Yes |
| Icon | `icon` | Image | No |
| Label TH | `label_th` | Text | No |
| Label EN | `label_en` | Text | No |
| Sort order | `sort_order` | Number | No |

### Contact media

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Line QR | `line_qr` | Image | No |
| Contact image | `contact_image` | Image | No |
| Contact image 1 | `contact_image_1` | Image | No |
| Contact image 1 alt TH | `contact_image_1_alt_th` | Text | No |
| Contact image 1 alt EN | `contact_image_1_alt_en` | Text | No |
| Contact image 2 | `contact_image_2` | Image | No |
| Contact image 2 alt TH | `contact_image_2_alt_th` | Text | No |
| Contact image 2 alt EN | `contact_image_2_alt_en` | Text | No |
| Contact image 3 | `contact_image_3` | Image | No |
| Contact image 3 alt TH | `contact_image_3_alt_th` | Text | No |
| Contact image 3 alt EN | `contact_image_3_alt_en` | Text | No |
| Contact image 4 | `contact_image_4` | Image | No |
| Contact image 4 alt TH | `contact_image_4_alt_th` | Text | No |
| Contact image 4 alt EN | `contact_image_4_alt_en` | Text | No |

## 13. Article Category Taxonomy

Even if not fully used yet, prepare it correctly now.

Attach to taxonomy: `article_category`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Name TH | `name_th` | Text | Yes |
| Name EN | `name_en` | Text | Yes |
| Description TH | `description_th` | Textarea | No |
| Description EN | `description_en` | Textarea | No |
| SEO title TH | `seo_title_th` | Text | No |
| SEO title EN | `seo_title_en` | Text | No |
| SEO description TH | `seo_description_th` | Textarea | No |
| SEO description EN | `seo_description_en` | Textarea | No |

Slug rule:

- keep native term slug in English only

## 14. Article Tag Taxonomy

Tags can stay simpler.

Attach to taxonomy: `article_tag`

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Name TH | `name_th` | Text | No |
| Name EN | `name_en` | Text | No |

If the team will not localize tags, it is acceptable to keep one shared English tag label only.

## 15. Options Pages

### Site Settings

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Default locale | `default_locale` | Select | Yes |
| Default OG image | `default_og_image` | Image | Yes |
| Favicon | `site_favicon` | Image | No |
| Sitewide noindex | `sitewide_noindex` | True/False | No |

### SEO Settings

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Homepage title TH | `home_title_th` | Text | Yes |
| Homepage title EN | `home_title_en` | Text | Yes |
| Homepage meta description TH | `home_meta_description_th` | Textarea | Yes |
| Homepage meta description EN | `home_meta_description_en` | Textarea | Yes |
| Homepage OG image | `home_og_image` | Image | No |
| Search Console verification | `gsc_verification` | Text | No |
| Bing verification | `bing_verification` | Text | No |
| Facebook App ID | `facebook_app_id` | Text | No |

### Schema Settings

| Label | Field name | Type | Required |
| --- | --- | --- | --- |
| Organization name | `organization_name` | Text | Yes |
| Organization logo | `organization_logo` | Image | Yes |
| Primary phone | `organization_phone` | Text | Yes |
| Primary email | `organization_email` | Email | Yes |
| SameAs links | `same_as_links` | Repeater | No |

## 16. Redirect Structure

Attach to CPT: `seo_redirect`

| Label | Field name | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Old path | `old_path` | Text | Yes | Example: `/product/old-slug` |
| New path | `new_path` | Text | Yes | Example: `/categories/pump-bottle/new-slug` |
| Status code | `status_code` | Select | Yes | `301` or `302` |
| Enabled | `enabled` | True/False | Yes | Default true |

## 17. Editor Workflow Rules

### Category

- create one category term
- set English slug once
- fill `name_th`, `name_en`
- fill short descriptions
- upload category image
- fill SEO title and description for both languages

### Product

- create one product post
- set English slug once
- assign one category term
- fill TH/EN names and descriptions
- upload featured image and alt text
- fill repeater specs
- fill SEO fields

### Article

- create one article post
- set English slug once
- assign article category/tags
- fill TH/EN title, excerpt, and content
- upload featured image and alt text
- fill SEO fields

## 18. Publish Validation

### Must be present before publish

#### Product

- slug
- category
- `name_th`
- `name_en`
- `description_th`
- `description_en`
- featured image
- `image_alt_th`
- `image_alt_en`
- `seo_title_th`
- `seo_title_en`
- `seo_description_th`
- `seo_description_en`

#### Category

- slug
- `name_th`
- `name_en`
- `description_th`
- `description_en`
- category image
- `seo_title_th`
- `seo_title_en`
- `seo_description_th`
- `seo_description_en`

#### Article

- slug
- `title_th`
- `title_en`
- `excerpt_th`
- `excerpt_en`
- `content_th`
- `content_en`
- featured image
- `image_alt_th`
- `image_alt_en`
- `seo_title_th`
- `seo_title_en`
- `meta_description_th`
- `meta_description_en`

## 19. Migration Advice From Current State

### Safe now

- keep category slug English only
- keep product/article slug English only
- add missing SEO and locale fields through ACF
- keep one bilingual object per entity

### Next cleanup to plan

- move Thai category name from native WP term `name` to ACF `name_th`
- replace rigid company/social/email fields with repeaters
- replace product `specs_json` with structured repeater
- add localized alt fields to hero/why media

### Do not do yet

- localized slugs
- duplicated TH and EN products/articles as separate posts
- separate TH and EN categories as separate terms

Those changes would force route, sitemap, canonical, and API redesign.

## 20. Best Final Direction

For this project, the most stable long-term structure is:

- shared English slug
- one WP object per real entity
- all TH and EN content in ACF
- full SEO fields per locale
- structured repeaters instead of raw JSON
- options pages for sitewide SEO and schema settings
