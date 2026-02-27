import { getArticleBySlug, getArticles } from '@/app/lib/api/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { CalendarDays, Clock, ArrowLeft, BookOpen } from 'lucide-react'

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug, 'en')
  if (!article) notFound()

  return (
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* ── Thin top accent bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-6">

        <Breadcrumb />

        {/* Back link */}
        <LocalizedLink
          href="/articles"
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft size={13} />
          All Articles
        </LocalizedLink>

        {/* ── Hero Header ── */}
        <header className="mt-6">
          {/* Meta row */}
          <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-widest text-amber-600">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={11} />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={11} />
              5 min read
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
            <img
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
          </div>
        )}

        {/* ── Article Body ── */}
        <article className="mt-12">
          <div
         
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* ── Footer Divider ── */}
        <div className="mt-20 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-300">✦</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* ── Bottom Nav ── */}
        <div className="mt-8 flex items-center justify-between">
          <LocalizedLink
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <ArrowLeft size={14} />
            All Articles
          </LocalizedLink>

          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />
            5 min read
          </span>
        </div>
      </div>
    </main>
  )
}