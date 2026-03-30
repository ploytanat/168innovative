'use client'

import { useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import ProductFilter from '@/app/components/catalog/ProductFilter'
import ProductGrid from '@/app/components/catalog/ProductGrid'
import {
  filterCatalogProducts,
  getCatalogFilterOptions,
  type CatalogFilters,
} from '@/app/lib/catalog/filters'
import {
  groupProductsForDisplay,
  type CatalogProduct,
} from '@/app/lib/catalog/mock-products'

interface Props {
  products: CatalogProduct[]
  initialFilters: CatalogFilters
}

type FilterKey = 'categories' | 'types' | 'diameters'

export default function ProductCatalogClient({
  products,
  initialFilters,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters)
  const options = useMemo(() => getCatalogFilterOptions(products), [products])
  const filteredProducts = useMemo(
    () => filterCatalogProducts(products, filters),
    [products, filters]
  )
  const displayGroups = useMemo(
    () => groupProductsForDisplay(filteredProducts),
    [filteredProducts]
  )

  function syncUrl(nextFilters: CatalogFilters) {
    const params = new URLSearchParams(searchParams.toString())

    if (nextFilters.search) {
      params.set('search', nextFilters.search)
    } else {
      params.delete('search')
    }

    const mapping: Array<[FilterKey, string]> = [
      ['categories', 'category'],
      ['types', 'type'],
      ['diameters', 'diameter'],
    ]

    mapping.forEach(([key, param]) => {
      params.delete(param)
      nextFilters[key].forEach((value) => params.append(param, value))
    })

    const query = params.toString()

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  function updateFilters(nextFilters: CatalogFilters) {
    setFilters(nextFilters)
    syncUrl(nextFilters)
  }

  function toggleValue(key: FilterKey, value: string) {
    const nextValues = filters[key].includes(value)
      ? filters[key].filter((item) => item !== value)
      : [...filters[key], value]

    updateFilters({
      ...filters,
      [key]: nextValues,
    })
  }

  function clearFilters() {
    updateFilters({
      search: '',
      categories: [],
      types: [],
      diameters: [],
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <ProductFilter
        search={filters.search}
        activeFilters={filters}
        sections={[
          {
            key: 'categories',
            label: 'Category',
            options: options.categories,
          },
          {
            key: 'types',
            label: 'Type',
            options: options.types,
          },
          {
            key: 'diameters',
            label: 'Size',
            options: options.diameters,
          },
        ]}
        onSearchChange={(value) =>
          updateFilters({
            ...filters,
            search: value,
          })
        }
        onToggle={toggleValue}
        onClear={clearFilters}
      />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Product Catalog
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              B2B Product Catalog
            </h1>
          </div>

          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-950">
              {displayGroups.length}
            </span>{' '}
            {displayGroups.length === 1 ? 'product' : 'products'}
            {filteredProducts.length !== displayGroups.length && (
              <span className="ml-1 text-slate-400">
                ({filteredProducts.length} SKUs)
              </span>
            )}
            {isPending ? ' updating...' : ''}
          </div>
        </div>

        <ProductGrid products={filteredProducts} />
      </section>
    </div>
  )
}
