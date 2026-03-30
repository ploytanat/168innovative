import type { RowDataPacket } from 'mysql2'

export interface DBCategory extends RowDataPacket {
  id: number
  slug: string
  name_th: string
  name_en: string | null
  description_th: string | null
  description_en: string | null
  intro_html_th: string | null
  intro_html_en: string | null
  seo_title_th: string | null
  seo_title_en: string | null
  seo_description_th: string | null
  seo_description_en: string | null
  image_url: string | null
  image_alt_th: string | null
  image_alt_en: string | null
}

export interface DBFaqItem extends RowDataPacket {
  id: number
  owner_type: 'category' | 'product'
  owner_id: number
  question_th: string | null
  question_en: string | null
  answer_th: string | null
  answer_en: string | null
  sort_order: number
}

export interface DBProduct extends RowDataPacket {
  id: number
  slug: string
  category_id: number
  category_slug: string
  name_th: string
  name_en: string | null
  family_name_th: string | null
  family_name_en: string | null
  description_th: string | null
  description_en: string | null
  content_th: string | null
  content_en: string | null
  application_th: string | null
  application_en: string | null
  seo_title_th: string | null
  seo_title_en: string | null
  seo_description_th: string | null
  seo_description_en: string | null
  image_url: string | null
  image_alt_th: string | null
  image_alt_en: string | null
  sku: string | null
  availability_status: string | null
  moq: string | null
  lead_time: string | null
  default_variant_slug: string | null
}

export interface DBProductVariant extends RowDataPacket {
  id: number
  product_id: number
  slug: string
  sku: string | null
  label_th: string | null
  label_en: string | null
  description_th: string | null
  description_en: string | null
  image_url: string | null
  availability_status: string | null
  moq: string | null
  lead_time: string | null
  is_default: number
  sort_order: number
}

export interface DBVariantOption extends RowDataPacket {
  id: number
  variant_id: number
  group_key: string
  group_label_th: string | null
  group_label_en: string | null
  value_key: string
  value_th: string | null
  value_en: string | null
  sort_order: number
}

export interface DBProductSpec extends RowDataPacket {
  id: number
  product_id: number | null
  variant_id: number | null
  spec_key: string
  label_th: string | null
  label_en: string | null
  value_th: string | null
  value_en: string | null
  sort_order: number
}

export interface DBProductMedia extends RowDataPacket {
  id: number
  product_id: number | null
  variant_id: number | null
  url: string
  alt_th: string | null
  alt_en: string | null
  sort_order: number
  is_primary: number
}

export interface DBArticle extends RowDataPacket {
  id: number
  slug: string
  title_th: string
  title_en: string | null
  excerpt_th: string | null
  excerpt_en: string | null
  content_th: string | null
  content_en: string | null
  seo_title_th: string | null
  seo_title_en: string | null
  seo_description_th: string | null
  seo_description_en: string | null
  canonical_url_th: string | null
  canonical_url_en: string | null
  published_at: Date | null
  updated_at: Date | null
  author_name: string | null
  cover_image_url: string | null
  cover_image_alt_th: string | null
  cover_image_alt_en: string | null
  focus_keyword_th: string | null
  focus_keyword_en: string | null
  reading_time_minutes: number | null
}

export interface DBArticleTag extends RowDataPacket {
  article_id: number
  tag_id: number
  tag_slug: string
  tag_name: string
}

export interface DBArticleCategory extends RowDataPacket {
  article_id: number
  category_name: string
}
