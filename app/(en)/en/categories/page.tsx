import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import PageIntro from "@/app/components/ui/PageIntro"
import LocalizedLink from "@/app/components/ui/LocalizedLink"
import { buildMetadata } from "@/app/config/seo"
import { getCategories } from "@/app/lib/api/categories"
import { loadWithFallback } from "@/app/lib/api/load-with-fallback"

function getCategoryLink(slug: string): { href: string; toCatalog: boolean } {
  return { href: `/categories/${slug}`, toCatalog: false }
}

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
  const categories = await loadWithFallback(
    getCategories(locale),
    [],
    `categories page (${locale})`
  )
  const seoCategories = categories.filter((category) => category.seoDescription).slice(0, 6)

  if (!categories.length) {
    return (
      <main className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <PageIntro
            eyebrow="OEM / ODM"
            title="Product Categories"
            description="No product categories available at this time."
            breadcrumbs={[{ label: "Product Categories" }]}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          eyebrow="OEM / ODM"
          title="Product Categories"
          description="Browse packaging types and plastic components with a cleaner path from sourcing to production."
          breadcrumbs={[{ label: "Product Categories" }]}
        />

        <section aria-label="Product Categories" className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => {
              const { href, toCatalog } = getCategoryLink(category.slug)
              const CardLink = toCatalog ? Link : LocalizedLink
              return (
                <CardLink
                  key={category.id}
                  href={href}
                  prefetch={false}
                  className="group overflow-hidden rounded-[1rem] border border-[rgba(205,218,235,0.86)] bg-white p-2 shadow-[0_10px_24px_rgba(26,37,53,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(26,37,53,0.1)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[0.85rem] bg-[linear-gradient(160deg,#eef4fb,#f5f7fa)]">
                    {category.image?.src ? (
                      <Image
                        src={category.image.src}
                        alt={category.image.alt || category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#9B9085]">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="px-2 pb-3 pt-4">
                    <h2 className="text-sm font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                        {category.description}
                      </p>
                    )}
                  </div>
                </CardLink>
              )
            })}
          </div>
        </section>

        {seoCategories.length > 0 && (
          <section
            className="mt-16 border-t border-[rgba(211,217,225,0.96)] pt-6"
            aria-label="Category insights"
          >
            <header className="mb-10">
              <p className="eyebrow-label text-[11px]">
                Product Knowledge
              </p>
              <h2 className="mt-3 font-heading text-2xl text-[var(--color-ink)] md:text-3xl">
                Explore high-interest packaging types in detail
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="deck-card rounded-[1rem] p-5 transition-colors hover:border-[rgba(34,74,107,0.26)]"
                >
                  <LocalizedLink href={getCategoryLink(category.slug).href} prefetch={false}>
                    <h3 className="text-base font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                      {category.seoTitle || category.name}
                    </h3>
                  </LocalizedLink>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
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
