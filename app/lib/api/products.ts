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

// Extract size suffix from slug e.g. "spout-screw-cap-16mm" -> "16mm"
function extractSizeFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d+\s*mm?)$/i)
  return match ? match[1] : null
}

function getSlugBase(slug: string): string {
  return slug.replace(/-\d+\s*mm?$/i, "")
}

export async function getProductVariants(
  productSlug: string,
  categorySlug: string,
  locale: Locale
): Promise<ProductView[]> {
  const allProducts = await getAllProductsByCategory(categorySlug, locale)
  const base = getSlugBase(productSlug)
  return allProducts.filter(
    (p) => getSlugBase(p.slug) === base && p.slug !== productSlug
  )
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  return getMockRelatedProducts(categorySlug, currentProductSlug, locale)
}
