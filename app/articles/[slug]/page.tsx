import { getArticleBySlug, getArticles } from '@/app/lib/api/articles'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { CalendarDays, Clock, ArrowLeft, BookOpen } from 'lucide-react'

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug, 'th')
  if (!article) notFound()

  return (
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* ── Thin top accent bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <div className="mx-auto max-w-2xl px-6 pb-32 pt-10">

        <Breadcrumb />

        {/* Back link */}
        <Link
          href="/articles"
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft size={13} />
          บทความทั้งหมด
        </Link>

        {/* ── Hero Header ── */}
        <header className="mt-10">
          {/* Meta row */}
          <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-widest text-amber-600">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={11} />
              {new Date(article.publishedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={11} />
              อ่าน 5 นาที
            </span>
          </div>

          {/* Title */}
          <h1
            className="mt-5 font-serif text-[2.15rem] font-bold leading-[1.3] tracking-tight text-slate-900 md:text-[2.6rem]"
            style={{ fontFamily: "'Noto Serif Thai', 'Sarabun', serif" }}
          >
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mt-5 text-[1.05rem] leading-[1.8] text-slate-500">
              {article.excerpt}
            </p>
          )}

          {/* Thin divider */}
          <div className="mt-8 h-px w-16 bg-amber-400" />
        </header>

        {/* ── Cover Image ── */}
        {article.coverImage && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-200">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            {/* Subtle inner vignette */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
          </div>
        )}

        {/* ── Article Body ── */}
        <article className="mt-12">
          <div
            className="
              prose prose-slate max-w-none

              /* Paragraphs */
              prose-p:text-[1rem] prose-p:leading-[2] prose-p:text-slate-600 prose-p:mb-7

              /* Headings */
              prose-h2:mt-16 prose-h2:mb-4
              prose-h2:text-[1.45rem] prose-h2:font-bold prose-h2:text-slate-900
              prose-h2:border-l-4 prose-h2:border-amber-400 prose-h2:pl-4

              prose-h3:mt-10 prose-h3:mb-3
              prose-h3:text-[1.1rem] prose-h3:font-semibold prose-h3:text-slate-800

              /* Emphasis */
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-em:text-slate-700

              /* Lists */
              prose-ul:my-6 prose-ul:space-y-1
              prose-ol:my-6 prose-ol:space-y-1
              prose-li:text-slate-600 prose-li:leading-[1.85]
              prose-li:marker:text-amber-400

              /* Blockquote — pull-quote style */
              prose-blockquote:my-10 prose-blockquote:not-italic
              prose-blockquote:border-l-0 prose-blockquote:pl-0
              prose-blockquote:relative
              prose-blockquote:bg-amber-50 prose-blockquote:rounded-xl
              prose-blockquote:px-8 prose-blockquote:py-6
              prose-blockquote:text-[1.08rem] prose-blockquote:leading-[1.85]
              prose-blockquote:text-slate-700

              /* Code */
              prose-code:text-[0.88em] prose-code:bg-slate-100
              prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
              prose-code:text-rose-600 prose-code:font-normal

              /* Images inside content */
              prose-img:rounded-xl prose-img:shadow-md

              /* Hide HR */
              prose-hr:hidden
            "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* ── Footer Divider ── */}
        <div className="mt-20 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-300">✦</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* ── Bottom Nav ── */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <ArrowLeft size={14} />
            บทความทั้งหมด
          </Link>

          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />
            อ่าน 5 นาที
          </span>
        </div>
      </div>
    </main>
  )
}