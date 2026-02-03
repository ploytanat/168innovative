// app/categories/page.tsx
import { getCategories } from '@/app/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/app/components/ui/Breadcrumb'

export default async function AllCategoriesPage() {
  // 1. ดึงข้อมูลหมวดหมู่ทั้งหมดจาก API (ไม่จำกัดจำนวน)
  const categories = await getCategories('th')

  return (
    <main className="min-h-screen pt-32 pb-20 bg-custom-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb นำทาง */}
        <Breadcrumb />

        {/* ส่วนหัวข้อหลักของหน้า */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            หมวดหมู่สินค้าทั้งหมด
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl text-lg">
            เลือกชมบรรจุภัณฑ์คุณภาพสูงตามหมวดหมู่การใช้งาน
          </p>
        </div>

        {/* 2. Grid แสดงผลหมวดหมู่ทั้งหมด (เรนเดอร์ตรงจาก API ไม่ผ่าน Section) */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 md:gap-10">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/categories/${item.slug}`}
              className="group flex flex-col items-center rounded-[3rem] bg-white p-4 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* ส่วนรูปภาพหมวดหมู่ */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[2.2rem] bg-[#f2f2f2]">
                {item.image?.src && (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              
              {/* ชื่อและคำบรรยายหมวดหมู่จาก API */}
              <div className="py-6 text-center">
                <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest font-mono line-clamp-2 px-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. SEO Content Section ดึงจาก API */}
        <div className="mt-32 border-t border-gray-200 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* วนลูปแสดง SEO Title/Description ของแต่ละหมวดหมู่ (หรือตัวหลัก) */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              ผู้ผลิตและจำหน่ายบรรจุภัณฑ์เครื่องสำอางครบวงจร
            </h2>
            <div className="grid gap-8 text-left md:grid-cols-2">
              {categories.filter(c => c.seoDescription).slice(0, 4).map(cat => (
                <div key={cat.id} className="space-y-2">
                  <h4 className="font-bold text-gray-800">{cat.seoTitle || cat.name}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {cat.seoDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </main>
  )
}