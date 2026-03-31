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

export interface DBCompanyProfile extends RowDataPacket {
  id: number
  legal_name_th: string
  legal_name_en: string | null
  display_name_th: string
  display_name_en: string | null
  tagline_th: string | null
  tagline_en: string | null
  address_th: string | null
  address_en: string | null
  logo_url: string | null
  logo_alt_th: string | null
  logo_alt_en: string | null
  line_qr_url: string | null
  line_qr_alt_th: string | null
  line_qr_alt_en: string | null
  contact_image_url: string | null
  contact_image_alt_th: string | null
  contact_image_alt_en: string | null
  is_published: number
}

export interface DBCompanyContactMethod extends RowDataPacket {
  id: number
  company_id: number
  contact_type:
    | 'phone'
    | 'email'
    | 'line'
    | 'facebook'
    | 'instagram'
    | 'shopee'
    | 'whatsapp'
    | 'wechat'
    | 'map'
    | 'other'
  label_th: string | null
  label_en: string | null
  person_name_th: string | null
  person_name_en: string | null
  department_th: string | null
  department_en: string | null
  value: string | null
  url: string | null
  icon_url: string | null
  icon_alt: string | null
  sort_order: number
  is_primary: number
  is_published: number
}

export interface DBCompanyGalleryImage extends RowDataPacket {
  id: number
  company_id: number
  image_url: string
  alt_th: string | null
  alt_en: string | null
  sort_order: number
  is_published: number
}

export interface DBHeroSlide extends RowDataPacket {
  id: number
  theme: 'rose' | 'sky' | 'violet' | 'emerald'
  badge_variant: 'hot' | 'new' | 'promo' | 'featured'
  badge_text_th: string
  badge_text_en: string | null
  title_th: string
  title_en: string | null
  description_th: string | null
  description_en: string | null
  image_url: string
  image_alt_th: string | null
  image_alt_en: string | null
  cta_primary_label_th: string
  cta_primary_label_en: string | null
  cta_primary_href: string
  cta_secondary_label_th: string | null
  cta_secondary_label_en: string | null
  cta_secondary_href: string | null
  highlight_value: string | null
  highlight_label_th: string | null
  highlight_label_en: string | null
  visual_title_th: string | null
  visual_title_en: string | null
  visual_subtitle_th: string | null
  visual_subtitle_en: string | null
  sort_order: number
  is_published: number
}

export interface DBHeroSlideStat extends RowDataPacket {
  id: number
  slide_id: number
  metric_value: string
  label_th: string | null
  label_en: string | null
  sort_order: number
}

export interface DBHeroSlideChip extends RowDataPacket {
  id: number
  slide_id: number
  label_th: string | null
  label_en: string | null
  sort_order: number
}

export interface DBWhyItem extends RowDataPacket {
  id: number
  page_key: string
  section_key: string
  icon_name: string | null
  image_url: string | null
  image_alt_th: string | null
  image_alt_en: string | null
  title_th: string
  title_en: string | null
  description_th: string | null
  description_en: string | null
  sort_order: number
  is_published: number
}

export interface DBAboutSection extends RowDataPacket {
  id: number
  section_key: string
  eyebrow_th: string | null
  eyebrow_en: string | null
  title_th: string
  title_en: string | null
  description_th: string | null
  description_en: string | null
  image_primary_url: string | null
  image_primary_alt_th: string | null
  image_primary_alt_en: string | null
  image_secondary_url: string | null
  image_secondary_alt_th: string | null
  image_secondary_alt_en: string | null
  sort_order: number
  is_published: number
}
