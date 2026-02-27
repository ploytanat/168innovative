// app/categories/[slug]/[productSlug]/page.tsx

export const revalidate = 3600

import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'
import Link from 'next/link'
import {
  Send,
  ChevronRight,
  ChevronLeft,
  Factory,
  ShieldCheck,
  Package,
  Truck,
} from 'lucide-react'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import ProductImageGallery from '@/app/components/product/ProductImageGallery'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image.src,
    description: product.description,
    sku: product.slug,
    brand: { '@type': 'Brand', name: '168 Innovative' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `https://168innovative.co.th/categories/${slug}/${productSlug}`,
      priceCurrency: 'THB',
    },
  }

  const TRUST_BADGES = [
    { icon: Factory, text: 'มาตรฐานโรงงาน' },
    { icon: ShieldCheck, text: 'Food Grade' },
    { icon: Package, text: 'บรรจุกันกระแทก' },
    { icon: Truck, text: 'จัดส่งทั่วไทย' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-6 pb-28 lg:px-8">
        <Breadcrumb />

        {/* HERO */}
        <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 lg:grid-cols-2">

          {/* LEFT */}
          <div className="bg-slate-50 p-8 lg:p-12">

            <Link
              href={`/categories/${slug}`}
              className="mb-8 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-teal-600 hover:text-teal-700"
            >
              <ChevronLeft className="h-3 w-3" />
              {category.name}
            </Link>

            <ProductImageGallery
              src={product.image.src}
              alt={product.image.alt}
            />

            <p className="mt-8 text-center text-xs tracking-[0.25em] uppercase text-slate-600 break-words">
              {product.slug}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center border-t border-slate-200 p-8 lg:border-l lg:border-t-0 lg:p-12">

            <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 break-words">
              {product.name}
            </h1>

            <div className="my-6 h-px w-12 bg-teal-500" />

            <p className="text-sm leading-relaxed text-slate-700 break-words">
              {product.description}
            </p>

            {/* SPECIFICATIONS */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                  ข้อมูลจำเพาะ
                </p>

                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {product.specs.map((spec, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-4 px-5 py-4 text-sm"
                    >
                      {/* LABEL */}
                      <div className="text-slate-600 break-words">
                        {spec.label}
                      </div>

                      {/* VALUE */}
                      <div className="text-right font-medium text-slate-900 break-words">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl
                           border border-slate-900 bg-slate-900
                           px-8 py-4 text-sm font-medium tracking-wide text-white
                           transition-all hover:bg-white hover:text-slate-900
                           active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ขอใบเสนอราคาออนไลน์
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-teal-600" strokeWidth={1.5} />
                  <span className="text-xs text-slate-600 break-words">
                    {text}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-24" aria-label="สินค้าใกล้เคียง">

            <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-600">
                  Discover More
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                  สินค้าที่คุณอาจสนใจ
                </h2>
              </div>

              <Link
                href={`/categories/${slug}`}
                className="hidden items-center gap-1 text-xs uppercase tracking-widest text-slate-600 hover:text-slate-900 md:flex"
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
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3 px-1">
                    <h3 className="text-sm font-medium leading-snug text-slate-900 break-words group-hover:text-teal-600">
                      {item.name}
                    </h3>
                    <div className="mt-1.5 h-px w-0 bg-teal-500 transition-all duration-300 group-hover:w-8" />
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