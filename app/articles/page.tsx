import { getArticles } from '../lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import Link from 'next/link'
import Image from 'next/image'

export default async function ArticlesPage() {
  const locale: Locale = 'th'
  const articles = await getArticles(locale)

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        <header className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            บทความความรู้
          </h1>
          <p className="mt-4 text-gray-500">
            ความรู้ด้านบรรจุภัณฑ์ และ OEM สำหรับธุรกิจ
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map(article => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group rounded-2xl border bg-white shadow-sm hover:shadow-lg transition"
            >
              {article.coverImage && (
                <div className="relative aspect-[16/9] rounded-t-2xl overflow-hidden">
                  <Image
                    src={article.coverImage.src}
                    alt={article.coverImage.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-bold group-hover:text-[#1e3a5f] transition">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  {article.publishedAt}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
