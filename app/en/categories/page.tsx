// app/en/categories/page.tsx
import { getCategories } from '@/app/lib/api/categories'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import type { Metadata } from 'next'
import BackgroundBlobs from '@/app/components/ui/BackgroundBlobs'

export const metadata: Metadata = {
  title: 'All Categories | Cosmetic Packaging',
  description:
    'Browse our complete range of high-quality cosmetic packaging categories for brands and OEM factories.',
}

export default async function AllCategoriesENPage() {
  const locale = 'en'
  const categories = await getCategories(locale)

  if (!categories || categories.length === 0) {
    return (
      <main className="relative min-h-screen bg-gray-50 pt-32 pb-20">
        <BackgroundBlobs />
        <div className="container relative mx-auto px-4 text-center">
          <Breadcrumb />
          <div className="mt-20 py-20 rounded-3xl bg-white/50 backdrop-blur-sm border border-white shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              No Categories Found
            </h1>
            <p className="mt-4 text-gray-500 text-lg">
              There are currently no product categories available.
            </p>
            <Link href="/en" className="mt-8 inline-block text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const seoCategories = categories.filter(c => c.seoDescription).slice(0, 4)

  return (
    <main className="relative min-h-screen bg-[#F8F9FA] pb-24 pt-24 md:pt-32">
      <BackgroundBlobs />

      <div className="container relative mx-auto px-4 lg:px-8">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-12 mt-8 text-center md:mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Categories
          </h1>
          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-gray-900" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl">
            Explore our carefully curated cosmetic packaging categories for every type of brand.
          </p>
        </header>

        {/* Grid */}
        <section aria-label="Product Categories Listing">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/en/categories/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  {category.image?.src && (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>

                <div className="flex flex-grow flex-col items-center p-5 text-center md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Explore More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Section */}
        {seoCategories.length > 0 && (
          <section className="mt-32 rounded-[3rem] bg-white px-8 py-16 shadow-sm border border-gray-100 md:px-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-6 text-2xl font-bold text-center">
                Complete Cosmetic Packaging Solutions
              </h2>

              <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
                {seoCategories.map(cat => (
                  <article key={cat.id}>
                    <h3 className="font-bold">{cat.seoTitle || cat.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {cat.seoDescription}
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
