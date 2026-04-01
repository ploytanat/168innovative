-- ============================================================
--  innova_core — MariaDB Schema Dump
--  Engine  : InnoDB
--  Charset : utf8mb4 / utf8mb4_unicode_ci
--  Host    : hostatom (MariaDB)
--  Created : 2026-03-30
-- ============================================================

CREATE DATABASE IF NOT EXISTS innova_core
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE innova_core;

-- ============================================================
--  TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id            BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(190)        NOT NULL,
  name_th       VARCHAR(255)        NOT NULL,
  name_en       VARCHAR(255)            NULL,
  description_th TEXT                    NULL,
  description_en TEXT                    NULL,
  intro_html_th  LONGTEXT               NULL,
  intro_html_en  LONGTEXT               NULL,
  seo_title_th   VARCHAR(255)           NULL,
  seo_title_en   VARCHAR(255)           NULL,
  seo_description_th TEXT               NULL,
  seo_description_en TEXT               NULL,
  image_url      VARCHAR(500)           NULL,
  image_alt_th   VARCHAR(255)           NULL,
  image_alt_en   VARCHAR(255)           NULL,
  sort_order     INT             NOT NULL DEFAULT 0,
  is_published   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at     TIMESTAMP           NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP           NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id           BIGINT UNSIGNED NOT NULL,
  slug                  VARCHAR(190)    NOT NULL,
  name_th               VARCHAR(255)    NOT NULL,
  name_en               VARCHAR(255)        NULL,
  family_name_th        VARCHAR(255)        NULL,
  family_name_en        VARCHAR(255)        NULL,
  description_th        TEXT                NULL,
  description_en        TEXT                NULL,
  content_th            LONGTEXT            NULL,
  content_en            LONGTEXT            NULL,
  application_th        LONGTEXT            NULL,
  application_en        LONGTEXT            NULL,
  seo_title_th          VARCHAR(255)        NULL,
  seo_title_en          VARCHAR(255)        NULL,
  seo_description_th    TEXT                NULL,
  seo_description_en    TEXT                NULL,
  image_url             VARCHAR(500)        NULL,
  image_alt_th          VARCHAR(255)        NULL,
  image_alt_en          VARCHAR(255)        NULL,
  sku                   VARCHAR(190)        NULL,
  availability_status   VARCHAR(100)        NULL,
  moq                   VARCHAR(100)        NULL,
  lead_time             VARCHAR(100)        NULL,
  default_variant_slug  VARCHAR(190)        NULL,
  sort_order            INT         NOT NULL DEFAULT 0,
  is_published          TINYINT(1)  NOT NULL DEFAULT 1,
  created_at            TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: product_variants
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id          BIGINT UNSIGNED NOT NULL,
  slug                VARCHAR(190)    NOT NULL,
  sku                 VARCHAR(190)        NULL,
  label_th            VARCHAR(255)        NULL,
  label_en            VARCHAR(255)        NULL,
  description_th      TEXT                NULL,
  description_en      TEXT                NULL,
  image_url           VARCHAR(500)        NULL,
  availability_status VARCHAR(100)        NULL,
  moq                 VARCHAR(100)        NULL,
  lead_time           VARCHAR(100)        NULL,
  is_default          TINYINT(1)  NOT NULL DEFAULT 0,
  sort_order          INT         NOT NULL DEFAULT 0,
  is_published        TINYINT(1)  NOT NULL DEFAULT 1,
  created_at          TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_variants_slug (slug),
  KEY idx_variants_product (product_id),
  CONSTRAINT fk_variants_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: product_variant_options
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variant_options (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  variant_id      BIGINT UNSIGNED NOT NULL,
  group_key       VARCHAR(100)    NOT NULL,
  group_label_th  VARCHAR(255)        NULL,
  group_label_en  VARCHAR(255)        NULL,
  value_key       VARCHAR(100)    NOT NULL,
  value_th        VARCHAR(255)        NULL,
  value_en        VARCHAR(255)        NULL,
  sort_order      INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_variant_options_variant (variant_id),
  CONSTRAINT fk_variant_options_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: product_specs
-- ============================================================
CREATE TABLE IF NOT EXISTS product_specs (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id  BIGINT UNSIGNED     NULL,
  variant_id  BIGINT UNSIGNED     NULL,
  spec_key    VARCHAR(100)    NOT NULL,
  label_th    VARCHAR(255)        NULL,
  label_en    VARCHAR(255)        NULL,
  value_th    TEXT                NULL,
  value_en    TEXT                NULL,
  sort_order  INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_specs_product (product_id),
  KEY idx_specs_variant (variant_id),
  CONSTRAINT fk_specs_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_specs_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: product_media
-- ============================================================
CREATE TABLE IF NOT EXISTS product_media (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id  BIGINT UNSIGNED     NULL,
  variant_id  BIGINT UNSIGNED     NULL,
  url         VARCHAR(500)    NOT NULL,
  alt_th      VARCHAR(255)        NULL,
  alt_en      VARCHAR(255)        NULL,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_primary  TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_media_product (product_id),
  KEY idx_media_variant (variant_id),
  CONSTRAINT fk_media_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_media_variant
    FOREIGN KEY (variant_id) REFERENCES product_variants (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: faq_items
-- ============================================================
CREATE TABLE IF NOT EXISTS faq_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_type  ENUM('category','product') NOT NULL,
  owner_id    BIGINT UNSIGNED NOT NULL,
  question_th TEXT                NULL,
  question_en TEXT                NULL,
  answer_th   LONGTEXT            NULL,
  answer_en   LONGTEXT            NULL,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_faq_owner (owner_type, owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: articles
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug                  VARCHAR(190)    NOT NULL,
  title_th              VARCHAR(255)    NOT NULL,
  title_en              VARCHAR(255)        NULL,
  excerpt_th            TEXT                NULL,
  excerpt_en            TEXT                NULL,
  content_th            LONGTEXT            NULL,
  content_en            LONGTEXT            NULL,
  seo_title_th          VARCHAR(255)        NULL,
  seo_title_en          VARCHAR(255)        NULL,
  seo_description_th    TEXT                NULL,
  seo_description_en    TEXT                NULL,
  canonical_url_th      VARCHAR(500)        NULL,
  canonical_url_en      VARCHAR(500)        NULL,
  author_name           VARCHAR(255)        NULL,
  cover_image_url       VARCHAR(500)        NULL,
  cover_image_alt_th    VARCHAR(255)        NULL,
  cover_image_alt_en    VARCHAR(255)        NULL,
  focus_keyword_th      VARCHAR(255)        NULL,
  focus_keyword_en      VARCHAR(255)        NULL,
  reading_time_minutes  INT                 NULL,
  published_at          DATETIME            NULL,
  updated_at            DATETIME            NULL,
  is_published          TINYINT(1)  NOT NULL DEFAULT 1,
  created_at            TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: article_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS article_categories (
  id    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug  VARCHAR(100)    NOT NULL,
  name  VARCHAR(255)    NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: article_tags
-- ============================================================
CREATE TABLE IF NOT EXISTS article_tags (
  id    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug  VARCHAR(100)    NOT NULL,
  name  VARCHAR(255)    NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: article_category_relations
-- ============================================================
CREATE TABLE IF NOT EXISTS article_category_relations (
  article_id   BIGINT UNSIGNED NOT NULL,
  category_id  INT UNSIGNED    NOT NULL,
  PRIMARY KEY (article_id, category_id),
  CONSTRAINT fk_acr_article
    FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_acr_category
    FOREIGN KEY (category_id) REFERENCES article_categories (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLE: article_tag_relations
-- ============================================================
CREATE TABLE IF NOT EXISTS article_tag_relations (
  article_id  BIGINT UNSIGNED NOT NULL,
  tag_id      INT UNSIGNED    NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_atr_article
    FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_atr_tag
    FOREIGN KEY (tag_id) REFERENCES article_tags (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
