"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, CalendarDays, Clock, Tag } from "lucide-react"
import { motion } from "framer-motion"

import ArticleBlocks from "@/app/components/article/ArticleBlocks"
import ArticleBody from "@/app/components/ui/ArticleBody"
import FaqSection from "@/app/components/ui/FaqSection"
import type { ArticleView } from "@/app/lib/types/view"
import type { Locale } from "@/app/lib/types/content"
import type { ArticleLinkContent } from "@/app/lib/seo/article-internal-links"
import { fadeUp, MOTION_EASE, MOTION_VIEWPORT, staggerMedium, staggerSmall } from "@/app/components/ui/motion"

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
    <main className="min-h-screen bg-transparent">
      <motion.div
        className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8 lg:pt-10"
        variants={staggerSmall}
        initial="hidden"
        whileInView="visible"
        viewport={MOTION_VIEWPORT}
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: MOTION_EASE }}>
          <Link
          href={listHref}
          className="inline-flex items-center gap-2 rounded-[0.95rem] border border-[rgba(211,217,225,0.92)] bg-white px-5 py-2.5 text-sm font-medium text-[#5A6A7E] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <ArrowLeft size={14} />
          {copy.backToList}
        </Link>
        </motion.div>

        <motion.section className="mt-6 border-t border-[rgba(211,217,225,0.96)] pt-8" variants={staggerSmall}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
              <p className="eyebrow-label">
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-[#122033] md:text-5xl lg:text-[3.7rem]">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-[#44546b] md:text-xl">
                  {article.excerpt}
                </p>
              ) : null}

              <motion.div className="mt-8 flex flex-wrap gap-3" variants={staggerSmall}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#55667d]">
                  <CalendarDays size={14} />
                  {publishedAt}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#55667d]">
                  <BookOpen size={14} />
                  {locale === "th" ? `อ่าน ${readingTime} นาที` : `${readingTime} min read`}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#697384]">
                  <Tag size={14} />
                  {categoryLabel}
                </div>
              </motion.div>
            </motion.div>

            <motion.aside className="deck-card rounded-[1rem] p-6" variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="deck-card-soft rounded-[0.95rem] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#69778d]">
                    {copy.published}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">{publishedAt}</p>
                </div>
                <div className="deck-card-soft rounded-[0.95rem] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#69778d]">
                    {copy.readingTime}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">
                    {locale === "th" ? `${readingTime} นาที` : `${readingTime} minutes`}
                  </p>
                </div>
                <div className="deck-card-soft rounded-[0.95rem] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#69778d]">
                    {copy.author}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#1A2535]">
                    {article.authorName || "168 Innovative"}
                  </p>
                </div>
                <div className="deck-card-soft rounded-[0.95rem] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#69778d]">
                    {copy.tags}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.tags.length ? (
                      article.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-3 py-1.5 text-[13px] font-medium text-[#697384]"
                        >
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-3 py-1.5 text-[13px] font-medium text-[#46576f]">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.section>

        {article.coverImage ? (
          <motion.div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[1.1rem] border border-[#DDE7EE] bg-[#EAF1F4] shadow-[0_12px_26px_rgba(32,36,43,0.06)]" variants={fadeUp} transition={{ duration: 0.6, ease: MOTION_EASE }}>
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,24,38,0.02),rgba(12,24,38,0.18))]" />
          </motion.div>
        ) : null}

        <motion.section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]" variants={staggerMedium}>
          <div className="min-w-0 space-y-8">
            <motion.div className="overflow-hidden rounded-[1.1rem] border border-[#E3EAF1] bg-white shadow-[0_12px_26px_rgba(32,36,43,0.05)]" variants={fadeUp} transition={{ duration: 0.6, ease: MOTION_EASE }}>
              <div className="border-b border-[#EEF3F6] px-6 py-5 md:px-10 md:py-6">
                <div className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
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
            </motion.div>

            {internalLinks ? (
              <motion.section className="rounded-[1.1rem] border border-[#E3E8EE] bg-[#F7F8FA] px-6 py-8 shadow-sm md:px-8" variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
                <div className="max-w-3xl">
                  <p className="eyebrow-label text-[12px]">
                    {copy.internalLinks}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-slate-900">
                    {internalLinks.sectionTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {internalLinks.sectionDescription}
                  </p>
                </div>

                <motion.div className="mt-8 grid gap-5 md:grid-cols-2" variants={staggerSmall}>
                  {internalLinks.groups.map((group) => (
                    <motion.div
                      key={group.title}
                      className="rounded-[1rem] border border-[#E3E8EE] bg-white p-5"
                      variants={fadeUp}
                      transition={{ duration: 0.45, ease: MOTION_EASE }}
                    >
                      <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        {group.title}
                      </h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-2xl border border-slate-200 px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            ) : null}

            <FaqSection
              eyebrow={copy.faqEyebrow}
              title="FAQ"
              items={article.faqItems}
            />
          </div>

          <motion.aside className="space-y-6" variants={fadeUp} transition={{ duration: 0.55, ease: MOTION_EASE }}>
            <div className="xl:sticky xl:top-28">
              <div className="deck-card rounded-[1rem] p-6">
                <p className="eyebrow-label">
                  {copy.category}
                </p>
                <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-[#1A2535]">
                  {categoryLabel}
                </h2>
                <p className="mt-4 text-base leading-8 text-[#46576f]">
                  {locale === "th"
                    ? "ใช้บทความนี้เป็นจุดเริ่มต้น แล้วไปต่อยังหน้าสินค้าและหมวดที่เกี่ยวข้องเพื่อเก็บ intent ให้ครบ"
                    : "Use this article as an entry point, then move to related category and product pages to cover the full search intent."}
                </p>
                <Link
                  href={listHref}
                  className="btn-primary-soft mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                >
                  <ArrowLeft size={14} />
                  {copy.backToList}
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.section>
      </motion.div>
    </main>
  )
}
