import { getArticleBySlug } from '@/app/lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { CalendarDays, Clock, ChevronLeft } from 'lucide-react'

interface Props {
  params: {
    locale: Locale
    slug: string
  }
}

/* =====================================================
   Dynamic Metadata
===================================================== */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug, locale } = params
  const article = await getArticleBySlug(slug, locale)

  if (!article) {
    return { title: 'Not Found' }
  }

  return {
    title: `${article.title} | 168 Innovative`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage
        ? [{ url: article.coverImage.src }]
        : [],
    },
  }
}

/* =====================================================
   Page Component
===================================================== */
export default async function ArticleDetailPage(
  { params }: Props
) {
  const { slug, locale } = params

  const article = await getArticleBySlug(slug, locale)

  if (!article) notFound()

  return (
    <main className="min-h-screen bg-white pb-24 pt-12 scroll-smooth">
      <div className="container mx-auto px-4 lg:px-8">

        <Breadcrumb />

        {/* Action Bar */}
        <div className="mt-8 flex items-center justify-between border-b border-gray-100 pb-6">
          <Link
            href={`/${locale}/articles`}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            {locale === 'th' ? 'บทความทั้งหมด' : 'All Articles'}
          </Link>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {new Date(article.publishedAt).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}
            </span>

            <span className="hidden sm:flex items-center gap-1.5">
              <Clock size={14} />
              {locale === 'th' ? 'อ่าน 5 นาที' : '5 min read'}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <header className="mt-12">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl md:leading-[1.15]">
              {article.title}
            </h1>

            {article.excerpt && (
              <div className="mt-8 rounded-2xl bg-slate-50 p-6 md:p-8 border-l-4 border-blue-600">
                <p className="text-lg leading-relaxed text-gray-600 italic">
                  &ldquo;{article.excerpt}&rdquo;
                </p>
              </div>
            )}
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl shadow-slate-200">
              <Image
                src={article.coverImage.src}
                alt={article.coverImage.alt || article.title}
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="mt-16">
            <div
              className="prose prose-lg prose-slate max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b
              prose-p:text-slate-600 prose-p:leading-[1.9] prose-p:mb-8
              prose-strong:text-slate-900
              prose-img:rounded-[2rem]
              prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/30 prose-blockquote:rounded-r-2xl
              prose-li:marker:text-blue-600"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-20 flex flex-wrap gap-2 border-t border-slate-100 pt-10">
                {article.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/articles?tag=${tag.slug}`}
                    className="rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Contact CTA */}
          <section className="relative mt-20 overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-center text-white md:p-16">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold md:text-3xl">
                {locale === 'th'
                  ? 'ปรึกษาเรื่องการผลิตบรรจุภัณฑ์'
                  : 'Consult About Your Packaging Production'}
              </h3>

              <p className="mt-4 mx-auto max-w-md text-slate-400">
                168 Innovative พร้อมช่วยคุณสร้างสรรค์แบรนด์ด้วยบรรจุภัณฑ์คุณภาพสูง
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/contact`}
                  className="rounded-full bg-white px-10 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-blue-50 hover:shadow-xl active:scale-95"
                >
                  {locale === 'th' ? 'คุยกับผู้เชี่ยวชาญ' : 'Talk to Expert'}
                </Link>

                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-10 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  Line Official
                </a>
              </div>
            </div>

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
          </section>

        </div>
      </div>
    </main>
  )
}
