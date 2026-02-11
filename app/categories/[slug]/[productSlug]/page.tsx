import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Truck, Factory, Globe, FileText, Send } from 'lucide-react'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import ProductImageGallery from '@/app/components/product/ProductImageGallery'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

/* -------------------------------------------------------------------------- */
/* 1. SEO & METADATA                               */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, productSlug } = await params
  const product = await getProductBySlug(slug, productSlug, 'th')
  
  if (!product) return { title: 'ไม่พบสินค้า' }

  const url = `https://yourdomain.com/categories/${slug}/${productSlug}`
  const shortDesc = product.description.slice(0, 155)

  return {
    title: `${product.name} | ขายส่งบรรจุภัณฑ์เครื่องสำอาง OEM`,
    description: shortDesc,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: shortDesc,
      url,
      siteName: 'Your Brand Name',
      images: [{ url: product.image.src, width: 1200, height: 1200, alt: product.name }],
      type: 'website',
    },
  }
}

/* -------------------------------------------------------------------------- */
/* 2. MAIN PAGE COMPONENT                          */
/* -------------------------------------------------------------------------- */
export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = 'th'

  // Fetch data in parallel for better performance
  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(slug, productSlug, locale)
  ])

  if (!category || !product) notFound()

  const related = await getRelatedProducts(category.id, product.id, locale)
  const productUrl = `https://yourdomain.com/categories/${slug}/${productSlug}`

  // --- Structured Data (JSON-LD) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        image: product.image.src,
        description: product.description,
        sku: product.slug,
        brand: { '@type': 'Brand', name: 'Your Brand Name' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          url: productUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: 'https://yourdomain.com' },
          { '@type': 'ListItem', position: 2, name: category.name, item: `https://yourdomain.com/categories/${slug}` },
          { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- LEFT: Image Section --- */}
          <div className="lg:col-span-6">
             <ProductImageGallery 
                src={product.image.src} 
                alt={product.image.alt || product.name} 
             />
          </div>

          {/* --- RIGHT: Info Section --- */}
          <div className="flex flex-col lg:col-span-6">
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex w-fit text-xs font-bold uppercase tracking-[0.2em] text-blue-600 transition-colors hover:text-blue-800"
            >
              {category.name}
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 md:text-5xl lg:leading-tight">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700 w-fit border border-green-100">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">QC Passed Factory Direct</span>
            </div>

            <p className="mt-8 text-lg leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Feature Grid */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {[
                { icon: Factory, text: 'รับผลิต OEM/ODM' },
                { icon: CheckCircle2, text: 'Cosmetic Grade' },
                { icon: Globe, text: 'นำเข้าโดยตรง' },
                { icon: Truck, text: 'จัดส่งทั่วประเทศ' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons (CTAs) */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-5 text-center font-bold text-white transition-all hover:bg-blue-600 active:scale-[0.98]"
              >
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                ขอใบเสนอราคา
              </Link>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-5 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]">
                <FileText className="h-5 w-5" />
                ดาวน์โหลด Catalog
              </button>
            </div>
          </div>
        </div>

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