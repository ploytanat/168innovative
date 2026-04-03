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
    locale: "en",
    title: q ? `Search "${q}"` : "Search Products",
    description: `Search results for "${q}" from 168 Innovative — cosmetic packaging OEM/ODM`,
    path: q ? `/en/search?q=${encodeURIComponent(q)}` : "/en/search",
  })
}

const ALL_CATEGORY_STUB: CategoryView = {
  id: "search",
  slug: "search",
  name: "Search Results",
  faqItems: [],
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts("en"),
    getCategories("en"),
  ])

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-10 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c47b8a]">
            <Search className="h-3.5 w-3.5" />
            Search Results
          </div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-[#2c2521] sm:text-3xl">
            {q ? (
              <>
                Results for{" "}
                <span className="text-[#c47b8a]">"{q}"</span>
              </>
            ) : (
              "Browse All Products"
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
          locale="en"
          initialQuery={q}
        />
      </div>
    </main>
  )
}
