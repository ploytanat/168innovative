// app/categories/[slug]/page.tsx

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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.WP_API_URL}/wp-json/wp/v2/product_category?_fields=slug&per_page=100`,
    { cache: "force-cache" }
  )
  const categories = await res.json()
  return categories.map((c: { slug: string }) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale: Locale = "th"
  const category = await getCategoryBySlug(slug, locale)
  if (!category) return { title: "ไม่พบหมวดหมู่สินค้า" }

  return {
    title: category.seoTitle || `${category.name} | 168 Innovative`,
    description:
      category.seoDescription ||
      category.description ||
      `สินค้าในหมวด ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = "th"

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale),
  ])

  if (!category) notFound()

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />

      <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-10 mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            หมวดหมู่ทั้งหมด
          </Link>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#14B8A6]">
                Category
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#0F1E33] md:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#64748B]">
                  {category.description}
                </p>
              )}
            </div>

            <div className="shrink-0 rounded-full border border-[#14B8A6]/40 bg-[#F0FDFA] px-5 py-2 text-xs font-bold text-[#14B8A6]">
              {products.length} รายการ
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-[#14B8A6]/40 to-transparent" />
        </header>

        {/* ProductGrid — Client Component รับผิดชอบ search + sort */}
        <ProductGrid products={products} categorySlug={slug} />

        {/* SEO description */}
        {category.seoDescription && (
          <section className="mt-24 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />
            <div className="px-8 py-10">
              <h2 className="text-base font-bold text-[#0F1E33]">
                {category.seoTitle || category.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                {category.seoDescription}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}