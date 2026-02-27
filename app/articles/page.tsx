import { getArticles } from '@/app/lib/api/articles'
import Link from 'next/link'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'บทความและข้อมูลเชิงลึก | 168 Innovative',
  description:
    'บทความเกี่ยวกับบรรจุภัณฑ์ OEM เทรนด์อุตสาหกรรม และแนวทางสร้างแบรนด์อย่างมืออาชีพ',
}

export default async function ArticlesPage() {
  const locale = 'th'
  const articles = await getArticles(locale)

  if (!articles.length) {
    return (
      <main className="min-h-screen bg-[#FAFAF8]">
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Breadcrumb />
          <p className="mt-12 text-center text-slate-400">ยังไม่มีบทความในขณะนี้</p>
        </div>
      </main>
    )
  }

  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* ── Accent bar (matches detail page) ── */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-6">

        <Breadcrumb />

        {/* ── Page Header ── */}
        <header className="mt-6 mb-16">
          <p className="text-[11px] font-medium uppercase tracking-widest text-amber-600">
            บทความ &amp; ข้อมูลเชิงลึก
          </p>
          <h1
            className="mt-3 font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl"
            style={{ fontFamily: "'Noto Serif Thai', 'Sarabun', serif" }}
          >
            เรียนรู้และเติบโตไปด้วยกัน
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
            อัปเดตเทรนด์บรรจุภัณฑ์ แนวทางการผลิต OEM และกลยุทธ์สร้างแบรนด์สำหรับธุรกิจยุคใหม่
          </p>
          <div className="mt-6 h-px w-16 bg-amber-400" />
        </header>

        {/* ── Featured Article ── */}
        {featured && (
          <section className="mb-20">
            <Link
              href={`/articles/${featured.slug}`}
              className="group relative grid overflow-hidden rounded-3xl bg-white shadow-md transition-shadow hover:shadow-2xl lg:grid-cols-[1.1fr_1fr]"
            >
              {/* Image side */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] block">
                <img
                  src={featured.coverImage?.src || '/placeholder.jpg'}
                  alt={featured.coverImage?.alt || featured.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* Gradient overlay at bottom on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
              </div>

              {/* Text side */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 ring-1 ring-amber-200">
                  ✦ บทความแนะนำ
                </span>

                <h2
                  className="mt-5 font-serif text-2xl font-bold leading-snug text-slate-900 md:text-3xl"
                  style={{ fontFamily: "'Noto Serif Thai', 'Sarabun', serif" }}
                >
                  {featured.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-[0.95rem] leading-relaxed text-slate-500">
                  {featured.excerpt}
                </p>

                {featured.publishedAt && (
                  <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={12} />
                    {new Date(featured.publishedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-600 transition-gap group-hover:gap-3">
                  อ่านต่อ
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Subtle inner border */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
            </Link>
          </section>
        )}

        {/* ── Section Divider ── */}
        {others.length > 0 && (
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
              บทความอื่นๆ
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        )}

        {/* ── Article Grid ── */}
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {others.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                {article.coverImage ? (
                  <img
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100" />
                )}
                {/* Hover vignette */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 transition-opacity group-hover:opacity-0" />
              </div>

              {/* Meta */}
              {article.publishedAt && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CalendarDays size={11} />
                  {new Date(article.publishedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}

              {/* Title */}
              <h3
                className="mt-2 font-serif text-[1.1rem] font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600"
                style={{ fontFamily: "'Noto Serif Thai', 'Sarabun', serif" }}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                {article.excerpt}
              </p>

              {/* Read more indicator */}
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600 opacity-0 transition-all group-hover:opacity-100 group-hover:gap-2.5">
                อ่านต่อ <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}