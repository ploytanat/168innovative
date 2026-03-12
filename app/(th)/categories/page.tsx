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
                href={`/categories/${category.slug}`}
                prefetch={false}
                className="group overflow-hidden rounded-[1.75rem] border border-[rgba(222,214,205,0.86)] bg-white/88 p-2 shadow-[0_14px_36px_rgba(26,37,53,0.06)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(26,37,53,0.12)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-[linear-gradient(160deg,#f8f1e9,#e6f4f0)]">
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
            className="mt-20 rounded-[2.25rem] border border-[rgba(153,184,178,0.2)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(247,240,233,0.88)_56%,rgba(231,246,242,0.78))] px-6 py-10 shadow-[0_24px_70px_rgba(26,37,53,0.06)] sm:px-8 lg:px-10"
            aria-label="Category insights"
          >
            <header className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
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
                  className="rounded-[1.5rem] border border-[rgba(221,211,201,0.76)] bg-white/84 p-5 shadow-[0_12px_32px_rgba(26,37,53,0.04)] transition-colors hover:border-[#14B8A6]/40"
                >
                  <Link href={`/categories/${category.slug}`} prefetch={false}>
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
