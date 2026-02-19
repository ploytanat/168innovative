//app/articles/page.tsx
import { getArticles } from '@/app/lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/app/components/ui/Breadcrumb'

interface ArticlesPageProps {
  params: {
    locale: Locale
  }
}

export default async function ArticlesPage({
  params: { locale },
}: ArticlesPageProps) {

  const articles = await getArticles(locale)

  if (!articles.length) {
    return (
      <main className="bg-[#FBFBFB] py-24">
        <div className="container mx-auto px-4">
          <Breadcrumb />
          <p className="mt-12 text-center text-gray-500">
            No articles found.
          </p>
        </div>
      </main>
    )
  }

  const [featured, ...others] = articles

  return (
    <main className="bg-[#FBFBFB] pb-24 pt-12">
      <div className="container mx-auto px-4 lg:px-8">

        <Breadcrumb />

        {/* Page Header */}
        <header className="mt-8 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Insights & Articles
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            Deep insights into packaging trends, material innovation, and OEM branding strategies.
          </p>
        </header>

        {/* Featured Article */}
        {featured && (
          <section className="mb-20">
            <Link
              href={`/${locale}/articles/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl transition-shadow lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={featured.coverImage?.src || '/placeholder.jpg'}
                  alt={featured.coverImage?.alt || featured.title}
                  fill
                  priority
                  className="object-cover transition-transform group-hover:scale-105"
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

        {/* Grid Articles */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {others.map(article => (
            <Link
              key={article.id}
              href={`/${locale}/articles/${article.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-100">
                {article.coverImage && (
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                )}
              </div>

              <h3 className="mt-6 text-xl font-bold transition-colors group-hover:text-blue-600">
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
