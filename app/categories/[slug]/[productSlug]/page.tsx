// app/categories/[slug]/[productSlug]/page.tsx

export const revalidate = 3600

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Send, ChevronRight, ChevronLeft, Factory, ShieldCheck, Package, Truck } from 'lucide-react'

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
  const product = await getProductBySlug(productSlug, 'th')
  if (!product) return { title: 'ไม่พบสินค้า' }

  return {
    title: `${product.name} | 168 Innovative`,
    description: product.description.slice(0, 155),
    alternates: {
      canonical: `/categories/${slug}/${productSlug}`,
      languages: { en: `/en/categories/${slug}/${productSlug}` },
    },
  }
}

/* ─────────────────────────────────────────────
   Trust badges — lucide icons แทน emoji
───────────────────────────────────────────── */
const TRUST_BADGES = [
  { icon: Factory,    text: 'มาตรฐานโรงงาน' },
  { icon: ShieldCheck, text: 'Food Grade'    },
  { icon: Package,    text: 'บรรจุกันกระแทก' },
  { icon: Truck,      text: 'จัดส่งทั่วไทย'  },
]

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = 'th'

  const [category, product, related] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
    getRelatedProducts(slug, productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categoryId !== category.id) notFound()

  return (
    <main className="min-h-screen bg-white">

      {/* Top accent — single color, minimal */}
      <div className="h-px w-full " />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 lg:px-8">
        <Breadcrumb />

        {/* ── PRODUCT HERO ── */}
        <div className="mt-10 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-[#E5E7EB] lg:grid-cols-2">

          {/* LEFT — Image */}
          <div className="relative bg-[#F8FAFC] p-8 lg:p-12">

            {/* Back to category */}
            <Link
              href={`/categories/${slug}`}
              className="mb-8 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
            >
              <ChevronLeft className="h-3 w-3" />
              {category.name}
            </Link>

            <ProductImageGallery
              src={product.image.src}
              alt={product.image.alt}
            />

            {/* Model slug */}
            <p className="mt-8 text-center text-[10px] tracking-[0.3em] uppercase text-[#94A3B8]">
              {product.slug}
            </p>
          </div>

          {/* RIGHT — Content */}
          <div className="flex flex-col justify-center border-t border-[#E5E7EB] p-8 lg:border-l lg:border-t-0 lg:p-12">

           <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              {product.name}
            </h1>

            <div className="my-6 h-px w-12 bg-[#14B8A6]" />

            <p className="text-sm leading-relaxed text-[#5A6A7E]">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8]">
                  ข้อมูลจำเพาะ
                </p>
                <div className="divide-y divide-[#F1F5F9] rounded-xl border border-[#E5E7EB]">
                  {product.specs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <span className="text-[#94A3B8]">{spec.label}</span>
                      <span className="font-medium text-[#1A2535]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="group inline-flex  items-center justify-center gap-2 rounded-2xl
                           border border-[#1A2535] bg-[#1A2535]
                           px-8 py-4 text-sm font-medium tracking-wide text-white
                           transition-all hover:bg-white hover:text-[#1A2535]
                           active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ขอใบเสนอราคาออนไลน์
              </Link>
            </div>

            {/* Trust badges — lucide icons */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-[#F8FAFC] p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-[#14B8A6]" strokeWidth={1.5} />
                  <span className="text-[10px] leading-tight text-[#64748B]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="mt-24" aria-label="สินค้าใกล้เคียง">

            <div className="mb-10 flex items-end justify-between border-b border-[#E5E7EB] pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#14B8A6]">
                  Discover More
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-[#1A2535]">
                  สินค้าที่คุณอาจสนใจ
                </h2>
              </div>
              <Link
                href={`/categories/${slug}`}
                className="hidden items-center gap-1 text-xs uppercase tracking-widest text-[#5A6A7E]
                           transition-colors hover:text-[#1A2535] md:flex"
              >
                ดูทั้งหมด <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#14B8A6]/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3 px-1">
                    <h3 className="text-sm font-medium leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                      {item.name}
                    </h3>
                    <div className="mt-1.5 h-px w-0 bg-[#14B8A6] transition-all duration-300 group-hover:w-8" />
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