// app/categories/[slug]/[productSlug]/page.tsx
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
    productSlug: string
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale: Locale = 'th'

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const product = await getProductBySlug(category.id, productSlug, locale)
  if (!product) notFound()

  const related = await getRelatedProducts(category.id, product.id, locale)

  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* HERO */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Summary bullets */}
            <ul className="mt-6 space-y-2 text-gray-700 list-disc list-inside">
              <li>รองรับการผลิต OEM</li>
              <li>เหมาะสำหรับบรรจุภัณฑ์ของเหลวและครีม</li>
              <li>วัสดุพลาสติกเกรดอุตสาหกรรม</li>
              <li>สามารถปรับแต่งตามความต้องการของลูกค้า</li>
            </ul>

            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="inline-block mt-10 rounded-xl bg-[#1e3a5f] px-8 py-4 text-white font-semibold hover:opacity-90"
            >
              ติดต่อสอบถาม / ขอใบเสนอราคา
            </Link>
          </div>
        </div>

        {/* APPLICATIONS */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            เหมาะสำหรับการใช้งาน
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <li>• ซองครีมและเจล</li>
            <li>• ซองบรรจุของเหลว</li>
            <li>• ซองรีฟิล</li>
            <li>• บรรจุภัณฑ์เครื่องสำอาง</li>
          </ul>
        </section>

        {/* SPEC TABLE */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            รายละเอียดสินค้า
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <tbody>
                <tr><td className="p-4 font-medium">รุ่น</td><td className="p-4">{product.name}</td></tr>
                <tr><td className="p-4 font-medium">หมวดหมู่</td><td className="p-4">{category.name}</td></tr>
                <tr><td className="p-4 font-medium">การใช้งาน</td><td className="p-4">Liquid / Cream</td></tr>
                <tr><td className="p-4 font-medium">การผลิต</td><td className="p-4">OEM / Bulk Order</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            จุกซองสำหรับบรรจุภัณฑ์เครื่องสำอาง
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            168 Innovative เป็นผู้ผลิตและจัดจำหน่ายจุกซองและอุปกรณ์บรรจุภัณฑ์
            สำหรับอุตสาหกรรมเครื่องสำอางและอาหาร รองรับงาน OEM
            และการผลิตเชิงอุตสาหกรรมตามมาตรฐาน
          </p>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              สินค้าที่เกี่ยวข้อง
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map(item => (
                <Link
                  key={item.id}
                  href={`/categories/${category.slug}/${item.slug}`}
                  className="rounded-xl bg-white p-4 shadow hover:shadow-lg transition"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={item.image.src} alt={item.image.alt} fill />
                  </div>
                  <h3 className="mt-3 text-sm font-bold">{item.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
