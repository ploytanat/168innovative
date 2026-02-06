import Breadcrumb from '@/app/components/ui/Breadcrumb'
import { getCategoryBySlug } from '@/app/lib/api/categories'
import { getProductBySlug, getRelatedProducts } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    slug: string
    productSlug: string
  }>
}

export default async function ProductDetailENPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale: Locale = 'en'

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const product = await getProductBySlug(category.id, productSlug, locale)
  if (!product) notFound()

  const related = await getRelatedProducts(category.id, product.id, locale)

  return (
    <main className="min-h-screen bg-white pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Breadcrumb />

        {/* Product Hero */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 border">
              <Image
                src={product.image.src}
                alt={product.image.alt || product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
              {category.name}
            </div>

            <h1 className="text-3xl font-extrabold md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-700">
              {[
                'OEM manufacturing supported',
                'Premium-grade materials',
                'Custom size available',
                'Suitable for liquid & cream',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href={`/en/contact?product=${encodeURIComponent(product.name)}`}
                className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-gray-900 px-8 py-4 text-sm font-bold text-white hover:bg-gray-800"
              >
                Request a Quotation
              </Link>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-20 max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold border-b pb-3">Applications</h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-600">
                {[
                  'Cream & serum sachets',
                  'Liquid packaging',
                  'Refill packaging',
                  'Sample sachets',
                ].map((text, i) => (
                  <li key={i}>• {text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold border-b pb-3">
                Technical Specifications
              </h2>
              <table className="mt-5 w-full text-sm">
                <tbody className="divide-y">
                  {[
                    ['Model', product.name],
                    ['Material', 'Industrial Plastic'],
                    ['Production', 'OEM / Bulk Order'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-2.5 font-bold w-1/3">{label}</td>
                      <td className="py-2.5 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 border-t pt-16">
            <h2 className="mb-10 text-xl font-bold">
              You may also like
            </h2>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {related.slice(0, 4).map(item => (
                <Link
                  key={item.id}
                  href={`/en/categories/${category.slug}/${item.slug}`}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="mt-3 text-xs font-bold">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
