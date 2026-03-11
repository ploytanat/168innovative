import { getCategories } from "./categories"
import { getCompany } from "./company"
import { getHeroSlides } from "./hero"
import { getAllProductsByCategory, getProducts } from "./products"
import type { Locale } from "../types/content"
import { getWhy } from "./why"

async function loadWithFallback<T>(
  promise: Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.error(`Failed to load ${label}:`, error)
    return fallback
  }
}

export async function getHomeSections(locale: Locale) {
  const [heroSlides, products, categories, whys, company] = await Promise.all([
    loadWithFallback(getHeroSlides(locale), [], `hero slides (${locale})`),
    loadWithFallback(
      getAllProductsByCategory("spout", locale),
      [],
      `spout products (${locale})`
    ),
    loadWithFallback(getCategories(locale), [], `categories (${locale})`),
    loadWithFallback(getWhy(locale), [], `why items (${locale})`),
    loadWithFallback(getCompany(locale), null, `company (${locale})`),
  ])

  const homeProducts = products.length > 0
    ? products.slice(0, 12)
    : await loadWithFallback(getProducts(locale), [], `products fallback (${locale})`)

  return {
    heroSlides,
    products: homeProducts,
    categories,
    whys,
    company,
  }
}
