// app/articles/page.tsx
import { getArticles } from '../lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/app/components/ui/Breadcrumb'

export default async function ArticlesPage() {
  const locale: Locale = 'th'
  const articles = await getArticles(locale)

  // แยกบทความล่าสุดมาเป็น Highlight 1 อัน
  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <Breadcrumb />

        <header className="mb-16 mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            บทความความรู้ <span className="text-gray-400">/ Insight</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            เจาะลึกเทรนด์บรรจุภัณฑ์ นวัตกรรมวัสดุ และเทคนิคการสร้างแบรนด์ OEM ให้ประสบความสำเร็จ
          </p>
        </header>

        {/* --- Featured Article (บทความเด่น) --- */}
        {featured && (
          <section className="mb-20">
            <Link 
              href={`/articles/${featured.slug}`}
              className="group relative grid grid-cols-1 overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all hover:shadow-2xl lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.coverImage?.src || '/placeholder.jpg'}
                  alt={featured.coverImage?.alt || featured.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <span className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-600">Highlight</span>
                <h2 className="text-2xl font-bold text-gray-900 md:text-4xl group-hover:text-blue-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-6 line-clamp-3 text-gray-600 leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px w-8 bg-gray-300" />
                  <p className="text-xs text-gray-400">{featured.publishedAt}</p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* --- Articles Grid (บทความอื่นๆ) --- */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map(article => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
                {article.coverImage && (
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                {/* Overlay บางๆ ตอน hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>

              <div className="mt-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                    Read Article —
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {article.publishedAt}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- Newsletter / CTA (Optional) --- */}
        <section className="mt-32 rounded-[3rem] bg-gray-900 p-12 text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">ไม่พลาดทุกอัปเดตความรู้</h2>
          <p className="mt-4 text-gray-400">ติดตามเทรนด์บรรจุภัณฑ์ใหม่ๆ ก่อนใคร</p>
          <div className="mt-8 flex justify-center">
             <Link href="/contact" className="rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100 transition-colors">
               ติดต่อสอบถามข้อมูลเพิ่มเติม
             </Link>
          </div>
        </section>

      </div>
    </main>
  )
}