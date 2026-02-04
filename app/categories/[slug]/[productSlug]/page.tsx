import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    slug: string
    productSlug: string
  }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale: Locale = 'th'

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const product = await getProductBySlug(
    category.id,
    productSlug,
    locale
  )
  if (!product) notFound()

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* CTA (เผื่อไว้ก่อน) */}
          <div className="mt-10">
            <button className="rounded-xl bg-[#1e3a5f] px-8 py-4 text-white font-semibold hover:opacity-90">
              ติดต่อสอบถามสินค้า
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}
