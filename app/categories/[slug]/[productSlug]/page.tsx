// app/categories/[slug]/[productSlug]/page.tsx

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getProductsByCategory } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Send, FileText } from 'lucide-react'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import ProductImageGallery from '@/app/components/product/ProductImageGallery'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const product = await getProductBySlug(productSlug, 'th')
  if (!product) return { title: 'ไม่พบสินค้า' }

  return {
    title: `${product.name} | 168 Innovative`,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = 'th'

  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categorySlug !== slug) notFound()

  const relatedAll = await getProductsByCategory(slug, locale)
  const related = relatedAll.filter((p) => p.id !== product.id).slice(0, 5)

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32 pt-12">
      <div className="mx-auto max-w-7xl px-6">
        <Breadcrumb />

        {/* Product detail */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery
              src={product.image.src}
              alt={product.image.alt}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">

            <Link
              href={`/categories/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
            >
              ← {category.name}
            </Link>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-snug text-[#1A2535] md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 h-px w-12 bg-gradient-to-r from-[#14B8A6] to-transparent" />

            <p className="mt-6 text-base leading-relaxed text-[#5A6A7E]">
              {product.description}
            </p>


    {/* Specifications */}
{product.specs.length > 0 && (
  <div className="mt-10">

    <h2 className="text-sm font-semibold uppercase tracking-widest text-[#14B8A6]">
      Specifications
    </h2>

    <div className="mt-4 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">

      {product.specs.map((spec, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium text-[#5A6A7E]">
            {spec.label}
          </span>

          <span className="font-semibold text-[#1A2535]">
            {spec.value}
          </span>
        </div>
      ))}

    </div>
  </div>
)}

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E3A5F] px-8 py-4 text-sm font-bold text-white shadow-[0_8px_24px_#1E3A5F33] transition-all hover:bg-[#162B45] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                ขอใบเสนอราคา
              </Link>
{
  /* 
              <button
                className=" inline-flex items-center justify-center gap-2 rounded-2xl border border-[#14B8A6] bg-white px-8 py-4 text-sm font-bold text-[#14B8A6] transition-all hover:bg-[#F0FDFA] active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" />
                ดาวน์โหลด Catalog
              </button>
*/
}
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5">
              {[
                { icon: '🏭', text: 'ผลิต OEM / ODM' },
                { icon: '✅', text: 'Food & Cosmetic Grade' },
                { icon: '🚚', text: 'จัดส่งทั่วประเทศ' },
                { icon: '🌏', text: 'นำเข้าตรงจากโรงงาน' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#5A6A7E]"
                >
                  <span>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-28" aria-label="สินค้าใกล้เคียง">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#14B8A6]">
                  Related
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-[#1A2535]">
                  สินค้าในหมวดเดียวกัน
                </h2>
              </div>

              <Link
                href={`/categories/${slug}`}
                className="text-xs font-semibold text-[#1A2535] transition-colors hover:text-[#14B8A6]"
              >
                ดูทั้งหมด →
              </Link>
            </div>

            <div className="mb-8 h-px w-full bg-gradient-to-r from-[#14B8A655] to-transparent" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F1F5F9]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#14B8A611] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="mt-3 px-0.5">
                    <h3 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                      {item.name}
                    </h3>
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