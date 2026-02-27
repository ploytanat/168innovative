import { getArticles } from '@/app/lib/api/articles'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Articles & In-Depth Insights | 168 Innovative',
  description:
    'Articles about OEM cosmetic packaging, industry trends, and brand building strategies for modern businesses.',
}

export default async function ArticlesPage() {
  const locale = 'en'
  const articles = await getArticles(locale)

  if (!articles.length) {
    return (
      <main className="min-h-screen bg-white">
        <div className="h-px w-full bg-[#14B8A6]" />
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Breadcrumb />
          <p className="mt-12 text-center text-sm text-[#94A3B8]">No articles at this time</p>
        </div>
      </main>
    )
  }

  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-white">

      {/* Accent bar — consistent กับทุกหน้า */}
      <div className="h-px w-full bg-[#14B8A6]" />

      <div className="mx-auto max-w-6xl px-6 pb-32 pt-6">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-14 mt-6 border-b border-[#E5E7EB] pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#14B8A6]">
            Articles &amp; Insights
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-[#1A2535] md:text-4xl">
            Learn and Grow Together
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5A6A7E]">
            Stay updated on packaging trends, OEM manufacturing best practices, and brand building strategies for modern businesses.
          </p>
        </header>

        {/* Featured Article */}
        {featured && (
          <section className="mb-20">
            <LocalizedLink
              href={`/articles/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white
                         transition-shadow hover:shadow-md lg:grid-cols-[1.1fr_1fr]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[380px] block">
                <img
                  src={featured.coverImage?.src || '/placeholder.jpg'}
                  alt={featured.coverImage?.alt || featured.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center rounded-full border border-[#14B8A6]/30
                                 bg-[#F0FDFA] px-3 py-1 text-[10px] font-semibold uppercase
                                 tracking-widest text-[#14B8A6]">
                  Featured Article
                </span>

                <h2 className="mt-5 font-heading text-2xl font-bold leading-snug text-[#1A2535] md:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#5A6A7E]">
                  {featured.excerpt}
                </p>

                {featured.publishedAt && (
                  <p className="mt-6 flex items-center gap-1.5 text-xs text-[#94A3B8]">
                    <CalendarDays size={12} />
                    {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                )}

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#14B8A6]
                                transition-all group-hover:gap-3">
                  Read More
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </LocalizedLink>
          </section>
        )}

        {/* Divider */}
        {others.length > 0 && (
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
              Other Articles
            </span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>
        )}

        {/* Article Grid */}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map((article) => (
            <LocalizedLink
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#F1F5F9]">
                {article.coverImage ? (
                  <img
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#EEF2F7]" />
                )}
                <div className="absolute inset-0 bg-[#14B8A6]/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Date */}
              {article.publishedAt && (
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                  <CalendarDays size={11} />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </p>
              )}

              {/* Title */}
              <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-[#1A2535]
                             transition-colors group-hover:text-[#14B8A6]">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5A6A7E]">
                {article.excerpt}
              </p>

              {/* Underline indicator — consistent กับ card อื่น */}
              <div className="mt-3 h-px w-0 bg-[#14B8A6] transition-all duration-300 group-hover:w-8" />
            </LocalizedLink>
          ))}
        </div>

      </div>
    </main>
  )
}