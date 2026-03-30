import ProductCatalogClient from '@/app/components/catalog/ProductCatalogClient'
import { type CatalogFilters } from '@/app/lib/catalog/filters'
import { catalogProducts } from '@/app/lib/catalog/mock-products'

interface Props {
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    type?: string | string[]
    diameter?: string | string[]
  }>
}

function toArray(value?: string | string[]) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const initialFilters: CatalogFilters = {
    search: params.search ?? '',
    categories: toArray(params.category),
    types: toArray(params.type),
    diameters: toArray(params.diameter),
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductCatalogClient
        products={catalogProducts}
        initialFilters={initialFilters}
      />
    </main>
  )
}
