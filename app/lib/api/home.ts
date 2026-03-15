import { HOME_PRODUCT_SPOTLIGHT_ORDER } from "../config/home-product-spotlight"
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
  const [heroSlides, spoutProducts, allProducts, categories, whys, company] =
    await Promise.all([
      loadWithFallback(getHeroSlides(locale), [], `hero slides (${locale})`),

      loadWithFallback(
        getAllProductsByCategory("spout", locale),
        [],
        `spout products (${locale})`
      ),

      loadWithFallback(getProducts(locale), [], `all products (${locale})`),

      loadWithFallback(getCategories(locale), [], `categories (${locale})`),

      loadWithFallback(getWhy(locale), [], `why items (${locale})`),

      loadWithFallback(getCompany(locale), null, `company (${locale})`),
    ])

  const spotlightProducts = HOME_PRODUCT_SPOTLIGHT_ORDER.flatMap((slug) => {
    const match = allProducts.find((product) => product.slug === slug)
    return match ? [match] : []
  })

  const mergedProducts = [...spotlightProducts, ...spoutProducts]
  const uniqueProducts = Array.from(
    new Map(mergedProducts.map((product) => [product.slug, product])).values()
  )
  const homeProducts = uniqueProducts.slice(0, 12)

  return {
    heroSlides,
    products: homeProducts,
    categories,
    whys,
    company,
  }
}
