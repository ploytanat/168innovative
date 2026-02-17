// app/categories/[slug]/[productSlug]/page.tsx

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getProductsByCategory } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Truck, Globe, FileText, Send } from 'lucide-react'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import ProductImageGallery from '@/app/components/product/ProductImageGallery'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

/* ================= Metadata ================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  const locale = 'th'

  const product = await getProductBySlug(productSlug, locale)

  if (!product) return { title: 'ไม่พบสินค้า' }

  return {
    title: `${product.name} | 168 Innovative`,
    description: product.description.slice(0, 155),
  }
}

/* ================= Page ================= */

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = 'th'

  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
  ])

  if (!category || !product) notFound()

  // 🔥 ตรวจว่าอยู่หมวดนี้จริง
  if (product.categorySlug !== slug) {
    notFound()
  }

  // ดึงสินค้าในหมวดเดียวกัน
  const relatedAll = await getProductsByCategory(slug, locale)

  const related = relatedAll
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">

          {/* LEFT: Image */}
          <div className="lg:col-span-6">
            <ProductImageGallery
              src={product.image.src}
              alt={product.image.alt}
            />
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col lg:col-span-6">
            <Link
              href={`/categories/${slug}`}
              className="text-xs font-bold uppercase text-blue-600"
            >
              {category.name}
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-8 text-lg text-gray-600">
              {product.description}
            </p>

            <div className="mt-12 flex gap-4">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-white font-bold"
              >
                <Send className="h-5 w-5" />
                ขอใบเสนอราคา
              </Link>

              <button className="flex items-center gap-2 rounded-xl border px-8 py-4 font-bold">
                <FileText className="h-5 w-5" />
                ดาวน์โหลด Catalog
              </button>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-32 border-t pt-16">
            <h2 className="text-3xl font-bold mb-8">
              สินค้าใกล้เคียง
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
                >
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-bold">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      


        {/* --- BOTTOM: Related Products --- */}
        {related.length > 0 && (
          <section className="mt-32 border-t border-gray-200 pt-16">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">สินค้าใกล้เคียง</h2>
              <Link href={`/categories/${category.slug}`} className="text-sm font-bold text-blue-600 hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {related.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/categories/${category.slug}/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200 transition-all group-hover:shadow-xl">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-5 text-[15px] font-bold leading-snug text-gray-800 transition-colors group-hover:text-blue-600">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}