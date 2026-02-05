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
 const articles = await getArticles(locale)

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const products = await getProductsByCategory(category.id, locale)

  return (
    <main className="min-h-screen pt-32 pb-20">
      <Breadcrumb />
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {category.name}
        </h1>

 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map(product => (
    <Link
      key={product.id}
      href={`/categories/${category.slug}/${product.slug}`}
      className="rounded-xl bg-white p-4 shadow hover:shadow-lg transition"
    >
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-4 text-sm font-bold">
        {product.name}
      </h3>
    </Link>
  ))}
</div>


      </div>

      {/* SEO Articles */}
<section className="mt-24 border-t pt-14">
  <h2 className="text-2xl font-bold mb-8">
    บทความที่เกี่ยวข้อง
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {articles.slice(0, 2).map(a => (
      <Link
        key={a.id}
        href={`/articles/${a.slug}`}
        className="block border rounded-xl p-6 hover:shadow transition"
      >
        <h3 className="font-bold">{a.title}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {a.excerpt}
        </p>
      </Link>
    ))}
  </div>
</section>

    </main>
  )
}
