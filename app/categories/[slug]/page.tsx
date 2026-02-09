import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductsByCategory } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticles } from '@/app/lib/api/articles'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import type { Metadata } from 'next'
import BackgroundBlobs from '@/app/components/ui/BackgroundBlobs'

interface Props {
  params: Promise<{ slug: string }>
}

// 1. สร้าง Dynamic Metadata ตามหมวดหมู่
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug, 'th')
  
  if (!category) return { title: 'ไม่พบหมวดหมู่สินค้า' }

  return {
    title: `${category.name} | ขายส่งบรรจุภัณฑ์เครื่องสำอางคุณภาพสูง`,
    description: category.description || `รวมสินค้าในหมวด ${category.name} สำหรับเจ้าของแบรนด์เครื่องสำอาง ครบวงจร พร้อมบริการสกรีนโลโก้`,
    alternates: {
      canonical: `https://yourwebsite.com/categories/${slug}`,
    }
  }
}

export default async function CategoryProductsPage({ params }: Props) {
  const { slug } = await params
  const locale: Locale = 'th'
  
  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getArticles(locale)
  ])

  if (!category) notFound()

  const products = await getProductsByCategory(category.id, locale)
  // กรองบทความที่เกี่ยวข้อง (ถ้ามีระบบ tag/category ในบทความให้ใช้ตัวนั้นแทน slice)
  const relatedArticles = articles.slice(0, 3)

  // 2. Structured Data (BreadcrumbList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "หน้าหลัก", "item": "https://yourwebsite.com" },
      { "@type": "ListItem", "position": 2, "name": "หมวดหมู่ทั้งหมด", "item": "https://yourwebsite.com/categories" },
      { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://yourwebsite.com/categories/${slug}` }
    ]
  }

  return (
    <main className=" bg-[#ffffff] pb-24 pt-12 ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundBlobs />
      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb />

        <header className="mb-10 mt-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {category.name}
          </h1>
          <div className="mt-4 h-1.5 w-20 rounded-full bg-blue-600" />
          {category.description && (
            <p className="mt-6 max-w-2xl text-gray-600 md:text-lg leading-relaxed">
              {category.description}
            </p>
          )}
        </header>

        {/* Product Grid */}
        <section 
          aria-label={`รายการสินค้าในหมวด ${category.name}`}
          className="relative rounded-xl bg-[#8d8a8a1d]  p-6 shadow-xl shadow-gray-100/50 border border-gray-50 md:p-12"
        >
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10 ">
              {products.map((product) => (
                <article key={product.id}>
                  <Link
                    href={`/categories/${category.slug}/${product.slug}`}
                    className="group flex flex-col    shadow-xl"
                    title={product.name}
                  >
                    <div className="relative aspect-square overflow-hidden   bg-gray-50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-100 ">
                      <Image
                        src={product.image.src}
                        alt={product.image.alt || product.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="mt-3 px-1 text-center">
                      {/* ใช้ h2 สำหรับชื่อสินค้าในหน้าหมวดหมู่เพื่อ SEO */}
                      <h2 className="text-base font-normal md:text-md">
                        {product.name}
                      </h2>
               
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 text-gray-300">📦</div>
              <p className="text-gray-400 italic">ขออภัย ยังไม่มีสินค้าในหมวดหมู่นี้ในขณะนี้</p>
            </div>
          )}
        </section>

        {/* Related Content: เพิ่มมิติความน่าเชื่อถือ */}
        {relatedArticles.length > 0 && (
          <section className="mt-32">
            <div className="mb-12 flex items-end justify-between border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
                  สาระน่ารู้เกี่ยวกับ{category.name}
                </h2>
                <p className="mt-3 text-gray-500">เลือกบรรจุภัณฑ์อย่างไรให้ปัง และเทคนิคการสร้างแบรนด์เครื่องสำอาง</p>
              </div>
              <Link href="/articles" className="hidden text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 md:block">
                อ่านทั้งหมด →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <article 
                  key={article.id} 
                  className="group flex flex-col gap-5 rounded-[2rem] bg-white p-2 transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-gray-100 shadow-sm">
                    {/* Placeholder หรือ Image จริงของบทความ */}
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                       <Image 
                         src="/articles/จุกซอง.jpg" 
                         alt={article.title} 
                         width={400} 
                         height={250} 
                         className="object-cover opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100"
                       />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {article.excerpt}
                    </p>
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="mt-4 inline-block text-xs font-bold uppercase tracking-tighter text-blue-600"
                    >
                      อ่านต่อ
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}