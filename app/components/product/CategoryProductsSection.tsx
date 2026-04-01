"use client"

import { useState } from "react"

import type { CategoryView, ProductView } from "@/app/lib/types/view"

import Pagination from "../ui/Pagination"
import ProductGrid from "./Productgrid"

interface CategoryProductsSectionProps {
  slug: string
  locale: "th" | "en"
  basePath: string
  currentPage: number
  category: CategoryView
  categories: CategoryView[]
  products: ProductView[]
  searchProducts: ProductView[]
  totalPages: number
  totalCount: number
  categoryName?: string
}

export default function CategoryProductsSection({
  slug,
  locale,
  basePath,
  currentPage,
  category,
  categories,
  products,
  searchProducts,
  totalPages,
  totalCount,
  categoryName,
}: CategoryProductsSectionProps) {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <section className="mt-14 md:mt-16">
      <ProductGrid
        category={category}
        categories={categories}
        products={products}
        searchProducts={searchProducts}
        categorySlug={slug}
        categoryName={categoryName}
        totalCount={totalCount}
        locale={locale}
        onSearchStateChange={setIsSearching}
      />
      {totalPages > 1 && !isSearching ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
        />
      ) : null}
    </section>
  )
}
