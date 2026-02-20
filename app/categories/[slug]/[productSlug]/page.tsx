// app/categories/[slug]/[productSlug]/page.tsx

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getProductsByCategory } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Send, FileText, ChevronRight, CheckCircle2 } from 'lucide-react'

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
  if (product.categoryId !== category.id) notFound()

  const relatedAll = await getProductsByCategory(slug, locale)
  const related = relatedAll.filter((p) => p.id !== product.id).slice(0, 5)

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32 pt-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left: Sticky Image Gallery */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-32">
              <ProductImageGallery
                src={product.image.src}
                alt={product.image.alt}
              />
            </div>
          </div>

          {/* Right: Product Content */}
          <div className="flex flex-col lg:col-span-6 lg:pl-4">
            {/* Category Tag */}
            <Link
              href={`/categories/${slug}`}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]"
            >
              <span className="h-px w-8 bg-[#14B8A6] transition-all group-hover:w-12" />
              {category.name}
            </Link>

            <h1 className="mt-6 font-serif text-3xl font-bold leading-[1.2] text-[#1A2535] md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-8 text-lg font-light leading-relaxed text-[#5A6A7E]">
              {product.description}
            </p>

            {/* Specifications Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-[2px] bg-[#14B8A6]" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#1A2535]">
                    Specifications
                  </h2>
                </div>

                <div className="divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white px-8 py-2 shadow-sm">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-5 text-sm">
                      <span className="font-medium text-[#8492A6]">{spec.label}</span>
                      <span className="font-bold text-[#1A2535]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="group flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#1E3A5F] px-8 py-5 text-sm font-bold text-white shadow-xl shadow-blue-900/10 transition-all hover:bg-[#142B45] hover:shadow-2xl active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                ขอใบเสนอราคาออนไลน์
              </Link>
              
              {/* Optional: Catalog Button (Uncomment to use) */}
              {/* <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[#E2E8F0] bg-white px-8 py-5 text-sm font-bold text-[#1A2535] transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]">
                <FileText className="h-4 w-4" />
                Catalog (PDF)
              </button> 
              */}
            </div>

            {/* Trust Badges Grid */}
            <div className="mt-12 grid grid-cols-2 gap-3">
              {[
                { icon: '🏭', text: 'โรงงานผลิตมาตรฐาน' },
                { icon: '🛡️', text: 'Food & Cosmetic Grade' },
                { icon: '📦', text: 'บรรจุภัณฑ์กันกระแทก' },
                { icon: '🚚', text: 'จัดส่งด่วนทั่วประเทศ' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-3 rounded-2xl border border-gray-50 bg-[#F8FAFC] p-4 transition-colors hover:bg-white hover:border-[#14B8A644]"
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[13px] font-semibold text-[#5A6A7E]">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="mt-32 border-t border-gray-100 pt-24" aria-label="สินค้าใกล้เคียง">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#14B8A6]">
                  Discover More
                </span>
                <h2 className="mt-3 font-serif text-3xl font-bold text-[#1A2535]">
                  สินค้าที่คุณอาจสนใจ
                </h2>
              </div>
              <Link
                href={`/categories/${slug}`}
                className="hidden items-center gap-2 text-sm font-bold text-[#1A2535] hover:text-[#14B8A6] md:flex"
              >
                ดูหมวดหมู่ทั้งหมด <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#F1F5F9]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="mt-5 space-y-1">
                    <h3 className="line-clamp-1 text-sm font-bold text-[#1A2535] group-hover:text-[#14B8A6] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs font-medium text-[#8492A6]">
                      168 Innovative
                    </p>
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