// app/categories/page.tsx

import { getCategories } from "@/app/lib/api/categories";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/ui/Breadcrumb";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "หมวดหมู่บรรจุภัณฑ์เครื่องสำอาง | OEM / ODM",
    description:
      "รวมหมวดหมู่บรรจุภัณฑ์เครื่องสำอางทุกประเภท พร้อมบริการ OEM / ODM ครบวงจร",
  };
}

export default async function CategoriesPage() {
  const locale = "th";
  const categories = await getCategories(locale);

  if (!categories.length) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-24">
        <div className="container mx-auto px-6 text-center">
          <Breadcrumb />
          <p className="mt-16 text-sm text-[#94A3B8]">
            ยังไม่มีหมวดหมู่สินค้าในระบบ
          </p>
        </div>
      </main>
    );
  }

  const seoCategories = categories.filter((c) => c.seoDescription).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative">

      {/* Ambient top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#14B8A611] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-12">
        <Breadcrumb />

        {/* Hero header */}
        <header className="mb-16 mt-14 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#14B8A6]">
            OEM / ODM
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1A2535] md:text-5xl">
            หมวดหมู่บรรจุภัณฑ์เครื่องสำอาง
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-[#5A6A7E]">
            เลือกบรรจุภัณฑ์ให้เหมาะกับแบรนด์ของคุณ พร้อมบริการ OEM / ODM ครบวงจร
          </p>

          {/* Divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#14B8A6]" />
            <div className="h-1 w-1 rounded-full bg-[#14B8A6]" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#14B8A6]" />
          </div>
        </header>

        {/* Category grid */}
        <section aria-label="หมวดหมู่สินค้า">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F1F5F9]">
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#94A3B8]">
                      No Image
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#14B8A611] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Label */}
                <div className="mt-3 px-1">
                  <h2 className="text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5A6A7E]">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Teal underline */}
                <div className="ml-1 mt-2 h-px w-0 rounded-full bg-[#14B8A6] transition-all duration-300 group-hover:w-8" />
              </Link>
            ))}
          </div>
        </section>

        {/* SEO section */}
        {seoCategories.length > 0 && (
          <section
            className="mt-28 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] px-8 py-16 md:px-16"
            aria-label="ข้อมูลเชิงลึก"
          >
            <header className="mb-12 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#14B8A6]">
                Product Knowledge
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#1A2535] md:text-3xl">
                เจาะลึกประเภทบรรจุภัณฑ์
              </h2>

              <p className="mt-2 text-sm text-[#5A6A7E]">
                ข้อมูลเชิงลึกเพื่อช่วยให้คุณเลือกสินค้าได้เหมาะสม
              </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
              {seoCategories.map((cat) => (
                <article
                  key={cat.id}
                  className="group flex gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-shadow hover:shadow-md"
                >
                  {/* Accent dot */}
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#14B8A6]" />

                  <div>
                    <Link href={`/categories/${cat.slug}`}>
                      <h3 className="text-base font-semibold text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                        {cat.seoTitle || cat.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm leading-relaxed text-[#5A6A7E]">
                      {cat.seoDescription}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}