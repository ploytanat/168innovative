import {
  getMockAllCategorySlugs,
  getMockCategories,
  getMockCategoryBySlug,
  getMockCategoryIdBySlug,
} from "../mock/runtime"
import type { Locale } from "../types/content"
import {
  getWordPressAllCategorySlugs,
  getWordPressCategories,
  getWordPressCategoryBySlug,
  getWordPressCategoryIdBySlug,
} from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getCategories(locale: Locale) {
  return loadWithWordPressFallback(
    `categories (${locale})`,
    () => getWordPressCategories(locale),
    () => getMockCategories(locale)
  )
}

export async function getAllCategorySlugs() {
  return loadWithWordPressFallback(
    "category slugs",
    () => getWordPressAllCategorySlugs(),
    () => getMockAllCategorySlugs()
  )
}

export async function getCategoryIdBySlug(slug: string) {
  return loadWithWordPressFallback(
    `category id ${slug}`,
    () => getWordPressCategoryIdBySlug(slug),
    () => getMockCategoryIdBySlug(slug)
  )
}

export async function getCategoryBySlug(slug: string, locale: Locale) {
  return loadWithWordPressFallback(
    `category ${slug} (${locale})`,
    () => getWordPressCategoryBySlug(slug, locale),
    () => getMockCategoryBySlug(slug, locale)
  )
}
