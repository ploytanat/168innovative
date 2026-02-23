// en/categories/[slug]/[productSlug]/page.tsx

export const revalidate = 3600

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Send, ChevronRight, ChevronLeft } from 'lucide-react'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import ProductImageGallery from '@/app/components/product/ProductImageGallery'

const BASE = process.env.WP_API_URL

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

/* ─────────────────────────────────────────────
   Static Generation
   ───────────────────────────────────────────── */
export async function generateStaticParams() {
  const [productsRes, catsRes] = await Promise.all([
    fetch(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=slug,product_category`,
      { cache: 'force-cache' }
    ),
    fetch(
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`,
      { cache: 'force-cache' }
    ),
  ])

  const [products, cats] = await Promise.all([
    productsRes.json(),
    catsRes.json(),
  ])

  const catMap: Record<number, string> = Object.fromEntries(
    cats.map((c: any) => [c.id, c.slug])
  )

  return products
    .map((p: any) => ({
      slug: catMap[p.product_category?.[0]] ?? null,
      productSlug: p.slug,
    }))
    .filter((p: any) => p.slug !== null)
}

/* ─────────────────────────────────────────────
   Metadata
   ───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug, slug } = await params
  // ✅ แก้: ใช้ locale 'en'
  const product = await getProductBySlug(productSlug, 'en')
  if (!product) return { title: 'Product not found' }

  return {
    title: `${product.name} | 168 Innovative`,
    description: product.description.slice(0, 155),
    alternates: {
      canonical: `/en/categories/${slug}/${productSlug}`,
      languages: { th: `/categories/${slug}/${productSlug}` },
    },
  }
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  // ✅ แก้: locale เป็น 'en'
  const locale = 'en'

  const [category, product, related] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
    getRelatedProducts(slug, productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categoryId !== category.id) notFound()

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0EA5E9] to-[#6366F1]" />

      <div className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-10">
          <Breadcrumb />
        </div>

        {/* ═══════════════ PRODUCT HERO ═══════════════ */}
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-2">

          {/* LEFT — Image Panel */}
          <div className="relative bg-gradient-to-br from-[#EEF2F7] to-[#E2EAF4] p-8 lg:p-12">
            <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[#14B8A6]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-[#6366F1]/10 blur-2xl" />

            {/* Category pill */}
            {/* ✅ แก้: link ไปหน้า en/categories */}
            <Link
              href={`/en/categories/${slug}`}
              className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#14B8A6] backdrop-blur-sm transition-all hover:bg-[#14B8A6] hover:text-white"
            >
              <ChevronLeft className="h-3 w-3" />
              {category.name}
            </Link>

            <div className="relative">
              <ProductImageGallery
                src={product.image.src}
                alt={product.image.alt}
              />
            </div>

            {/* Model badge */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-[#14B8A6]/40 to-transparent" />
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-widest text-[#64748B] shadow-sm">
                {product.slug.toUpperCase()}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#14B8A6]/40 to-transparent" />
            </div>
          </div>

          {/* RIGHT — Content Panel */}
          <div className="flex flex-col justify-center p-8 lg:p-12">

            <h1 className="font-serif text-3xl font-bold leading-tight text-[#0F1E33] md:text-4xl lg:text-[2.6rem]">
              {product.name}
            </h1>

            <div className="my-6 flex items-center gap-3">
              <div className="h-[3px] w-10 rounded-full bg-[#14B8A6]" />
              <div className="h-[3px] w-4 rounded-full bg-[#14B8A6]/30" />
            </div>

            <p className="text-base font-light leading-relaxed text-[#4A5568] lg:text-[1.05rem]">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-10">
                {/* ✅ แก้: หัวข้อภาษาอังกฤษ */}
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#94A3B8]">
                  Specifications
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-[#F8FAFC]">
                  {product.specs.map((spec, index) => (
                    <div
                      key={index}
                      className={`flex flex-col gap-1.5 px-6 py-4 text-sm transition-colors hover:bg-[#EEF6F5] sm:flex-row sm:items-center sm:justify-between ${
                        index !== product.specs.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <span className="shrink-0 font-medium text-[#94A3B8]">{spec.label}</span>
                      <span className="rounded-lg bg-white px-3 py-1 font-bold text-[#0F1E33] shadow-sm sm:max-w-[60%] sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {/* ✅ แก้: ข้อความปุ่มภาษาอังกฤษ */}
              <Link
                href={`/en/contact?product=${encodeURIComponent(product.name)}`}
                className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#0F1E33] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Request a Quote
              </Link>
            </div>

            {/* Trust badges */}
            {/* ✅ แก้: ข้อความ badge ภาษาอังกฤษ */}
            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: '🏭', text: 'Factory Standard' },
                { icon: '🛡️', text: 'Food Grade' },
                { icon: '📦', text: 'Secure Packaging' },
                { icon: '🚚', text: 'Nationwide Shipping' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-[#F8FAFC] p-3 text-center transition-colors hover:bg-[#EEF6F5]"
                >
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[11px] font-semibold leading-tight text-[#64748B]">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ RELATED PRODUCTS ═══════════════ */}
        {related.length > 0 && (
          // ✅ แก้: aria-label ภาษาอังกฤษ
          <section className="mt-24" aria-label="Related Products">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#14B8A6]">
                  Discover More
                </span>
                {/* ✅ แก้: หัวข้อภาษาอังกฤษ */}
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#0F1E33] md:text-3xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/en/categories/${slug}`}
                className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0F1E33] transition-all hover:border-[#14B8A6] hover:text-[#14B8A6] md:flex"
              >
                {/* ✅ แก้: ข้อความภาษาอังกฤษ */}
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/en/categories/${slug}/${item.slug}`}
                  className="group rounded-3xl bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#EEF2F7]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-0.5 px-1">
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-[#0F1E33] transition-colors group-hover:text-[#14B8A6]">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-medium text-[#94A3B8]">168 Innovative</p>
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