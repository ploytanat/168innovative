'use client'

import { startTransition, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { ProductView } from '@/app/lib/types/view'

import Pagination from '../ui/Pagination'
import ProductGrid from './Productgrid'

interface CategoryProductsSectionProps {
  slug: string
  locale: 'th' | 'en'
  basePath: string
  initialProducts: ProductView[]
  initialTotalPages: number
  initialTotalCount: number
}

type ProductsResponse = {
  products: ProductView[]
  totalPages: number
  totalCount: number
}

function parsePage(value: string | null) {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export default function CategoryProductsSection({
  slug,
  locale,
  basePath,
  initialProducts,
  initialTotalPages,
  initialTotalCount,
}: CategoryProductsSectionProps) {
  const searchParams = useSearchParams()
  const currentPage = parsePage(searchParams.get('page'))

  const [data, setData] = useState<ProductsResponse>({
    products: initialProducts,
    totalPages: initialTotalPages,
    totalCount: initialTotalCount,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    if (currentPage === 1) {
      setLoading(false)
      setData({
        products: initialProducts,
        totalPages: initialTotalPages,
        totalCount: initialTotalCount,
      })
      return () => controller.abort()
    }

    setLoading(true)

    fetch(
      `/api/products?category=${encodeURIComponent(slug)}&page=${currentPage}&locale=${locale}`,
      { signal: controller.signal }
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load page ${currentPage}`)
        }

        return (await response.json()) as ProductsResponse
      })
      .then((nextData) => {
        if (controller.signal.aborted) return

        startTransition(() => {
          setData(nextData)
          setLoading(false)
        })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setLoading(false)
      })

    return () => controller.abort()
  }, [
    currentPage,
    initialProducts,
    initialTotalCount,
    initialTotalPages,
    locale,
    slug,
  ])

  return (
    <div className={loading ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
      <ProductGrid
        products={data.products}
        categorySlug={slug}
        totalCount={data.totalCount}
        locale={locale}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        basePath={basePath}
      />
    </div>
  )
}
