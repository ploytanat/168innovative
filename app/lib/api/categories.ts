// lib/api/categories.ts — MariaDB backend

import { unstable_cache } from 'next/cache'
import { normalizeRichText, pickLocalizedText } from './acf'
import {
  getMockAllCategorySlugs,
  getMockCategories,
  getMockCategoryBySlug,
  getMockCategoryIdBySlug,
  isMockModeEnabled,
} from '../mock/runtime'
import {
  queryCategories,
  queryCategoryBySlug,
  queryAllCategorySlugs,
  queryFaqItemsByOwner,
} from '../db/categories'
import type { Locale } from '../types/content'
import type { CategoryView, FAQItemView } from '../types/view'
import type { DBCategory, DBFaqItem } from '../db/types'

/* ================= Mapper ================= */

function mapDbFaqItems(
  faqRows: DBFaqItem[],
  ownerId: number,
  locale: Locale
): FAQItemView[] {
  return faqRows
    .filter((f) => f.owner_id === ownerId)
    .map((f) => ({
      question: pickLocalizedText(locale, f.question_th, f.question_en),
      answer: normalizeRichText(locale === 'th' ? f.answer_th : f.answer_en) ?? '',
    }))
    .filter((f) => f.question && f.answer)
}

function mapDbCategory(
  row: DBCategory,
  faqRows: DBFaqItem[],
  locale: Locale
): CategoryView {
  return {
    id: String(row.id),
    slug: row.slug,
    name: pickLocalizedText(locale, row.name_th, row.name_en, row.name_th),
    description: pickLocalizedText(locale, row.description_th, row.description_en) || undefined,
    image: row.image_url
      ? {
          src: row.image_url,
          alt: pickLocalizedText(locale, row.image_alt_th, row.image_alt_en, row.name_th),
        }
      : undefined,
    introHtml: normalizeRichText(
      locale === 'th' ? row.intro_html_th : row.intro_html_en
    ),
    faqItems: mapDbFaqItems(faqRows, row.id, locale),
    seoTitle: pickLocalizedText(locale, row.seo_title_th, row.seo_title_en, row.name_th),
    seoDescription: pickLocalizedText(
      locale,
      row.seo_description_th,
      row.seo_description_en
    ),
  }
}

/* ================= All Categories ================= */

export function getCategories(locale: Locale): Promise<CategoryView[]> {
  if (isMockModeEnabled()) {
    return Promise.resolve(getMockCategories(locale))
  }

  return unstable_cache(
    async () => {
      const rows = await queryCategories()
      const ids = rows.map((r) => r.id)
      const faqRows = await queryFaqItemsByOwner('category', ids)
      return rows.map((row) => mapDbCategory(row, faqRows, locale))
    },
    [`categories-db-${locale}-v1`],
    { revalidate: 300, tags: ['categories'] }
  )()
}

export function getAllCategorySlugs(): Promise<string[]> {
  if (isMockModeEnabled()) {
    return Promise.resolve(getMockAllCategorySlugs())
  }

  return unstable_cache(
    async () => queryAllCategorySlugs(),
    ['category-slugs-db-v1'],
    { revalidate: 300, tags: ['categories'] }
  )()
}

/* ================= Single Category ================= */

export async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  if (isMockModeEnabled()) {
    return getMockCategoryIdBySlug(slug)
  }

  return unstable_cache(
    async () => {
      const row = await queryCategoryBySlug(slug)
      return row?.id ?? null
    },
    [`category-id-db-${slug}-v1`],
    { revalidate: 300, tags: ['categories'] }
  )()
}

export function getCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<CategoryView | null> {
  if (isMockModeEnabled()) {
    return Promise.resolve(getMockCategoryBySlug(slug, locale))
  }

  return unstable_cache(
    async () => {
      const row = await queryCategoryBySlug(slug)
      if (!row) return null
      const faqRows = await queryFaqItemsByOwner('category', [row.id])
      return mapDbCategory(row, faqRows, locale)
    },
    [`category-db-${slug}-${locale}-v1`],
    { revalidate: 300, tags: ['categories'] }
  )()
}
