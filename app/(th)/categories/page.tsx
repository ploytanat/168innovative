import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import PageIntro from "@/app/components/ui/PageIntro"
import { buildMetadata } from "@/app/config/seo"
import { getCategories } from "@/app/lib/api/categories"

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
      <div className="catalog-page min-h-screen bg-transparent">
        <div className="mx-auto max-w-[1200px] px-5 pb-16">
          <PageIntro
            eyebrow="OEM / ODM"
            title="หมวดหมู่สินค้า"
            description="ยังไม่มีหมวดหมู่สินค้าในขณะนี้"
            breadcrumbs={[{ label: "หมวดหมู่สินค้า" }]}
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
          title="หมวดหมู่สินค้า"
          description="เลือกหมวดสินค้าที่เหมาะกับแบรนด์ของคุณ พร้อมข้อมูลเบื้องต้นสำหรับการสั่งผลิตและการเลือกบรรจุภัณฑ์"
          breadcrumbs={[{ label: "หมวดหมู่สินค้า" }]}
        />

        <section aria-label="หมวดหมู่สินค้า" className="mt-10">
          <div className="catalog-category-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
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
              <p className="eyebrow-label type-meta">
                Product Knowledge
              </p>
              <h2 className="mt-3 font-heading text-[var(--color-ink)]">
                เจาะลึกหมวดสินค้าที่มีการค้นหาสูง
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="deck-card rounded-[1rem] p-5 transition-colors hover:border-[rgba(34,74,107,0.26)]"
                >
                  <Link href={`/categories/${category.slug}`} prefetch={false}>
                    <h3 className="font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
                      {category.seoTitle || category.name}
                    </h3>
                  </Link>
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
