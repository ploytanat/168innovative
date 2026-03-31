-- ============================================================
-- innova_core - Full Website Schema
-- Target    : MariaDB / MySQL compatible hosting
-- Charset   : utf8mb4 / utf8mb4_unicode_ci
-- Purpose   : Content + catalog + company + marketing sections
-- ============================================================

CREATE DATABASE IF NOT EXISTS innova_core
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE innova_core;

SET NAMES utf8mb4;

-- ============================================================
-- Global site settings and shared metadata
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id                           TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_name_th                 VARCHAR(255) NOT NULL,
  site_name_en                 VARCHAR(255) NULL,
  site_title_suffix_th         VARCHAR(255) NULL,
  site_title_suffix_en         VARCHAR(255) NULL,
  default_meta_title_th        VARCHAR(255) NULL,
  default_meta_title_en        VARCHAR(255) NULL,
  default_meta_description_th  TEXT NULL,
  default_meta_description_en  TEXT NULL,
  default_og_image_url         VARCHAR(500) NULL,
  default_og_image_alt_th      VARCHAR(255) NULL,
  default_og_image_alt_en      VARCHAR(255) NULL,
  favicon_url                  VARCHAR(500) NULL,
  default_locale               ENUM('th', 'en') NOT NULL DEFAULT 'th',
  timezone_name                VARCHAR(100) NOT NULL DEFAULT 'Asia/Bangkok',
  line_official_url            VARCHAR(500) NULL,
  facebook_url                 VARCHAR(500) NULL,
  instagram_url                VARCHAR(500) NULL,
  shopee_url                   VARCHAR(500) NULL,
  created_at                   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_seo (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key             VARCHAR(120) NOT NULL,
  title_th             VARCHAR(255) NULL,
  title_en             VARCHAR(255) NULL,
  description_th       TEXT NULL,
  description_en       TEXT NULL,
  keywords_th          TEXT NULL,
  keywords_en          TEXT NULL,
  canonical_path_th    VARCHAR(500) NULL,
  canonical_path_en    VARCHAR(500) NULL,
  og_image_url         VARCHAR(500) NULL,
  og_image_alt_th      VARCHAR(255) NULL,
  og_image_alt_en      VARCHAR(255) NULL,
  robots_index         TINYINT(1) NOT NULL DEFAULT 1,
  robots_follow        TINYINT(1) NOT NULL DEFAULT 1,
  created_at           TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_page_seo_page_key (page_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_section_headers (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key                VARCHAR(120) NOT NULL,
  section_key             VARCHAR(120) NOT NULL,
  eyebrow_th              VARCHAR(255) NULL,
  eyebrow_en              VARCHAR(255) NULL,
  title_th                VARCHAR(255) NULL,
  title_en                VARCHAR(255) NULL,
  description_th          TEXT NULL,
  description_en          TEXT NULL,
  cta_primary_label_th    VARCHAR(255) NULL,
  cta_primary_label_en    VARCHAR(255) NULL,
  cta_primary_href        VARCHAR(500) NULL,
  cta_secondary_label_th  VARCHAR(255) NULL,
  cta_secondary_label_en  VARCHAR(255) NULL,
  cta_secondary_href      VARCHAR(500) NULL,
  sort_order              INT NOT NULL DEFAULT 0,
  is_published            TINYINT(1) NOT NULL DEFAULT 1,
  created_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_page_section_headers (page_key, section_key),
  KEY idx_page_section_headers_page (page_key, sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_navigation_items (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  menu_key       VARCHAR(60) NOT NULL DEFAULT 'primary',
  label_th       VARCHAR(255) NOT NULL,
  label_en       VARCHAR(255) NULL,
  href           VARCHAR(500) NOT NULL,
  target         VARCHAR(20) NOT NULL DEFAULT '_self',
  icon_name      VARCHAR(100) NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  is_published   TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_site_navigation_items_menu (menu_key, sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS footer_link_groups (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_key      VARCHAR(100) NOT NULL,
  title_th       VARCHAR(255) NOT NULL,
  title_en       VARCHAR(255) NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  is_published   TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_footer_link_groups_key (group_key),
  KEY idx_footer_link_groups_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS footer_links (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id       BIGINT UNSIGNED NOT NULL,
  label_th       VARCHAR(255) NOT NULL,
  label_en       VARCHAR(255) NULL,
  href           VARCHAR(500) NOT NULL,
  target         VARCHAR(20) NOT NULL DEFAULT '_self',
  sort_order     INT NOT NULL DEFAULT 0,
  is_published   TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_footer_links_group (group_id, sort_order, is_published),
  CONSTRAINT fk_footer_links_group
    FOREIGN KEY (group_id) REFERENCES footer_link_groups (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Company / contact / organization profile
-- ============================================================

CREATE TABLE IF NOT EXISTS company_profiles (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  legal_name_th           VARCHAR(255) NOT NULL,
  legal_name_en           VARCHAR(255) NULL,
  display_name_th         VARCHAR(255) NOT NULL,
  display_name_en         VARCHAR(255) NULL,
  tagline_th              VARCHAR(255) NULL,
  tagline_en              VARCHAR(255) NULL,
  address_th              TEXT NULL,
  address_en              TEXT NULL,
  tax_id                  VARCHAR(100) NULL,
  map_url                 VARCHAR(500) NULL,
  map_embed_url           TEXT NULL,
  business_hours_th       TEXT NULL,
  business_hours_en       TEXT NULL,
  logo_url                VARCHAR(500) NULL,
  logo_alt_th             VARCHAR(255) NULL,
  logo_alt_en             VARCHAR(255) NULL,
  line_qr_url             VARCHAR(500) NULL,
  line_qr_alt_th          VARCHAR(255) NULL,
  line_qr_alt_en          VARCHAR(255) NULL,
  contact_image_url       VARCHAR(500) NULL,
  contact_image_alt_th    VARCHAR(255) NULL,
  contact_image_alt_en    VARCHAR(255) NULL,
  is_published            TINYINT(1) NOT NULL DEFAULT 1,
  created_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS company_contact_methods (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id         BIGINT UNSIGNED NOT NULL,
  contact_type       ENUM('phone', 'email', 'line', 'facebook', 'instagram', 'shopee', 'whatsapp', 'wechat', 'map', 'other') NOT NULL,
  label_th           VARCHAR(255) NULL,
  label_en           VARCHAR(255) NULL,
  person_name_th     VARCHAR(255) NULL,
  person_name_en     VARCHAR(255) NULL,
  department_th      VARCHAR(255) NULL,
  department_en      VARCHAR(255) NULL,
  value              VARCHAR(255) NULL,
  url                VARCHAR(500) NULL,
  icon_url           VARCHAR(500) NULL,
  icon_alt           VARCHAR(255) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_primary         TINYINT(1) NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_company_contact_methods_company (company_id, contact_type, sort_order, is_published),
  CONSTRAINT fk_company_contact_methods_company
    FOREIGN KEY (company_id) REFERENCES company_profiles (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS company_gallery_images (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id         BIGINT UNSIGNED NOT NULL,
  image_url          VARCHAR(500) NOT NULL,
  alt_th             VARCHAR(255) NULL,
  alt_en             VARCHAR(255) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_company_gallery_images_company (company_id, sort_order, is_published),
  CONSTRAINT fk_company_gallery_images_company
    FOREIGN KEY (company_id) REFERENCES company_profiles (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Home page content
-- ============================================================

CREATE TABLE IF NOT EXISTS home_hero_slides (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  theme                   ENUM('rose', 'sky', 'violet', 'emerald') NOT NULL DEFAULT 'rose',
  badge_variant           ENUM('hot', 'new', 'promo', 'featured') NOT NULL DEFAULT 'featured',
  badge_text_th           VARCHAR(255) NOT NULL,
  badge_text_en           VARCHAR(255) NULL,
  title_th                VARCHAR(255) NOT NULL,
  title_en                VARCHAR(255) NULL,
  description_th          TEXT NULL,
  description_en          TEXT NULL,
  image_url               VARCHAR(500) NOT NULL,
  image_alt_th            VARCHAR(255) NULL,
  image_alt_en            VARCHAR(255) NULL,
  cta_primary_label_th    VARCHAR(255) NOT NULL,
  cta_primary_label_en    VARCHAR(255) NULL,
  cta_primary_href        VARCHAR(500) NOT NULL,
  cta_secondary_label_th  VARCHAR(255) NULL,
  cta_secondary_label_en  VARCHAR(255) NULL,
  cta_secondary_href      VARCHAR(500) NULL,
  highlight_value         VARCHAR(100) NULL,
  highlight_label_th      VARCHAR(255) NULL,
  highlight_label_en      VARCHAR(255) NULL,
  visual_title_th         VARCHAR(255) NULL,
  visual_title_en         VARCHAR(255) NULL,
  visual_subtitle_th      TEXT NULL,
  visual_subtitle_en      TEXT NULL,
  sort_order              INT NOT NULL DEFAULT 0,
  is_published            TINYINT(1) NOT NULL DEFAULT 1,
  created_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_home_hero_slides_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_hero_slide_stats (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slide_id           BIGINT UNSIGNED NOT NULL,
  metric_value       VARCHAR(100) NOT NULL,
  label_th           VARCHAR(255) NULL,
  label_en           VARCHAR(255) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_home_hero_slide_stats_slide (slide_id, sort_order),
  CONSTRAINT fk_home_hero_slide_stats_slide
    FOREIGN KEY (slide_id) REFERENCES home_hero_slides (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_hero_slide_chips (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slide_id           BIGINT UNSIGNED NOT NULL,
  label_th           VARCHAR(255) NOT NULL,
  label_en           VARCHAR(255) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_home_hero_slide_chips_slide (slide_id, sort_order),
  CONSTRAINT fk_home_hero_slide_chips_slide
    FOREIGN KEY (slide_id) REFERENCES home_hero_slides (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_ticker_items (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  label_th           VARCHAR(255) NOT NULL,
  label_en           VARCHAR(255) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_home_ticker_items_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_featured_product_slots (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slot_key           VARCHAR(120) NOT NULL,
  product_slug       VARCHAR(190) NOT NULL,
  variant_slug       VARCHAR(190) NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_home_featured_product_slots_key (slot_key),
  KEY idx_home_featured_product_slots_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS home_process_steps (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  icon_name          VARCHAR(100) NULL,
  title_th           VARCHAR(255) NOT NULL,
  title_en           VARCHAR(255) NULL,
  description_th     TEXT NULL,
  description_en     TEXT NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_home_process_steps_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key              VARCHAR(120) NOT NULL DEFAULT 'home',
  person_name           VARCHAR(255) NOT NULL,
  role_th               VARCHAR(255) NULL,
  role_en               VARCHAR(255) NULL,
  company_name_th       VARCHAR(255) NULL,
  company_name_en       VARCHAR(255) NULL,
  quote_th              TEXT NULL,
  quote_en              TEXT NULL,
  avatar_type           ENUM('emoji', 'image') NOT NULL DEFAULT 'emoji',
  avatar_emoji          VARCHAR(20) NULL,
  avatar_url            VARCHAR(500) NULL,
  avatar_alt_th         VARCHAR(255) NULL,
  avatar_alt_en         VARCHAR(255) NULL,
  rating                TINYINT UNSIGNED NOT NULL DEFAULT 5,
  sort_order            INT NOT NULL DEFAULT 0,
  is_featured           TINYINT(1) NOT NULL DEFAULT 1,
  is_published          TINYINT(1) NOT NULL DEFAULT 1,
  created_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_page (page_key, sort_order, is_featured, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS why_items (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key           VARCHAR(120) NOT NULL DEFAULT 'home',
  section_key        VARCHAR(120) NOT NULL DEFAULT 'why',
  icon_name          VARCHAR(100) NULL,
  image_url          VARCHAR(500) NULL,
  image_alt_th       VARCHAR(255) NULL,
  image_alt_en       VARCHAR(255) NULL,
  title_th           VARCHAR(255) NOT NULL,
  title_en           VARCHAR(255) NULL,
  description_th     TEXT NULL,
  description_en     TEXT NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  is_published       TINYINT(1) NOT NULL DEFAULT 1,
  created_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_why_items_page (page_key, section_key, sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- About page content
-- ============================================================

CREATE TABLE IF NOT EXISTS about_sections (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_key              VARCHAR(120) NOT NULL,
  eyebrow_th               VARCHAR(255) NULL,
  eyebrow_en               VARCHAR(255) NULL,
  title_th                 VARCHAR(255) NOT NULL,
  title_en                 VARCHAR(255) NULL,
  description_th           LONGTEXT NULL,
  description_en           LONGTEXT NULL,
  image_primary_url        VARCHAR(500) NULL,
  image_primary_alt_th     VARCHAR(255) NULL,
  image_primary_alt_en     VARCHAR(255) NULL,
  image_secondary_url      VARCHAR(500) NULL,
  image_secondary_alt_th   VARCHAR(255) NULL,
  image_secondary_alt_en   VARCHAR(255) NULL,
  sort_order               INT NOT NULL DEFAULT 0,
  is_published             TINYINT(1) NOT NULL DEFAULT 1,
  created_at               TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_about_sections_key (section_key),
  KEY idx_about_sections_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Catalog / categories / products
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug                  VARCHAR(190) NOT NULL,
  name_th               VARCHAR(255) NOT NULL,
  name_en               VARCHAR(255) NULL,
  description_th        TEXT NULL,
  description_en        TEXT NULL,
  intro_html_th         LONGTEXT NULL,
  intro_html_en         LONGTEXT NULL,
  seo_title_th          VARCHAR(255) NULL,
  seo_title_en          VARCHAR(255) NULL,
  seo_description_th    TEXT NULL,
  seo_description_en    TEXT NULL,
  image_url             VARCHAR(500) NULL,
  image_alt_th          VARCHAR(255) NULL,
  image_alt_en          VARCHAR(255) NULL,
  sort_order            INT NOT NULL DEFAULT 0,
  is_published          TINYINT(1) NOT NULL DEFAULT 1,
  created_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_order (sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id           BIGINT UNSIGNED NOT NULL,
  slug                  VARCHAR(190) NOT NULL,
  name_th               VARCHAR(255) NOT NULL,
  name_en               VARCHAR(255) NULL,
  family_name_th        VARCHAR(255) NULL,
  family_name_en        VARCHAR(255) NULL,
  description_th        TEXT NULL,
  description_en        TEXT NULL,
  content_th            LONGTEXT NULL,
  content_en            LONGTEXT NULL,
  application_th        LONGTEXT NULL,
  application_en        LONGTEXT NULL,
  seo_title_th          VARCHAR(255) NULL,
  seo_title_en          VARCHAR(255) NULL,
  seo_description_th    TEXT NULL,
  seo_description_en    TEXT NULL,
  image_url             VARCHAR(500) NULL,
  image_alt_th          VARCHAR(255) NULL,
  image_alt_en          VARCHAR(255) NULL,
  sku                   VARCHAR(190) NULL,
  availability_status   VARCHAR(100) NULL,
  moq                   VARCHAR(100) NULL,
  lead_time             VARCHAR(100) NULL,
  default_variant_slug  VARCHAR(190) NULL,
  sort_order            INT NOT NULL DEFAULT 0,
  is_published          TINYINT(1) NOT NULL DEFAULT 1,
  created_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id, sort_order, is_published),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variants (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id          BIGINT UNSIGNED NOT NULL,
  slug                VARCHAR(190) NOT NULL,
  sku                 VARCHAR(190) NULL,
  label_th            VARCHAR(255) NULL,
  label_en            VARCHAR(255) NULL,
  description_th      TEXT NULL,
  description_en      TEXT NULL,
  image_url           VARCHAR(500) NULL,
  availability_status VARCHAR(100) NULL,
  moq                 VARCHAR(100) NULL,
  lead_time           VARCHAR(100) NULL,
  is_default          TINYINT(1) NOT NULL DEFAULT 0,
  sort_order          INT NOT NULL DEFAULT 0,
  is_published        TINYINT(1) NOT NULL DEFAULT 1,
  created_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_variants_slug (slug),
  KEY idx_variants_product (product_id, sort_order, is_published),
  CONSTRAINT fk_variants_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variant_options (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  variant_id      BIGINT UNSIGNED NOT NULL,
  group_key       VARCHAR(100) NOT NULL,
  group_label_th  VARCHAR(255) NULL,
  group_label_en  VARCHAR(255) NULL,
  value_key       VARCHAR(100) NOT NULL,
  value_th        VARCHAR(255) NULL,
  value_en        VARCHAR(255) NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_variant_options_variant (variant_id, sort_order),
  CONSTRAINT fk_variant_options_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_specs (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id      BIGINT UNSIGNED NULL,
  variant_id      BIGINT UNSIGNED NULL,
  spec_key        VARCHAR(100) NOT NULL,
  label_th        VARCHAR(255) NULL,
  label_en        VARCHAR(255) NULL,
  value_th        TEXT NULL,
  value_en        TEXT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_specs_product (product_id, sort_order),
  KEY idx_product_specs_variant (variant_id, sort_order),
  CONSTRAINT fk_product_specs_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_product_specs_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_media (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id      BIGINT UNSIGNED NULL,
  variant_id      BIGINT UNSIGNED NULL,
  url             VARCHAR(500) NOT NULL,
  alt_th          VARCHAR(255) NULL,
  alt_en          VARCHAR(255) NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  is_primary      TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_media_product (product_id, sort_order, is_primary),
  KEY idx_product_media_variant (variant_id, sort_order, is_primary),
  CONSTRAINT fk_product_media_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_product_media_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faq_items (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_type      ENUM('category', 'product', 'article', 'page') NOT NULL,
  owner_id        BIGINT UNSIGNED NULL,
  owner_key       VARCHAR(120) NULL,
  question_th     TEXT NULL,
  question_en     TEXT NULL,
  answer_th       LONGTEXT NULL,
  answer_en       LONGTEXT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  is_published    TINYINT(1) NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_faq_items_owner (owner_type, owner_id, sort_order, is_published),
  KEY idx_faq_items_owner_key (owner_type, owner_key, sort_order, is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Articles / content marketing
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug                  VARCHAR(190) NOT NULL,
  title_th              VARCHAR(255) NOT NULL,
  title_en              VARCHAR(255) NULL,
  excerpt_th            TEXT NULL,
  excerpt_en            TEXT NULL,
  content_th            LONGTEXT NULL,
  content_en            LONGTEXT NULL,
  seo_title_th          VARCHAR(255) NULL,
  seo_title_en          VARCHAR(255) NULL,
  seo_description_th    TEXT NULL,
  seo_description_en    TEXT NULL,
  canonical_url_th      VARCHAR(500) NULL,
  canonical_url_en      VARCHAR(500) NULL,
  author_name           VARCHAR(255) NULL,
  cover_image_url       VARCHAR(500) NULL,
  cover_image_alt_th    VARCHAR(255) NULL,
  cover_image_alt_en    VARCHAR(255) NULL,
  focus_keyword_th      VARCHAR(255) NULL,
  focus_keyword_en      VARCHAR(255) NULL,
  reading_time_minutes  INT NULL,
  published_at          DATETIME NULL,
  updated_at            DATETIME NULL,
  is_published          TINYINT(1) NOT NULL DEFAULT 1,
  created_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_categories (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(100) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  name_th       VARCHAR(255) NULL,
  name_en       VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_tags (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(100) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  name_th       VARCHAR(255) NULL,
  name_en       VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_category_relations (
  article_id    BIGINT UNSIGNED NOT NULL,
  category_id   INT UNSIGNED NOT NULL,
  PRIMARY KEY (article_id, category_id),
  CONSTRAINT fk_article_category_relations_article
    FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_article_category_relations_category
    FOREIGN KEY (category_id) REFERENCES article_categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_tag_relations (
  article_id    BIGINT UNSIGNED NOT NULL,
  tag_id        INT UNSIGNED NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_article_tag_relations_article
    FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_article_tag_relations_tag
    FOREIGN KEY (tag_id) REFERENCES article_tags (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_blocks (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  article_id              BIGINT UNSIGNED NOT NULL,
  block_type              ENUM('rich_text', 'checklist', 'callout', 'comparison_table', 'cta') NOT NULL,
  anchor_id               VARCHAR(120) NULL,
  eyebrow_th              VARCHAR(255) NULL,
  eyebrow_en              VARCHAR(255) NULL,
  heading_th              VARCHAR(255) NULL,
  heading_en              VARCHAR(255) NULL,
  body_th                 LONGTEXT NULL,
  body_en                 LONGTEXT NULL,
  intro_th                TEXT NULL,
  intro_en                TEXT NULL,
  style_variant           ENUM('info', 'success', 'warning', 'note', 'dark', 'accent', 'soft') NULL,
  left_label_th           VARCHAR(255) NULL,
  left_label_en           VARCHAR(255) NULL,
  right_label_th          VARCHAR(255) NULL,
  right_label_en          VARCHAR(255) NULL,
  button_label_th         VARCHAR(255) NULL,
  button_label_en         VARCHAR(255) NULL,
  button_url              VARCHAR(500) NULL,
  sort_order              INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_article_blocks_article (article_id, sort_order),
  CONSTRAINT fk_article_blocks_article
    FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_block_checklist_items (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block_id           BIGINT UNSIGNED NOT NULL,
  item_th            TEXT NULL,
  item_en            TEXT NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_article_block_checklist_items_block (block_id, sort_order),
  CONSTRAINT fk_article_block_checklist_items_block
    FOREIGN KEY (block_id) REFERENCES article_blocks (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_block_comparison_rows (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block_id           BIGINT UNSIGNED NOT NULL,
  criterion_th       VARCHAR(255) NULL,
  criterion_en       VARCHAR(255) NULL,
  left_value_th      TEXT NULL,
  left_value_en      TEXT NULL,
  right_value_th     TEXT NULL,
  right_value_en     TEXT NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_article_block_comparison_rows_block (block_id, sort_order),
  CONSTRAINT fk_article_block_comparison_rows_block
    FOREIGN KEY (block_id) REFERENCES article_blocks (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
