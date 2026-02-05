// app/categories/[slug]/page.tsx
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

export default async function CategoryProductsPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = 'th'
  
  // Fetch ข้อมูลแบบขนาน (Parallel) เพื่อความรวดเร็ว
  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getArticles(locale)
  ])

  if (!category) notFound()

  const products = await getProductsByCategory(category.id, locale)
  const relatedArticles = articles.slice(0, 3) // เพิ่มเป็น 3 บทความเพื่อให้ Layout ดูเต็ม

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-24 pt-24 md:pt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        {/* Header Section: เน้นชื่อหมวดหมู่ให้เด่นชัด */}
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

        {/* Product Grid: ปรับแต่ง Gradient Card ให้ดูเบาบางลงแต่ยังหรูหรา */}
        <section className="relative rounded-[2.5rem] bg-white p-6 shadow-xl shadow-gray-100/50 border border-gray-100 md:p-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/categories/${category.slug}/${product.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 transition-all duration-500 group-hover:shadow-lg">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt || product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                  </div>

                  <div className="mt-4 px-1">
                    <h3 className="text-sm font-bold text-gray-800 transition-colors group-hover:text-blue-600 md:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">View Details →</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-400 italic">ขออภัย ยังไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </section>

        {/* SEO & Related Content Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-24 border-t border-gray-100 pt-16">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">ความรู้เกี่ยวกับ{category.name}</h2>
                <p className="mt-2 text-gray-500">รวมเกร็ดความรู้และเทคนิคการเลือกใช้บรรจุภัณฑ์</p>
              </div>
              <Link href="/articles" className="hidden text-sm font-bold text-blue-600 hover:underline md:block">
                ดูบทความทั้งหมด
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                     {/* สมมติว่า article มีรูป ถ้าไม่มีให้ใช้ placeholder */}
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
                       [ Article Image ]
                    </div>
                  </div>
                  <div>
                    <h3 className="line-clamp-2 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}