import pool from './connection'
import type {
  DBAboutSection,
  DBCompanyContactMethod,
  DBCompanyGalleryImage,
  DBCompanyProfile,
  DBHeroSlide,
  DBHeroSlideChip,
  DBHeroSlideStat,
  DBWhyItem,
} from './types'

export async function queryCompanyProfile(): Promise<DBCompanyProfile | null> {
  const [rows] = await pool.execute<DBCompanyProfile[]>(
    `SELECT id, legal_name_th, legal_name_en, display_name_th, display_name_en,
            tagline_th, tagline_en, address_th, address_en,
            logo_url, logo_alt_th, logo_alt_en,
            line_qr_url, line_qr_alt_th, line_qr_alt_en,
            contact_image_url, contact_image_alt_th, contact_image_alt_en,
            is_published
     FROM company_profiles
     WHERE is_published = 1
     ORDER BY id ASC
     LIMIT 1`
  )

  return rows[0] ?? null
}

export async function queryCompanyContactMethods(
  companyId: number
): Promise<DBCompanyContactMethod[]> {
  const [rows] = await pool.execute<DBCompanyContactMethod[]>(
    `SELECT id, company_id, contact_type, label_th, label_en,
            person_name_th, person_name_en, department_th, department_en,
            value, url, icon_url, icon_alt, sort_order, is_primary, is_published
     FROM company_contact_methods
     WHERE company_id = ? AND is_published = 1
     ORDER BY sort_order ASC, id ASC`,
    [companyId]
  )

  return rows
}

export async function queryCompanyGalleryImages(
  companyId: number
): Promise<DBCompanyGalleryImage[]> {
  const [rows] = await pool.execute<DBCompanyGalleryImage[]>(
    `SELECT id, company_id, image_url, alt_th, alt_en, sort_order, is_published
     FROM company_gallery_images
     WHERE company_id = ? AND is_published = 1
     ORDER BY sort_order ASC, id ASC`,
    [companyId]
  )

  return rows
}

export async function queryHeroSlides(): Promise<DBHeroSlide[]> {
  const [rows] = await pool.execute<DBHeroSlide[]>(
    `SELECT id, theme, badge_variant, badge_text_th, badge_text_en,
            title_th, title_en, description_th, description_en,
            image_url, image_alt_th, image_alt_en,
            cta_primary_label_th, cta_primary_label_en, cta_primary_href,
            cta_secondary_label_th, cta_secondary_label_en, cta_secondary_href,
            highlight_value, highlight_label_th, highlight_label_en,
            visual_title_th, visual_title_en, visual_subtitle_th, visual_subtitle_en,
            sort_order, is_published
     FROM home_hero_slides
     WHERE is_published = 1
     ORDER BY sort_order ASC, id ASC`
  )

  return rows
}

export async function queryHeroSlideStats(
  slideIds: number[]
): Promise<DBHeroSlideStat[]> {
  if (!slideIds.length) return []

  const placeholders = slideIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBHeroSlideStat[]>(
    `SELECT id, slide_id, metric_value, label_th, label_en, sort_order
     FROM home_hero_slide_stats
     WHERE slide_id IN (${placeholders})
     ORDER BY slide_id ASC, sort_order ASC, id ASC`,
    slideIds
  )

  return rows
}

export async function queryHeroSlideChips(
  slideIds: number[]
): Promise<DBHeroSlideChip[]> {
  if (!slideIds.length) return []

  const placeholders = slideIds.map(() => '?').join(',')
  const [rows] = await pool.execute<DBHeroSlideChip[]>(
    `SELECT id, slide_id, label_th, label_en, sort_order
     FROM home_hero_slide_chips
     WHERE slide_id IN (${placeholders})
     ORDER BY slide_id ASC, sort_order ASC, id ASC`,
    slideIds
  )

  return rows
}

export async function queryWhyItems(
  pageKey: string,
  sectionKey = 'why'
): Promise<DBWhyItem[]> {
  const [rows] = await pool.execute<DBWhyItem[]>(
    `SELECT id, page_key, section_key, icon_name, image_url, image_alt_th, image_alt_en,
            title_th, title_en, description_th, description_en, sort_order, is_published
     FROM why_items
     WHERE page_key = ? AND section_key = ? AND is_published = 1
     ORDER BY sort_order ASC, id ASC`,
    [pageKey, sectionKey]
  )

  return rows
}

export async function queryAboutSections(): Promise<DBAboutSection[]> {
  const [rows] = await pool.execute<DBAboutSection[]>(
    `SELECT id, section_key, eyebrow_th, eyebrow_en, title_th, title_en,
            description_th, description_en,
            image_primary_url, image_primary_alt_th, image_primary_alt_en,
            image_secondary_url, image_secondary_alt_th, image_secondary_alt_en,
            sort_order, is_published
     FROM about_sections
     WHERE is_published = 1
     ORDER BY sort_order ASC, id ASC`
  )

  return rows
}
