import type { Metadata } from 'next'
import Image from 'next/image'

import Breadcrumb from '@/app/components/ui/Breadcrumb'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import { getCategories } from '@/app/lib/api/categories'

export const metadata: Metadata = {
  title: 'Product Categories | 168 Innovative',
  description:
    'Explore cosmetic packaging categories with OEM and ODM support for production-ready brands.',
}

export default async function CategoriesPage() {
  const locale = 'en'
  const categories = await getCategories(locale)

  if (!categories.length) {
    return (
      <main className="min-h-screen bg-[#FAF7F3] pb-24 pt-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Breadcrumb />
          <div className="mt-10 rounded-[2rem] border border-[#E6DED6] bg-white/80 px-6 py-16 shadow-sm">
            <p className="text-sm text-[#84776D]">
              No product categories available at this time
            </p>
          </div>
        </div>
      </main>
    )
  }

  const seoCategories = categories.filter((category) => category.seoDescription).slice(0, 6)

  return (
    <main className="min-h-screen bg-[#FAF7F3] pb-28 pt-8">
      <div className="mx-auto max-w-7xl px-6">
        <Breadcrumb />

        <header className="mt-6 overflow-hidden rounded-[2.5rem] border border-[#E5DDD5] bg-[linear-gradient(135deg,#fffdf9_0%,#f3ece4_100%)] px-6 py-10 shadow-[0_20px_60px_rgba(26,37,53,0.06)] sm:px-8 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#14B8A6]">
            OEM / ODM
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl leading-tight text-[#1A2535] md:text-5xl">
            Product Categories
            <br />
            for brands that want a cleaner launch path
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D635B] md:text-base">
            Browse cosmetic packaging types and plastic components with OEM / ODM
            support designed to make sourcing and production move faster.
          </p>
        </header>

        <section aria-label="Product Categories" className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <LocalizedLink
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-[1.75rem] border border-[#E7DED6] bg-white p-2 shadow-[0_12px_35px_rgba(26,37,53,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(26,37,53,0.1)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-[#F2ECE5]">
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#A3968C]">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2535]/14 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="px-2 pb-3 pt-4">
                  <h2 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7F736A]">
                      {category.description}
                    </p>
                  )}
                </div>
              </LocalizedLink>
            ))}
          </div>
        </section>

        {seoCategories.length > 0 && (
          <section
            className="mt-20 rounded-[2.25rem] border border-[#E6DED6] bg-white px-6 py-10 shadow-[0_18px_50px_rgba(26,37,53,0.05)] sm:px-8 lg:px-10"
            aria-label="Category insights"
          >
            <header className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#14B8A6]">
                Product Knowledge
              </p>
              <h2 className="mt-3 font-heading text-2xl text-[#1A2535] md:text-3xl">
                Explore high-interest packaging types in detail
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-[1.5rem] border border-[#EEE6DE] bg-[#FCFAF7] p-5 transition-colors hover:border-[#14B8A6]/40"
                >
                  <LocalizedLink href={`/categories/${category.slug}`}>
                    <h3 className="text-base font-semibold text-[#1A2535] transition-colors hover:text-[#14B8A6]">
                      {category.seoTitle || category.name}
                    </h3>
                  </LocalizedLink>
                  <p className="mt-2 text-sm leading-7 text-[#6F655D]">
                    {category.seoDescription}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
