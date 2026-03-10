# WordPress Export Audit

Sources analyzed:

- [docs/168innovativecms.WordPress.2026-03-10.xml](C:/Users/User/Desktop/168innovative/docs/168innovativecms.WordPress.2026-03-10.xml)
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10.xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (1).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (2).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (3).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (4).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (5).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (6).xml`
- `C:\Users\User\Downloads\168innovativecms.WordPress.2026-03-10 (7).xml`

Supporting inventory:

- [wordpress-export-content-inventory.csv](C:/Users/User/Desktop/168innovative/docs/wordpress-export-content-inventory.csv)

This document summarizes what is actually present in the WordPress export bundle as of March 10, 2026, and how it compares to the current frontend data model.

## Executive Summary

The export bundle is useful and confirms the current content architecture direction, but it is still not a complete migration snapshot of the live frontend data model.

What is clearly confirmed:

- ACF field groups exist for `product`, `article`, `product_category`, `hero_slide`, `why`, `about`, `company`, and home hero content
- product category URLs already use one shared English slug across TH and EN
- homepage singleton content currently lives on the normal page with slug `home`
- one `company` record exists and matches the current frontend fairly well
- standard WordPress `post` entries exist for article-like content, but they only contain a smaller legacy SEO shape

What is still missing from the export bundle:

- actual `product` content records
- actual `article` CPT records
- actual `about` content record
- actual `why` records
- actual `hero_slide` records

Key cleanup items revealed by the export:

- formally add `name_th` to the `Product Category Fields` group
- remove stale company meta key `email3`
- fix the `About Fields` admin label typo for `hero_image_2_alt_en`

## 1. Export Bundle Map

The download bundle is split by export scope. The files contain:

- `168innovativecms.WordPress.2026-03-10.xml`
  Aggregate export with 294 items, 8 `product_category` terms, and 1 `article_tag`
- `168innovativecms.WordPress.2026-03-10 (1).xml`
  11 standard `post` records
- `168innovativecms.WordPress.2026-03-10 (2).xml`
  3 `page` records
- `168innovativecms.WordPress.2026-03-10 (3).xml`
  empty export
- `168innovativecms.WordPress.2026-03-10 (4).xml`
  empty export
- `168innovativecms.WordPress.2026-03-10 (5).xml`
  8 `acf-field-group` records
- `168innovativecms.WordPress.2026-03-10 (6).xml`
  121 `acf-field` records
- `168innovativecms.WordPress.2026-03-10 (7).xml`
  1 `company` record and 14 related `attachment` records

Practical interpretation:

- the split exports are real partial exports, not duplicates of the full file
- files `(3)` and `(4)` were exported with no content in scope
- the aggregate file is still the best single source for term meta and cross-checking counts

## 2. Observed Total Counts From the Aggregate Export

Item types found:

- `attachment`: 148
- `acf-field`: 121
- `post`: 11
- `acf-field-group`: 8
- `page`: 3
- `company`: 1
- `wp_global_styles`: 1
- `wp_navigation`: 1

Taxonomies found:

- `product_category`: 8
- `article_tag`: 1

Important absences:

- no `product` items
- no `article` items
- no `hero_slide` items
- no `why` items
- no `about` items

## 3. Observed ACF Field Groups

The export includes these ACF field groups:

- `Product Fields`
- `Home - Hero Section`
- `Hero Slide Fields`
- `Product Category Fields`
- `Why Fields`
- `Company Fields`
- `About Fields`
- `Article Fields`

This proves the editorial schema exists in WordPress even where the content records were not exported.

## 4. ACF Group Notes That Matter

### Product Fields

Confirmed current fields:

- `name_th`
- `name_en`
- `description_th`
- `description_en`
- `image_alt_th`
- `image_alt_en`
- `specs_json`
- `seo_title_th`
- `seo_title_en`
- `seo_description_th`
- `seo_description_en`
- `application_th`
- `application_en`

Implication:

- the current product model is already bilingual and SEO-aware
- `specs_json` is still the live compatibility field and has not yet been replaced by a structured repeater

### Product Category Fields

Confirmed official fields:

- `name_en`
- `description_th`
- `description_en`
- `image`
- `seo_title_th`
- `seo_title_en`
- `seo_description_th`
- `seo_description_en`

Important mismatch:

- the field group does not formally define `name_th`
- term meta shows `name_th` exists on 1 category anyway

Implication:

- Thai category naming is currently half-migrated
- the clean next step is to officially add `name_th` to the field group, then backfill all terms

### Article Fields

Confirmed official fields:

- `image`
- `focus_keyword`
- `image_alt_th`
- `image_alt_en`
- `title_th`
- `title_en`
- `seo_title_th`
- `seo_title_en`
- `meta_description_th`
- `meta_description_en`
- `canonical_url_th`
- `canonical_url_en`
- `excerpt_th`
- `excerpt_en`
- `content_th`
- `content_en`

Implication:

- the intended article model is clearly bilingual and already close to what the frontend expects
- `focus_keyword` is still a single shared field, not localized TH/EN fields

### About Fields

Confirmed official fields include:

- hero title and description in TH/EN
- hero image 1 and hero image 2 with localized alt fields
- who section title, description, and image in TH/EN
- SEO title and SEO description in TH/EN

Admin issue found:

- `hero_image_2_alt_en` is labeled in ACF as `Hero Image 1 Alt EN`

This appears to be a field label typo, not a field-name bug.

### Company Fields

Confirmed official fields include:

- localized company name and address
- three fixed phone slots with localized labels
- three fixed social slots
- three email slots
- line QR and contact media

Data hygiene issue found:

- content contains both `email_3` and `email3`

Recommended cleanup:

- keep `email_3`
- remove `email3`

## 5. Product Category State

Observed slugs:

- `spout`
- `powder-compact`
- `soap-bag`
- `plastic-handle`
- `mascara-packaging`
- `dispensing-press-cap`
- `lipstick-packaging`
- `ball-chain`

Observed term meta counts:

- `name_en`: 8
- `description_th`: 8
- `description_en`: 8
- `image`: 8
- `seo_title_th`: 8
- `seo_title_en`: 8
- `seo_description_th`: 8
- `seo_description_en`: 8
- `name_th`: 1

This confirms the current route strategy is already:

- one shared English slug
- one category entity used by both locales

That fits the frontend architecture well and should be kept.

The one unresolved issue is display-name ownership:

- Thai still mainly depends on native WP term `name`
- English already depends on ACF `name_en`
- `name_th` exists conceptually but is not formally implemented across the taxonomy yet

## 6. Home State

Observed page records:

- `home`
- `sample-page__trashed`
- `privacy-policy__trashed`

Observed home page fields:

- `hero_title_th`
- `hero_title_en`
- `hero_description_th`
- `hero_description_en`
- `hero_image`

This means homepage singleton content currently lives on a normal WordPress page instead of an options page.

That is acceptable, but only if the team documents that page slug `home` is the authoritative record.

## 7. Company State

Observed content:

- one `company` record with slug `company-info`

This aligns with the current frontend expectation of a single company object and is compatible with the recommended architecture.

The current weakness is not structure but editor ergonomics:

- phone, email, and social data are stored in rigid numbered slots
- those fields work, but repeaters would be cleaner long term

## 8. Article State

Observed content:

- 11 standard `post` records

Observed relevant meta on those posts:

- `featured_image`
- `focus_keyword`
- `meta_description`
- `seo_title`

Important mismatch:

- the standard posts do not carry the bilingual ACF article structure defined by `Article Fields`
- no actual `article` CPT records were exported

Likely explanation:

- the exported `post` entries are legacy blog content or an older article model
- the live frontend may still depend on a separate `article` CPT or API source that was not included in the export

Do not treat the 11 standard posts as the final canonical article architecture.

## 9. Structural Match vs Frontend

Areas that match the current frontend direction:

- single-record bilingual content model
- shared English slug strategy
- bilingual SEO fields on categories, products, and articles
- localized image alt fields in core content types
- singleton company content

Areas still unresolved because of export gaps:

- real `product` content coverage
- real `article` CPT coverage
- real `hero_slide` coverage
- real `why` coverage
- real `about` content coverage

## 10. Recommended Next Steps

### P0

- keep shared English slug strategy for all current routes
- add official `name_th` field to `Product Category Fields`
- backfill `name_th` for every `product_category`
- clean duplicate company key `email3`
- fix About admin label typo

### P1

- re-export WordPress with these scopes explicitly:
  - `product`
  - `article`
  - `about`
  - `why`
  - `hero_slide`
- confirm the export environment is the same environment used by the live frontend API

### P2

- migrate Thai category display fully from native term `name` to ACF `name_th`
- replace `specs_json` with structured repeater data once the API is updated
- convert rigid company phone/email/social fields into repeaters

## 11. Recommended Final Model

Based on both the export bundle and the current frontend code, the best long-term model is:

- native WP slug: English only
- one WordPress object per real entity
- Thai and English stored in the same ACF record
- category/product/article/about/company remain bilingual single-source objects

Do not move to localized slugs yet unless you also plan to redesign:

- routes
- sitemap logic
- canonical logic
- hreflang mapping
- API lookups
