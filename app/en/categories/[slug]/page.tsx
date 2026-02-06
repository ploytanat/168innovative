import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductsByCategory } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticles } from '@/app/lib/api/articles'
import Breadcrumb from '@/app/components/ui/Breadcrumb'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryProductsENPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = 'en'

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getArticles(locale),
  ])

  if (!category) notFound()

  const products = await getProductsByCategory(category.id, locale)
  const relatedArticles = articles.slice(0, 3)

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-24 pt-24 md:pt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-10 mt-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {category.name}
          </h1>
          <div className="mt-4 h-1 w-16 rounded-full bg-gray-900" />
          {category.description && (
            <p className="mt-6 max-w-2xl text-gray-500 md:text-lg">
              {category.description}
            </p>
          )}
        </header>

        {/* Products */}
        <section className="relative rounded-[2.5rem] bg-white p-6 shadow-xl border md:p-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/en/categories/${category.slug}/${product.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt || product.name}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="mt-4 px-1">
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      View Details →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 italic">
                Sorry, no products found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-24 border-t border-gray-100 pt-16">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Articles about {category.name}
              </h2>
              <p className="mt-2 text-gray-500">
                Tips and insights about cosmetic packaging.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/en/articles/${article.slug}`}
                  className="rounded-2xl border bg-white p-5 hover:shadow-md"
                >
                  <h3 className="font-bold">{article.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
