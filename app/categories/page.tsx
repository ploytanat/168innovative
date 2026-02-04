// app/categories/page.tsx
import { getCategories } from '@/app/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'หมวดหมู่สินค้าทั้งหมด | บรรจุภัณฑ์เครื่องสำอาง',
  description:
    'รวมหมวดหมู่บรรจุภัณฑ์เครื่องสำอางคุณภาพสูง สำหรับโรงงานและแบรนด์ OEM เลือกชมได้ตามการใช้งาน',
}

export default async function AllCategoriesPage() {
  const categories = await getCategories('th')

  if (!categories || categories.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Breadcrumb />
          <h1 className="mt-16 text-3xl font-bold">ไม่พบหมวดหมู่สินค้า</h1>
          <p className="mt-4 text-gray-500">
            ขณะนี้ยังไม่มีข้อมูลหมวดหมู่ กรุณากลับมาใหม่อีกครั้ง
          </p>
        </div>
      </main>
    )
  }

  const seoCategories = categories
    .filter(c => c.seoDescription)
    .slice(0, 4)

  return (
    <main className="min-h-screen pt-32 pb-20  border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  border-gray-50">
        <Breadcrumb />

        {/* Page Heading */}
        <header className="mb-16 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            หมวดหมู่สินค้าทั้งหมด
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            เลือกชมบรรจุภัณฑ์คุณภาพสูงตามหมวดหมู่การใช้งาน
          </p>
        </header>

        {/* Categories Grid */}
        <section
          aria-label="Product Categories"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 "
        >
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center rounded-2xl bg-white p-2 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                {category.image?.src && (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt || category.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>

              <div className="py-6 text-center">
                <h2 className="text-base font-bold text-gray-900">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest font-mono line-clamp-2 px-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </section>

        {/* SEO Content */}
        {seoCategories.length > 0 && (
          <section className="mt-32 border-t border-gray-200 pt-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-10 text-center text-2xl md:text-3xl font-bold text-gray-900">
                ผู้ผลิตและจำหน่ายบรรจุภัณฑ์เครื่องสำอางครบวงจร
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                {seoCategories.map(cat => (
                  <article key={cat.id} className="space-y-2">
                    <h3 className="font-bold text-gray-800">
                      {cat.seoTitle || cat.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
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
