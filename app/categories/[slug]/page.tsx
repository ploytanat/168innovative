// app/categories/[slug]/page.tsx

export const revalidate = 3600
// ถ้าหมวดแทบไม่เปลี่ยนเลย ใช้:
// export const dynamic = 'force-static'

import Breadcrumb from "@/app/components/ui/Breadcrumb"
import { getCategoryBySlug } from "@/app/lib/api/categories"
import { getProductsByCategory } from "@/app/lib/api/products"
import { Locale } from "@/app/lib/types/content"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

/* ─────────────────────────────────────────────
   Static Generation — build ทุก category
   ───────────────────────────────────────────── */
export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.WP_API_URL}/wp-json/wp/v2/product_category?_fields=slug&per_page=100`,
    { cache: "force-cache" }
  )

  const categories = await res.json()

  return categories.map((c: any) => ({
    slug: c.slug,
  }))
}

/* ─────────────────────────────────────────────
   Metadata
   ───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const locale: Locale = "th"

  const category = await getCategoryBySlug(slug, locale)

  if (!category) return { title: "ไม่พบหมวดหมู่สินค้า" }

  return {
    title: category.seoTitle || `${category.name} | บรรจุภัณฑ์เครื่องสำอาง`,
    description:
      category.seoDescription ||
      category.description ||
      `สินค้าในหมวด ${category.name}`,
  }
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = "th"

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale),
  ])

  if (!category) notFound()

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32 pt-12">
      <div className="mx-auto max-w-7xl px-6">
        <Breadcrumb />

        <header className="mb-14 mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            ← หมวดหมู่ทั้งหมด
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1A2535] md:text-4xl">
                {category.name}
              </h1>

              {category.description && (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5A6A7E]">
                  {category.description}
                </p>
              )}
            </div>

            <div className="shrink-0 rounded-full border border-[#14B8A6] bg-[#F0FDFA] px-4 py-1.5 text-xs font-semibold text-[#14B8A6]">
              {products.length} รายการ
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-[#14B8A655] to-transparent" />
        </header>

        {products.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-sm text-[#94A3B8]">
              ยังไม่มีสินค้าในหมวดนี้
            </p>
          </div>
        )}

        {products.length > 0 && (
          <section aria-label={`สินค้าใน${category.name}`}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/categories/${slug}/${product.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F1F5F9]">
                    {product.image?.src ? (
                      <Image
                        src={product.image.src}
                        alt={product.image.alt}
                        fill
                        sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#94A3B8]">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-[#14B8A611] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="mt-3 px-0.5">
                    <h2 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                      {product.name}
                    </h2>
                    <div className="mt-1.5 h-px w-0 rounded-full bg-[#14B8A6] transition-all duration-300 group-hover:w-6" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}