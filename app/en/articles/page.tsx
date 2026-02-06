import { getArticles } from '@/app/lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/app/components/ui/Breadcrumb'

export default async function ArticlesENPage() {
  const locale: Locale = 'en'
  const articles = await getArticles(locale)

  const [featured, ...others] = articles

  return (
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <Breadcrumb />

        <header className="mb-16 mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Insights & Articles
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            Deep insights into packaging trends, material innovation, and OEM branding strategies.
          </p>
        </header>

        {featured && (
          <section className="mb-20">
            <Link
              href={`/en/articles/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={featured.coverImage?.src || '/placeholder.jpg'}
                  alt={featured.coverImage?.alt || featured.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-8 md:p-12">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Highlight
                </span>
                <h2 className="mt-4 text-2xl font-bold md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-6 text-gray-600 line-clamp-3">
                  {featured.excerpt}
                </p>
              </div>
            </Link>
          </section>
        )}

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map(article => (
            <Link
              key={article.id}
              href={`/en/articles/${article.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-100">
                {article.coverImage && (
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                )}
              </div>

              <h3 className="mt-6 text-xl font-bold group-hover:text-blue-600">
                {article.title}
              </h3>
              <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
