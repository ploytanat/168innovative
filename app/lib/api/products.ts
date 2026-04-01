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
import {
  getWordPressAllProductsByCategory,
  getWordPressAllProductsForSitemap,
  getWordPressIndexableProductsForSitemap,
  getWordPressProductBySlug,
  getWordPressProducts,
  getWordPressProductsByCategory,
  getWordPressRelatedProducts,
} from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getAllProductsForSitemap() {
  return loadWithWordPressFallback(
    "product sitemap",
    () => getWordPressAllProductsForSitemap(),
    () => getMockAllProductsForSitemap()
  )
}

export async function getIndexableProductsForSitemap() {
  return loadWithWordPressFallback(
    "indexable product sitemap",
    () => getWordPressIndexableProductsForSitemap(),
    () => getMockIndexableProductsForSitemap()
  )
}

export async function getProducts(locale: Locale) {
  return loadWithWordPressFallback(
    `products (${locale})`,
    () => getWordPressProducts(locale),
    () => getMockProducts(locale)
  )
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale,
  page = 1
) {
  return loadWithWordPressFallback(
    `products by category ${slug} (${locale})`,
    () => getWordPressProductsByCategory(slug, locale, page),
    () => getMockProductsByCategory(slug, locale, page)
  )
}

export async function getAllProductsByCategory(slug: string, locale: Locale) {
  return loadWithWordPressFallback(
    `all products by category ${slug} (${locale})`,
    () => getWordPressAllProductsByCategory(slug, locale),
    () => getMockAllProductsByCategory(slug, locale)
  )
}

export async function getProductBySlug(slug: string, locale: Locale) {
  return loadWithWordPressFallback(
    `product ${slug} (${locale})`,
    () => getWordPressProductBySlug(slug, locale),
    () => getMockProductBySlug(slug, locale)
  )
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  return loadWithWordPressFallback(
    `related products ${currentProductSlug} (${locale})`,
    () => getWordPressRelatedProducts(categorySlug, currentProductSlug, locale),
    () => getMockRelatedProducts(categorySlug, currentProductSlug, locale)
  )
}
