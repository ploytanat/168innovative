// app/categories/[slug]/[productSlug]/page.tsx
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Factory, Package, ShieldCheck } from 'lucide-react' // สมมติว่าใช้ lucide-react

interface Props {
  params: Promise<{
    slug: string
    productSlug: string
  }>
}

// app/categories/[slug]/[productSlug]/page.tsx
// ... (import เหมือนเดิม)

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale: Locale = 'th'

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const product = await getProductBySlug(category.id, productSlug, locale)
  if (!product) notFound()

  const related = await getRelatedProducts(category.id, product.id, locale)

  return (
    <main className="min-h-screen bg-white pb-24 pt-24 md:pt-32">
      {/* จำกัดความกว้างที่ max-w-6xl เพื่อไม่ให้หน้าแผ่กว้างเกินไป */}
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Breadcrumb />

        {/* --- Product Hero Section --- */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          
          {/* Left: Image (กินพื้นที่ 5/12) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm">
              <Image
                src={product.image.src}
                alt={product.image.alt || product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info (กินพื้นที่ 7/12) */}
          <div className="flex flex-col lg:col-span-7 lg:pl-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
              {category.name}
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Feature List: ใช้เป็นไอคอนเล็กๆ ดูเป็นระเบียบ */}
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3">
              {['รองรับการผลิต OEM', 'วัสดุเกรดพรีเมียม', 'ปรับแต่งขนาดได้', 'เหมาะกับของเหลว/ครีม'].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-8 py-4 text-center text-sm font-bold text-white transition-all hover:bg-gray-800 sm:w-auto"
              >
                ติดต่อขอใบเสนอราคา
              </Link>
            </div>
          </div>
        </div>

        {/* --- Product Details (บีบพื้นที่ให้แคบลงอีกนิดเพื่อให้แคตตาล็อกอ่านง่าย) --- */}
        <div className="mt-20 max-w-4xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
             {/* Applications */}
             <div>
              <h2 className="text-xl font-bold text-gray-900 border-b pb-3">การใช้งาน</h2>
              <ul className="mt-5 space-y-3">
                {['ซองครีมและเซรั่ม', 'ซองบรรจุของเหลวทุกชนิด', 'บรรจุภัณฑ์แบบรีฟิล (Refill)', 'ตัวอย่างสินค้า (Sachet)'].map((text, i) => (
                  <li key={i} className="text-sm text-gray-600">• {text}</li>
                ))}
              </ul>
            </div>

            {/* Spec Table */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-b pb-3">รายละเอียดเชิงเทคนิค</h2>
              <table className="mt-5 w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['รุ่น', product.name],
                    ['วัสดุ', 'Industrial Plastic'],
                    ['การผลิต', 'OEM / Bulk Order'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-2.5 font-bold text-gray-900 w-1/3">{label}</td>
                      <td className="py-2.5 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Related Products (เล็กลงแต่ดูแพง) --- */}
        {related.length > 0 && (
          <section className="mt-24 border-t pt-16">
            <h2 className="mb-10 text-xl font-bold text-gray-900">สินค้าที่คุณอาจสนใจ</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {related.slice(0, 4).map(item => (
                <Link key={item.id} href={`/categories/${category.slug}/${item.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 text-xs font-bold text-gray-800 group-hover:text-blue-600">{item.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}