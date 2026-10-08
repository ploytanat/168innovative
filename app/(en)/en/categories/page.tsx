import type { Metadata } from "next"
import Image from "next/image"

import PageIntro from "@/app/components/ui/PageIntro"
import LocalizedLink from "@/app/components/ui/LocalizedLink"
import { buildMetadata } from "@/app/config/seo"
import { getCategories } from "@/app/lib/api/categories"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Product Categories",
  description:
    "Explore cosmetic packaging categories and plastic components with OEM and ODM support for sourcing, sampling, and production.",
  path: "/categories",
  keywords: ["product categories", "cosmetic packaging", "OEM / ODM packaging"],
})

export default async function CategoriesPage() {
  const locale = "en"
  const categories = await getCategories(locale)
  const seoCategories = categories.filter((category) => category.seoDescription).slice(0, 6)

  if (!categories.length) {
    return (
      <div className="catalog-page min-h-screen bg-transparent">
        <div className="mx-auto max-w-[1200px] px-5 pb-16">
          <PageIntro
            eyebrow="OEM / ODM"
            title="Product Categories"
            description="No product categories available at this time."
            breadcrumbs={[{ label: "Product Categories" }]}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="catalog-page min-h-screen bg-transparent">
      <div className="mx-auto max-w-[1200px] px-5 pb-16">
        <PageIntro
          eyebrow="OEM / ODM"
          title="Product Categories"
          description="Browse packaging types and plastic components with a cleaner path from sourcing to production."
          breadcrumbs={[{ label: "Product Categories" }]}
        />

        <section aria-label="Product Categories" className="mt-10">
          <div className="catalog-category-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <LocalizedLink
                key={category.id}
                href={`/categories/${category.slug}`}
                prefetch={false}
                className="catalog-category-card group"
              >
                <div className="relative aspect-square overflow-hidden rounded-[0.85rem] bg-[linear-gradient(160deg,#eef4fb,#f5f7fa)]">
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center type-meta text-[#9B9085]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="px-2 pb-3 pt-4">
                  <h2 className="font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                    {category.name}
                  </h2>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </section>

        {seoCategories.length > 0 && (
          <section
            className="mt-16 border-t border-[rgba(211,217,225,0.96)] pt-6"
            aria-label="Category insights"
          >
            <header className="mb-10">
              <p className="eyebrow-label type-meta">
                Product Knowledge
              </p>
              <h2 className="mt-3 font-heading text-[var(--color-ink)]">
                Explore high-interest packaging types in detail
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="deck-card rounded-[1rem] p-5 transition-colors hover:border-[rgba(34,74,107,0.26)]"
                >
                  <LocalizedLink href={`/categories/${category.slug}`} prefetch={false}>
                    <h3 className="font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                      {category.seoTitle || category.name}
                    </h3>
                  </LocalizedLink>
                  <p className="mt-2 text-[var(--color-ink-soft)]">
                    {category.seoDescription}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
