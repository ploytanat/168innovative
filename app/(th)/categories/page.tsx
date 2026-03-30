import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getCategories } from "@/app/lib/api/categories"

/** Maps WordPress category slugs that already have B2B catalog data.
 *  Clicking these will go to /products pre-filtered instead of /categories/[slug]. */
const CATALOG_CATEGORY_MAP: Record<string, string> = {
  'spout': 'Tube Stoppers',
  'lipstick-packaging': 'Lip Gloss Tubes',
}

function getCategoryHref(slug: string): string {
  const catalogCategory = CATALOG_CATEGORY_MAP[slug]
  if (catalogCategory) {
    return `/products?category=${encodeURIComponent(catalogCategory)}`
  }
  return `/categories/${slug}`
}

export const metadata: Metadata = buildMetadata({
  locale: "th",
  title: "หมวดหมู่สินค้า",
  description:
    "รวมหมวดหมู่บรรจุภัณฑ์เครื่องสำอางและชิ้นส่วนพลาสติกสำหรับงาน OEM / ODM เพื่อให้ค้นหาสินค้าที่เหมาะกับแบรนด์ได้ง่ายขึ้น",
  path: "/categories",
  keywords: ["หมวดหมู่สินค้า", "บรรจุภัณฑ์เครื่องสำอาง", "OEM / ODM"],
})

export default async function CategoriesPage() {
  const locale = "th"
  const categories = await getCategories(locale)
  const seoCategories = categories.filter((c) => c.seoDescription).slice(0, 6)

  if (!categories.length) {
    return (
      <main className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <PageIntro
            eyebrow="OEM / ODM"
            title="หมวดหมู่สินค้า"
            description="ยังไม่มีหมวดหมู่สินค้าในขณะนี้"
            breadcrumbs={[{ label: "หมวดหมู่สินค้า" }]}
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
          title="หมวดหมู่สินค้า"
          description="เลือกหมวดสินค้าที่เหมาะกับแบรนด์ของคุณ พร้อมข้อมูลเบื้องต้นสำหรับการสั่งผลิตและการเลือกบรรจุภัณฑ์"
          breadcrumbs={[{ label: "หมวดหมู่สินค้า" }]}
        />

        <section aria-label="หมวดหมู่สินค้า" className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={getCategoryHref(category.slug)}
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
              </Link>
            ))}
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
                เจาะลึกหมวดสินค้าที่มีการค้นหาสูง
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="deck-card rounded-[1rem] p-5 transition-colors hover:border-[rgba(34,74,107,0.26)]"
                >
                  <Link href={getCategoryHref(category.slug)} prefetch={false}>
                    <h3 className="text-base font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                      {category.seoTitle || category.name}
                    </h3>
                  </Link>
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
