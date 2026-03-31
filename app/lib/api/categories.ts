import {
  getMockAllCategorySlugs,
  getMockCategories,
  getMockCategoryBySlug,
  getMockCategoryIdBySlug,
} from "../mock/runtime"
import type { Locale } from "../types/content"

export async function getCategories(locale: Locale) {
  return getMockCategories(locale)
}

export async function getAllCategorySlugs() {
  return getMockAllCategorySlugs()
}

export async function getCategoryIdBySlug(slug: string) {
  return getMockCategoryIdBySlug(slug)
}

export async function getCategoryBySlug(slug: string, locale: Locale) {
  return getMockCategoryBySlug(slug, locale)
}
