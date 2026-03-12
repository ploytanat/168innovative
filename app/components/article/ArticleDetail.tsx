import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, CalendarDays, Clock, Tag } from "lucide-react"

import ArticleBlocks from "@/app/components/article/ArticleBlocks"
import ArticleBody from "@/app/components/ui/ArticleBody"
import FaqSection from "@/app/components/ui/FaqSection"
import type { ArticleView } from "@/app/lib/types/view"
import type { Locale } from "@/app/lib/types/content"
import type { ArticleLinkContent } from "@/app/lib/seo/article-internal-links"

type Props = {
  article: ArticleView
  locale: Locale
  internalLinks: ArticleLinkContent | null
}

type Copy = {
  eyebrow: string
  backToList: string
  internalLinks: string
  category: string
  tags: string
  published: string
  readingTime: string
  author: string
  faqEyebrow: string
  noCategory: string
}

const copyByLocale: Record<Locale, Copy> = {
  th: {
    eyebrow: "บทความและความรู้",
    backToList: "บทความทั้งหมด",
    internalLinks: "ลิงก์ที่เกี่ยวข้อง",
    category: "หมวดบทความ",
    tags: "แท็ก",
    published: "เผยแพร่",
    readingTime: "เวลาอ่าน",
    author: "ผู้เขียน",
    faqEyebrow: "คำถามที่พบบ่อย",
    noCategory: "บทความ",
  },
  en: {
    eyebrow: "Articles & Insights",
    backToList: "All Articles",
    internalLinks: "Internal Links",
    category: "Category",
    tags: "Tags",
    published: "Published",
    readingTime: "Reading Time",
    author: "Author",
    faqEyebrow: "Frequently Asked Questions",
    noCategory: "Article",
  },
}

function withLocale(href: string, locale: Locale) {
  return locale === "en" ? `/en${href}` : href
}

function formatPublishedAt(value: string, locale: Locale) {
  return new Date(value).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ArticleDetail({ article, locale, internalLinks }: Props) {
  const copy = copyByLocale[locale]
  const readingTime = article.readingTimeMinutes ?? 5
  const listHref = withLocale("/articles", locale)
  const publishedAt = formatPublishedAt(article.publishedAt, locale)
  const categoryLabel = article.category || copy.noCategory

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbfb_0%,#ffffff_22%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8 lg:pt-10">
        <Link
          href={listHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#D8E1EA] bg-white/90 px-5 py-2.5 text-sm font-medium text-[#5A6A7E] shadow-sm backdrop-blur transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]"
        >
          <ArrowLeft size={14} />
          {copy.backToList}
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#DDE7EE] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_55%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_45%)]" />
          <div className="relative grid gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:px-10 lg:py-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#14B8A6]">
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-[#122033] md:text-5xl lg:text-[3.7rem]">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="mt-6 max-w-3xl text-base leading-8 text-[#526274] md:text-lg">
                  {article.excerpt}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7EE] bg-[#F8FBFC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#295A5B]">
                  <CalendarDays size={14} />
                  {publishedAt}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7EE] bg-[#F8FBFC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#295A5B]">
                  <BookOpen size={14} />
                  {locale === "th" ? `อ่าน ${readingTime} นาที` : `${readingTime} min read`}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#F1E4CC] bg-[#FFF8ED] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A56315]">
                  <Tag size={14} />
                  {categoryLabel}
                </div>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-[#E5EDF3] bg-[#F9FBFC] p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.25rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A8898]">
                    {copy.published}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">{publishedAt}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A8898]">
                    {copy.readingTime}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">
                    {locale === "th" ? `${readingTime} นาที` : `${readingTime} minutes`}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A8898]">
                    {copy.author}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">
                    {article.authorName || "168 Innovative"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A8898]">
                    {copy.tags}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.tags.length ? (
                      article.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-[#EDF7F6] px-3 py-1 text-xs font-medium text-[#0F766E]"
                        >
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-[#EDF2F7] px-3 py-1 text-xs font-medium text-[#5A6A7E]">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {article.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-[#DDE7EE] bg-[#EAF1F4] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,38,0.02),rgba(12,24,38,0.18))]" />
          </div>
        ) : null}

        <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-[#E3EAF1] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="border-b border-[#EEF3F6] px-6 py-5 md:px-10 md:py-6">
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6]">
                  <Clock size={14} />
                  <span>
                    {locale === "th"
                      ? `ใช้เวลาอ่านประมาณ ${readingTime} นาที`
                      : `Estimated reading time: ${readingTime} minutes`}
                  </span>
                </div>
              </div>
              <div className="px-6 py-8 md:px-10 md:py-10">
                {article.blocks.length ? (
                  <ArticleBlocks blocks={article.blocks} locale={locale} />
                ) : (
                  <ArticleBody html={article.content} />
                )}
              </div>
            </div>

            {internalLinks ? (
              <section className="rounded-[2rem] border border-[#E7E1D9] bg-[#FCFBF8] px-6 py-8 shadow-sm md:px-8">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#14B8A6]">
                    {copy.internalLinks}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-slate-900">
                    {internalLinks.sectionTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {internalLinks.sectionDescription}
                  </p>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {internalLinks.groups.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-[1.5rem] border border-[#E7E1D9] bg-white p-5"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {group.title}
                      </h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <FaqSection
              eyebrow={copy.faqEyebrow}
              title="FAQ"
              items={article.faqItems}
            />
          </div>

          <aside className="space-y-6">
            <div className="xl:sticky xl:top-28">
              <div className="rounded-[1.75rem] border border-[#DCE6ED] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#14B8A6]">
                  {copy.category}
                </p>
                <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-[#1A2535]">
                  {categoryLabel}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#5A6A7E]">
                  {locale === "th"
                    ? "ใช้บทความนี้เป็นจุดเริ่มต้น แล้วไปต่อยังหน้าสินค้าและหมวดที่เกี่ยวข้องเพื่อเก็บ intent ให้ครบ"
                    : "Use this article as an entry point, then move to related category and product pages to cover the full search intent."}
                </p>
                <Link
                  href={listHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#14B8A6]"
                >
                  <ArrowLeft size={14} />
                  {copy.backToList}
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
