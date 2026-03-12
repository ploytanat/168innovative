import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"

import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getArticles } from "@/app/lib/api/articles"

export const metadata: Metadata = buildMetadata({
  locale: "th",
  title: "บทความและข้อมูลเชิงลึก",
  description:
    "บทความเกี่ยวกับบรรจุภัณฑ์ OEM เทรนด์สินค้า และแนวทางสร้างแบรนด์ เพื่อช่วยให้ค้นหาและตัดสินใจได้ดีขึ้น",
  path: "/articles",
  keywords: ["บทความบรรจุภัณฑ์", "OEM packaging", "ความรู้บรรจุภัณฑ์"],
})

export default async function ArticlesPage() {
  const locale = "th"
  const articles = await getArticles(locale)

  if (!articles.length) {
    return (
      <main className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <PageIntro
            eyebrow="Articles & Insights"
            title="บทความและข้อมูลเชิงลึก"
            description="ยังไม่มีบทความในขณะนี้"
            breadcrumbs={[{ label: "บทความ" }]}
          />
        </div>
      </main>
    )
  }

  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          eyebrow="Articles & Insights"
          title="บทความและข้อมูลเชิงลึก"
          description="อัปเดตเทรนด์บรรจุภัณฑ์ แนวทางการผลิต OEM และข้อมูลที่ช่วยให้การเลือกสินค้ามีประสิทธิภาพมากขึ้น"
          breadcrumbs={[{ label: "บทความ" }]}
        />

        {featured && (
          <section className="mt-10 mb-20">
            <Link
              href={`/articles/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2rem] border border-[rgba(205,222,241,0.82)] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(241,251,255,0.84)_54%,rgba(255,241,246,0.78))] shadow-[0_20px_54px_rgba(28,40,66,0.07)] transition-shadow hover:shadow-[0_28px_70px_rgba(28,40,66,0.12)] lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
                <Image
                  src={featured.coverImage?.src || "/placeholder.jpg"}
                  alt={featured.coverImage?.alt || featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center rounded-full border border-[#2ecfc4]/30 bg-[#eefdf9] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#2ecfc4]">
                  บทความแนะนำ
                </span>

                <h2 className="mt-5 font-heading text-2xl font-bold leading-snug text-[var(--color-ink)] md:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {featured.excerpt}
                </p>

                {featured.publishedAt && (
                  <p className="mt-6 flex items-center gap-1.5 text-xs text-[#93a3be]">
                    <CalendarDays size={12} />
                    {new Date(featured.publishedAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#2ecfc4] transition-all group-hover:gap-3">
                  อ่านต่อ
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col rounded-[1.6rem] border border-[rgba(205,222,241,0.78)] bg-white/76 p-3 shadow-[0_14px_36px_rgba(28,40,66,0.06)] backdrop-blur">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-[linear-gradient(145deg,#eefbff,#fff0f5)]">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,#eefbff,#fff0f5)]" />
                )}
              </div>

              {article.publishedAt && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#93a3be]">
                  <CalendarDays size={11} />
                  {new Date(article.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}

              <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[#2ecfc4]">
                {article.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {article.excerpt}
              </p>

              <div className="mt-3 h-px w-0 bg-[linear-gradient(90deg,#2ecfc4,#f8a7b8)] transition-all duration-300 group-hover:w-10" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
