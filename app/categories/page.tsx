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
      <main className="min-h-screen bg-white">
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
    <main className="min-h-screen bg-white">
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
              </Link>
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
                เจาะลึกหมวดสินค้าที่มีการค้นหาสูง
              </h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              {seoCategories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-[1.5rem] border border-[#EEF2F6] bg-[#FCFDFF] p-5 transition-colors hover:border-[#14B8A6]/40"
                >
                  <Link href={`/categories/${category.slug}`}>
                    <h3 className="text-base font-semibold text-[#1A2535] transition-colors hover:text-[#14B8A6]">
                      {category.seoTitle || category.name}
                    </h3>
                  </Link>
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
