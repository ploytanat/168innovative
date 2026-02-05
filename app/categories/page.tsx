// app/categories/page.tsx
import { getCategories } from '@/app/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import type { Metadata } from 'next'
import BackgroundBlobs from '../components/ui/BackgroundBlobs'

export const metadata: Metadata = {
  title: 'หมวดหมู่สินค้าทั้งหมด | บรรจุภัณฑ์เครื่องสำอาง',
  description: 'เลือกชมหมวดหมู่บรรจุภัณฑ์เครื่องสำอางคุณภาพสูง ครบวงจร สำหรับเจ้าของแบรนด์และโรงงาน OEM',
}

export default async function AllCategoriesPage() {
  const categories = await getCategories('th')

  // Error/Empty State
  if (!categories || categories.length === 0) {
    return (
      <main className="relative min-h-screen bg-gray-50 pt-32 pb-20">
        <BackgroundBlobs />
        <div className="container relative mx-auto px-4 text-center">
          <Breadcrumb />
          <div className="mt-20 py-20 rounded-3xl bg-white/50 backdrop-blur-sm border border-white shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ไม่พบหมวดหมู่สินค้า</h1>
            <p className="mt-4 text-gray-500 text-lg">ขณะนี้ยังไม่มีข้อมูลหมวดหมู่สินค้าในระบบ</p>
            <Link href="/" className="mt-8 inline-block text-blue-600 hover:underline">กลับไปหน้าแรก</Link>
          </div>
        </div>
      </main>
    )
  }

  const seoCategories = categories.filter(c => c.seoDescription).slice(0, 4)

  return (
    <main className="relative min-h-screen bg-[#F8F9FA] pb-24 pt-24 md:pt-32">
      <BackgroundBlobs />
      
      <div className="container relative mx-auto px-4 lg:px-8">
        <Breadcrumb />

        {/* Header Section */}
        <header className="mb-12 mt-8 text-center md:mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            หมวดหมู่สินค้า <span className="text-gray-400">/ Categories</span>
          </h1>
          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-gray-900" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl">
            เลือกชมบรรจุภัณฑ์คุณภาพสูงที่คัดสรรมาเพื่อแบรนด์ของคุณ ครบทุกรูปแบบการใช้งาน
          </p>
        </header>

        {/* Categories Grid Container */}
        <section aria-label="Product Categories Listing" className="relative">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200"
              >
                {/* Image Aspect Ratio 1:1 */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      priority
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                      No Image
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col items-center p-5 text-center md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 md:text-xl group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-900">
                    Explore More 
                    <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Knowledge Base Section */}
        {seoCategories.length > 0 && (
          <section className="mt-32 rounded-[3rem] bg-white px-8 py-16 shadow-sm border border-gray-100 md:px-20">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                  ผู้ผลิตและจำหน่ายบรรจุภัณฑ์เครื่องสำอางครบวงจร
                </h2>
                <p className="mt-4 text-gray-500">ข้อมูลเจาะลึกเกี่ยวกับบรรจุภัณฑ์แต่ละประเภทที่เราให้บริการ</p>
              </div>

              <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
                {seoCategories.map(cat => (
                  <article key={cat.id} className="group border-l-2 border-gray-100 pl-6 transition-colors hover:border-gray-900">
                    <h3 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-gray-900">
                      {cat.seoTitle || cat.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {cat.seoDescription}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}