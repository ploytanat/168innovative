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
      <main className="min-h-screen bg-white">
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
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          eyebrow="OEM / ODM"
          title="Product Categories"
          description="Browse packaging types and plastic components with a cleaner path from sourcing to production."
          breadcrumbs={[{ label: "Product Categories" }]}
        />

        <section aria-label="Product Categories" className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <LocalizedLink
                key={category.id}
                href={`/categories/${category.slug}`}
                prefetch={false}
                className="group overflow-hidden rounded-[1.75rem] border border-[#E7EAF0] bg-white p-2 shadow-[0_12px_35px_rgba(26,37,53,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(26,37,53,0.1)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-[#F1F5F9]">
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#94A3B8]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="px-2 pb-3 pt-4">
                  <h2 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5A6A7E]">
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
            className="mt-20 rounded-[2.25rem] border border-[#E5E7EB] bg-white px-6 py-10 shadow-[0_18px_50px_rgba(26,37,53,0.05)] sm:px-8 lg:px-10"
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
                  className="rounded-[1.5rem] border border-[#EEF2F6] bg-[#FCFDFF] p-5 transition-colors hover:border-[#14B8A6]/40"
                >
                  <LocalizedLink href={`/categories/${category.slug}`} prefetch={false}>
                    <h3 className="text-base font-semibold text-[#1A2535] transition-colors hover:text-[#14B8A6]">
                      {category.seoTitle || category.name}
                    </h3>
                  </LocalizedLink>
                  <p className="mt-2 text-sm leading-7 text-[#5A6A7E]">
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
