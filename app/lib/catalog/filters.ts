import type { CatalogProduct } from '@/app/lib/catalog/mock-products'

export type CatalogFilters = {
  search: string
  categories: string[]
  types: string[]      // maps to specs.shape
  diameters: string[]  // maps to specs.capacity_ml
}

export function getCatalogFilterOptions(products: CatalogProduct[]) {
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort()

  const types = Array.from(
    new Set(products.map((product) => product.specs.shape).filter(Boolean))
  ).sort()

  // capacity_ml stores either fill volume (lipgloss tubes) or inner diameter (stoppers)
  // empty strings (adjustable/range products) are excluded
  const diameters = Array.from(
    new Set(
      products
        .map((product) => product.specs.capacity_ml)
        .filter((v) => v && v.trim() !== '')
    )
  ).sort((left, right) => Number(left) - Number(right))

  return {
    categories,
    types,
    diameters,
  }
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  filters: CatalogFilters
) {
  const search = filters.search.trim().toLowerCase()

  return products.filter((product) => {
    const matchesSearch =
      search.length === 0 ||
      product.sku.toLowerCase().includes(search) ||
      product.name.toLowerCase().includes(search) ||
      product.tags.some((tag) => tag.toLowerCase().includes(search))
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category)
    const matchesType =
      filters.types.length === 0 ||
      filters.types.includes(product.specs.shape ?? '')
    const matchesDiameter =
      filters.diameters.length === 0 ||
      filters.diameters.includes(product.specs.capacity_ml ?? '')

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesDiameter
    )
  })
}
