import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { ArticleView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "บทความ",
    title: "คลังความรู้บรรจุภัณฑ์",
    viewAll: "ดูทั้งหมด",
    readMore: "อ่านต่อ",
    latest: "ล่าสุด",
  },
  en: {
    eyebrow: "Journal",
    title: "Packaging Knowledge Base",
    viewAll: "View all",
    readMore: "Read more",
    latest: "Latest",
  },
} as const

function ArticleCard({
  article,
  locale,
  featured = false,
}: {
  article: ArticleView
  locale: Locale
  featured?: boolean
}) {
  const copy = COPY[locale]
  const href = withLocalePath(`/articles/${article.slug}`, locale)

  return (
    <Link
      href={href}
      className={`group flex overflow-hidden rounded-[1.25rem] border border-[#e3e1da] bg-white transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(20,20,18,0.09)] ${
        featured ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#f0efeb] ${
          featured ? "aspect-[4/3] sm:aspect-auto sm:w-[48%] sm:shrink-0" : "aspect-[16/9]"
        }`}
      >
        {article.coverImage?.src ? (
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt ?? article.title}
            fill
            sizes={featured ? "(max-width: 640px) 100vw, 48vw" : "33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center">
            <span className="font-heading text-[2rem] font-black text-[#d8d5cf]">168</span>
          </div>
        )}
        {article.category && (
          <span className="absolute left-3 top-3 rounded-full bg-[#141412]/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {article.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {article.publishedAt && (
          <p className="mb-2 text-[11px] font-medium text-[#9a9892]">
            {new Date(article.publishedAt).toLocaleDateString(
              locale === "th" ? "th-TH" : "en-GB",
              { day: "numeric", month: "short", year: "numeric" }
            )}
          </p>
        )}
        <h3
          className={`font-heading font-bold leading-snug text-[#141412] transition-colors group-hover:text-[#4c6b35] ${
            featured ? "line-clamp-3 text-[15px] sm:text-[17px]" : "line-clamp-2 text-[14px]"
          }`}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p
            className={`mt-2 leading-relaxed text-[#6b6b64] ${
              featured ? "line-clamp-3 text-[13px]" : "line-clamp-2 text-[12px]"
            }`}
          >
            {article.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold text-[#4c6b35]">
          {copy.readMore}
          <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  )
}

export default function ArticleJournal({
  articles,
  locale,
}: {
  articles: ArticleView[]
  locale: Locale
}) {
  if (!articles.length) return null
  const copy = COPY[locale]
  const [featured, ...rest] = articles.slice(0, 4)

  return (
    <section
      aria-labelledby="journal-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14"
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
            {copy.eyebrow}
          </p>
          <h2
            id="journal-heading"
            className="mt-2 font-heading text-[clamp(1.4rem,2.5vw,2rem)] font-black text-[#141412]"
          >
            {copy.title}
          </h2>
        </div>
        <Link
          href={withLocalePath("/articles", locale)}
          className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4c6b35] transition-colors hover:text-[#374f26]"
        >
          {copy.viewAll}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
        </Link>
      </div>

      {featured && rest.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
          <ArticleCard article={featured} locale={locale} featured />
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </section>
  )
}
