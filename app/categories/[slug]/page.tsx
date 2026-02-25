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

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
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

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params
  const sp = await searchParams

  const locale: Locale = "th"
  // ป้องกัน ?page=0 หรือ ?page=-1
  const page = Math.max(1, Number(sp?.page ?? 1))

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, page),
  ])

  if (!category) notFound()

  const { products, totalPages, totalCount } = result

  // ป้องกัน ?page=999 เกิน totalPages จริง
  if (page > totalPages && totalPages > 0) notFound()

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-8">
        <Breadcrumb />

        <header className="mb-10 mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            หมวดหมู่ทั้งหมด
          </Link>
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