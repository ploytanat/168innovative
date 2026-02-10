import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductsByCategory } from '@/app/lib/api/products'
import { getArticles } from '@/app/lib/api/articles'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import BackgroundBlobs from '@/app/components/ui/BackgroundBlobs'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

/* ================= Metadata ================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug, 'th')

  if (!category) {
    return { title: 'ไม่พบหมวดหมู่สินค้า' }
  }

  return {
    title: `${category.name} | บรรจุภัณฑ์เครื่องสำอาง OEM / ODM`,
    description:
      category.description ||
      `รวมสินค้าในหมวด ${category.name} สำหรับเจ้าของแบรนด์เครื่องสำอาง พร้อมบริการ OEM / ODM`,
    alternates: {
      canonical: `https://yourwebsite.com/categories/${slug}`,
    },
  }
}

/* ================= Page ================= */
export default async function CategoryProductsPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = 'th'

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getArticles(locale),
  ])

  if (!category) notFound()

  // ✅ ใช้ category.id เท่านั้น
  const products = getProductsByCategory(category.id, locale)
  const relatedArticles = articles.slice(0, 3)

  /* ================= Structured Data ================= */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://yourwebsite.com/categories/${category.slug}/${p.slug}`,
    })),
  }

  return (
    <main className="bg-[#F8F9FA] pt-12 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackgroundBlobs />

      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        {/* ================= Hero (เหมือนหน้า categories) ================= */}
        <header className="mx-auto mt-12 max-w-4xl text-center">
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
              {category.description}
            </p>
          )}
        </header>

        {/* ================= Products Grid (pattern เดียวกับ categories) ================= */}
        <section
          aria-labelledby="products-heading"
          className="mt-20"
        >
          <h2 id="products-heading" className="sr-only">
            รายการสินค้าในหมวด {category.name}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/categories/${category.slug}/${product.slug}`}
                  className="
                    group relative overflow-hidden rounded-xl bg-white
                    shadow-sm transition-all duration-500
                    hover:-translate-y-2 hover:shadow-2xl
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
                  "
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.image?.src ? (
                      <Image
                        src={product.image.src}
                        alt={product.image.alt || product.name}
                        fill
                        priority={index < 4}
                        sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                        className="
                          object-cover transition-transform duration-700
                          group-hover:scale-110
                        "
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={product.name}
                        className="
                          flex h-full w-full items-center justify-center
                          bg-gradient-to-br from-gray-100 to-gray-200
                        "
                      >
                        <span className="text-xs font-semibold text-gray-400">
                          Image coming soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col items-center p-6 text-center">
                    <h3
                      className="
                        text-sm font-bold text-gray-900
                        transition-colors
                        group-hover:text-blue-600
                      "
                    >
                      {product.name}
                    </h3>

                    <span
                      className="
                        relative mt-5 inline-flex items-center gap-1
                        text-xs font-bold text-blue-600
                        transition-colors
                        group-hover:text-blue-700
                      "
                    >
                      ดูรายละเอียดสินค้า
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <p className="text-lg font-semibold text-gray-400">
                ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
              </p>
              <p className="mt-2 text-sm text-gray-400">
                กรุณาติดต่อทีมงานเพื่อสอบถามรายละเอียดเพิ่มเติม
              </p>
            </div>
          )}
        </section>

        {/* ================= Knowledge / SEO Section (โทนเดียวกับ categories) ================= */}
        {relatedArticles.length > 0 && (
          <section className="mt-32 rounded-[3rem] bg-white px-8 py-20 shadow-sm md:px-20">
            <div className="mx-auto max-w-5xl">
              <header className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  ความรู้เกี่ยวกับ{category.name}
                </h2>
                <p className="mt-4 text-gray-500">
                  แนวทางการเลือกบรรจุภัณฑ์ และการสร้างแบรนด์ให้เติบโต
                </p>
              </header>

              <div className="grid gap-12 md:grid-cols-3">
                {relatedArticles.map(article => (
                  <article key={article.id}>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-lg font-bold text-gray-800 transition-colors hover:text-blue-600">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                      {article.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
