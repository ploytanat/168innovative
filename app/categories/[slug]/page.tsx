export const revalidate = 3600

import Breadcrumb from "@/app/components/ui/Breadcrumb"
import { getCategoryBySlug } from "@/app/lib/api/categories"
import { getProductsByCategory } from "@/app/lib/api/products"
import { Locale } from "@/app/lib/types/content"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import ProductGrid from "@/app/components/product/Productgrid"
import Pagination from "@/app/components/ui/Pagination"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/* ─────────────────────────────
   Metadata
───────────────────────────── */

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams

  const page = Math.max(1, Number(sp?.page ?? 1))
  const locale: Locale = "th"

  const category = await getCategoryBySlug(slug, locale)
  if (!category) return { title: "ไม่พบหมวดหมู่สินค้า" }

  return {
    title:
      page > 1
        ? `${category.name} หน้า ${page} | 168 Innovative`
        : category.seoTitle || `${category.name} | 168 Innovative`,
    description:
      category.seoDescription ||
      category.description ||
      `สินค้าในหมวด ${category.name}`,
  }
}

/* ─────────────────────────────
   Page
───────────────────────────── */

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const locale: Locale = "th"
  const page = Math.max(1, Number(sp?.page ?? 1))

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, page),
  ])

  if (!category) notFound()

  const { products, totalPages, totalCount } = result

  if (page > totalPages && totalPages > 0) notFound()

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-10">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-14 mt-10 border-b border-[#E5E7EB] pb-10">
          <Link
            href="/categories"
            className="mb-5 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            <ChevronLeft className="h-3 w-3" />
            หมวดหมู่ทั้งหมด
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

        <ProductGrid
          products={products}
          categorySlug={slug}
          totalCount={totalCount}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/categories/${slug}`}
        />
      </div>
    </main>
  )
}