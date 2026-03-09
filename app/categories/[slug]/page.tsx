import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import CategoryProductsSection from "@/app/components/product/CategoryProductsSection"
import ProductGrid from "@/app/components/product/Productgrid"
import Breadcrumb from "@/app/components/ui/Breadcrumb"
import Pagination from "@/app/components/ui/Pagination"
import { getAllCategorySlugs, getCategoryBySlug } from "@/app/lib/api/categories"
import { getProductsByCategory } from "@/app/lib/api/products"
import { Locale } from "@/app/lib/types/content"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale: Locale = "th"

  const category = await getCategoryBySlug(slug, locale)
  if (!category) return { title: "Category not found" }

  return {
    title: category.seoTitle || `${category.name} | 168 Innovative`,
    description:
      category.seoDescription ||
      category.description ||
      `Products in category ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = "th"

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, 1),
  ])

  if (!category) notFound()

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        <Breadcrumb />

        <header className="mb-14 mt-6 border-b border-[#E5E7EB] pb-10">
          <Link
            href="/categories"
            className="mb-5 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            <ChevronLeft className="h-3 w-3" />
            หมวดสินค้าทั้งหมด
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#1A2535] md:text-4xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#5A6A7E]">
              {category.description}
            </p>
          )}
        </header>

        <Suspense
          fallback={
            <>
              <ProductGrid
                products={result.products}
                categorySlug={slug}
                totalCount={result.totalCount}
                locale={locale}
              />
              <Pagination
                currentPage={1}
                totalPages={result.totalPages}
                basePath={`/categories/${slug}`}
              />
            </>
          }
        >
          <CategoryProductsSection
            slug={slug}
            locale={locale}
            basePath={`/categories/${slug}`}
            initialProducts={result.products}
            initialTotalPages={result.totalPages}
            initialTotalCount={result.totalCount}
          />
        </Suspense>
      </div>
    </main>
  )
}
