import type { Metadata } from "next"
import { Search } from "lucide-react"

import ProductGrid from "@/app/components/product/Productgrid"
import { buildMetadata } from "@/app/config/seo"
import { getCategories } from "@/app/lib/api/categories"
import { getProducts } from "@/app/lib/api/products"
import type { CategoryView } from "@/app/lib/types/view"

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "" } = await searchParams
  return buildMetadata({
    locale: "th",
    title: q ? `ค้นหา "${q}"` : "ค้นหาสินค้า",
    description: `ผลการค้นหาสินค้า "${q}" จาก 168 Innovative บรรจุภัณฑ์เครื่องสำอาง OEM/ODM`,
    path: q ? `/search?q=${encodeURIComponent(q)}` : "/search",
  })
}

const ALL_CATEGORY_STUB: CategoryView = {
  id: "search",
  slug: "search",
  name: "ผลการค้นหา",
  faqItems: [],
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts("th"),
    getCategories("th"),
  ])

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-10 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c47b8a]">
            <Search className="h-3.5 w-3.5" />
            ผลการค้นหา
          </div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-[#2c2521] sm:text-3xl">
            {q ? (
              <>
                สินค้าที่ค้นหา{" "}
                <span className="text-[#c47b8a]">"{q}"</span>
              </>
            ) : (
              "ค้นหาสินค้าทั้งหมด"
            )}
          </h1>
        </div>

        <ProductGrid
          category={ALL_CATEGORY_STUB}
          categories={categories}
          products={products}
          searchProducts={products}
          categorySlug="search"
          totalCount={products.length}
          locale="th"
          initialQuery={q}
        />
      </div>
    </main>
  )
}
