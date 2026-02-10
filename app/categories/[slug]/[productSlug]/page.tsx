import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ShieldCheck, Truck, Factory, Globe } from 'lucide-react'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import BackgroundBlobs from '@/app/components/ui/BackgroundBlobs'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}

// 1. Dynamic Metadata สำหรับ SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, productSlug } = await params
  const product = await getProductBySlug(slug, productSlug, 'th') // สมมติส่ง slug แทน id ได้
  if (!product) return { title: 'ไม่พบสินค้า' }

  return {
    title: `${product.slug} | ขายส่งบรรจุภัณฑ์เครื่องสำอางพรีเมียม`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: [product.image.src],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = 'th'

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const product = await getProductBySlug(category.id, productSlug, locale)
  if (!product) notFound()

  const related = await getRelatedProducts(category.id, product.id, locale)

  // 2. Product Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image.src,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "YourBrandName" },
    "offers": {
      "@type": "AggregateOffer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "THB",
      "offerCount": "1"
    }
  }

  return (
    <main className="relative  pb-24 pt-12  bg-[#eeeeee]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto container px-4 lg:px-8">
        <Breadcrumb />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: Product Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-32">
            <div className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-xl">
              <Image
                src={product.image.src}
                alt={product.image.alt || product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
         
            </div>
          </div>

          {/* Right: Product Content */}
          <div className="flex flex-col lg:col-span-6">
            <nav className="mb-4">
              <Link href={`/categories/${category.slug}`} className="text-sm font-bold uppercase tracking-widest text-blue-600 hover:underline">
                {category.name}
              </Link>
            </nav>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-2 text-green-600">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-semibold">สินค้าผ่านการตรวจสอบคุณภาพโรงงาน (QC Pass)</span>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: <Factory className="h-4 w-4" />, text: 'รับผลิตงาน OEM/ODM' },
                { icon: <CheckCircle2 className="h-4 w-4" />, text: 'วัสดุ Food/Cosmetic Grade' },
                { icon: <Globe className="h-4 w-4" />, text: 'นำเข้าจากผู้ผลิตโดยตรง' },
                { icon: <Truck className="h-4 w-4" />, text: 'จัดส่งด่วนทั่วประเทศ' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="text-blue-600">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="flex-1 rounded-2xl bg-gray-900 px-8 py-5 text-center text-base font-bold text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-blue-200 active:scale-95"
              >
                ขอใบเสนอราคาส่ง
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 px-8 py-5 text-base font-bold text-gray-900 transition-all hover:bg-gray-50">
                ดาวน์โหลด Catalog
              </button>
            </div>
          </div>
        </div>

        {/* --- ข้อมูลเพิ่มเติมแบบ Tab-like --- */}
        <section className="mt-24">
           <div className="border-b border-gray-200">
              <h2 className="inline-block border-b-2 border-blue-600 pb-4 text-2xl font-bold text-gray-900">
                รายละเอียดผลิตภัณฑ์
              </h2>
           </div>
           
           <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-bold">จุดเด่นและการใช้งาน</h3>
                <p className="text-gray-600">
                  {product.name} ถูกออกแบบมาเพื่อตอบโจทย์แบรนด์เครื่องสำอางที่ต้องการความทันสมัย 
                  และรักษาประสิทธิภาพของเนื้อผลิตภัณฑ์ให้ยาวนานที่สุด
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {['ป้องกันแสง UV', 'ทนต่อสารเคมี', 'ฝาปิดสนิทกันรั่วซึม', 'ดีไซน์ Ergonomic'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-gray-50 p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900">ข้อมูลเชิงเทคนิค (Specifications)</h3>
                <div className="space-y-4">
                  {[
                    ['วัสดุหลัก', 'High-Density Polypropylene (HDPE)'],
                    ['เทคนิคการพิมพ์', 'Silk Screen, Hot Stamping'],
                    ['ขั้นต่ำการผลิต (MOQ)', 'เริ่มต้น 1,000 ชิ้น'],
                    ['ระยะเวลาผลิต', '15-30 วันทำการ'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-gray-200 pb-2 text-sm">
                      <span className="font-medium text-gray-500">{label}</span>
                      <span className="font-bold text-gray-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </section>

        {/* --- Related Products --- */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">สินค้าใกล้เคียง</h2>
                <p className="text-gray-500 mt-2">สำรวจบรรจุภัณฑ์อื่นๆ ในหมวด {category.name}</p>
              </div>
              <Link href={`/categories/${category.slug}`} className="hidden text-sm font-bold text-blue-600 hover:underline sm:block">
                ดูทั้งหมดในหมวดนี้ →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.slice(0, 4).map(item => (
                <Link key={item.id} href={`/categories/${category.slug}/${item.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm transition-all group-hover:shadow-lg">
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600">{item.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">รหัสสินค้า: {item.slug.toUpperCase()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}