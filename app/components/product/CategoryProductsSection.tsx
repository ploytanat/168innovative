import type { ProductView } from "@/app/lib/types/view"

import Pagination from "../ui/Pagination"
import ProductGrid from "./Productgrid"

interface CategoryProductsSectionProps {
  slug: string
  locale: "th" | "en"
  basePath: string
  currentPage: number
  products: ProductView[]
  totalPages: number
  totalCount: number
}

export default function CategoryProductsSection({
  slug,
  locale,
  basePath,
  currentPage,
  products,
  totalPages,
  totalCount,
}: CategoryProductsSectionProps) {
  return (
    <section className="mt-14 md:mt-16">
      <ProductGrid
        products={products}
        categorySlug={slug}
        totalCount={totalCount}
        locale={locale}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </section>
  )
}
