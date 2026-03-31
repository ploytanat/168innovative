import {
  getMockAllProductsByCategory,
  getMockAllProductsForSitemap,
  getMockIndexableProductsForSitemap,
  getMockProductBySlug,
  getMockProducts,
  getMockProductsByCategory,
  getMockRelatedProducts,
} from "../mock/runtime"
import type { Locale } from "../types/content"

export async function getAllProductsForSitemap() {
  return getMockAllProductsForSitemap()
}

export async function getIndexableProductsForSitemap() {
  return getMockIndexableProductsForSitemap()
}

export async function getProducts(locale: Locale) {
  return getMockProducts(locale)
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale,
  page = 1
) {
  return getMockProductsByCategory(slug, locale, page)
}

export async function getAllProductsByCategory(slug: string, locale: Locale) {
  return getMockAllProductsByCategory(slug, locale)
}

export async function getProductBySlug(slug: string, locale: Locale) {
  return getMockProductBySlug(slug, locale)
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  return getMockRelatedProducts(categorySlug, currentProductSlug, locale)
}
