import { getArticleBySlug } from '@/app/lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  params: Promise<{ slug: string }>
}
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const locale: Locale = 'th'

  const article = await getArticleBySlug(slug, locale)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = 'th'

  const article = await getArticleBySlug(slug, locale)
  if (!article) notFound()

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white">
      <article className="mx-auto max-w-3xl px-6">

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {article.title}
          </h1>
          <p className="mt-3 text-gray-400 text-sm">
            {article.publishedAt}
          </p>
        </header>

        {article.coverImage && (
          <div className="relative aspect-[16/9] mb-10 rounded-2xl overflow-hidden">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray max-w-none prose-h2:mt-10 prose-h3:mt-6">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {article.content}
  </ReactMarkdown>
</div>


      </article>
    </main>
  )
}
