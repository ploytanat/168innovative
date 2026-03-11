import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Script from "next/script"

import CategoryProductsSection from "@/app/components/product/CategoryProductsSection"
import FaqSection from "@/app/components/ui/FaqSection"
import PageIntro from "@/app/components/ui/PageIntro"
import RichTextSection from "@/app/components/ui/RichTextSection"
import { buildMetadata } from "@/app/config/seo"
import { getAllCategorySlugs, getCategoryBySlug } from "@/app/lib/api/categories"
import { getProductsByCategory } from "@/app/lib/api/products"
import { shouldIndexCategory } from "@/app/lib/seo/indexability"
import { buildFaqJsonLd } from "@/app/lib/schema"
import type { Locale } from "@/app/lib/types/content"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

function normalizeText(value?: string) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parsePage(value?: string) {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params
  const currentPage = parsePage((await searchParams).page)
  const category = await getCategoryBySlug(slug, "th")

  if (!category) {
    return { title: "ไม่พบหมวดสินค้า" }
  }

  const path =
    currentPage > 1
      ? `/categories/${slug}?page=${currentPage}`
      : `/categories/${slug}`
  const title =
    currentPage > 1
      ? `${category.seoTitle || category.name} - หน้า ${currentPage}`
      : category.seoTitle || category.name

  const metadata = buildMetadata({
    locale: "th",
    title,
    description:
      category.seoDescription ||
      category.description ||
      `รวมสินค้าในหมวด ${category.name} จาก 168 Innovative สำหรับงานบรรจุภัณฑ์และการผลิต`,
    path,
    keywords: [category.name, "168 Innovative", "หมวดหมู่สินค้า"],
  })

  return {
    ...metadata,
    robots: {
      index: shouldIndexCategory(category, currentPage),
      follow: true,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const locale: Locale = "th"
  const currentPage = parsePage((await searchParams).page)

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, currentPage),
  ])

  if (!category) notFound()
  const faqJsonLd = buildFaqJsonLd(category.faqItems)
  const hasDistinctIntro =
    Boolean(category.introHtml) &&
    normalizeText(category.introHtml) !== normalizeText(category.description)

  return (
    <main className="min-h-screen bg-white">
      {faqJsonLd ? (
        <Script
          id="category-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          title={category.name}
          description={category.description}
          breadcrumbs={[
            { label: "หมวดหมู่สินค้า", href: "/categories" },
            { label: category.name },
          ]}
          actions={
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 rounded-full border border-[#D8E1EA] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#5A6A7E] transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              ดูหมวดสินค้าทั้งหมด
            </Link>
          }
        />

        {hasDistinctIntro ? (
          <RichTextSection
            className="mt-12"
            eyebrow="รายละเอียดหมวดสินค้า"
            title="ข้อมูลเพิ่มเติมในหมวดนี้"
            html={category.introHtml ?? ""}
          />
        ) : null}

        <CategoryProductsSection
          slug={slug}
          locale={locale}
          basePath={`/categories/${slug}`}
          currentPage={currentPage}
          products={result.products}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
        />

        <FaqSection
          className="mt-12"
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          items={category.faqItems}
        />
      </div>
    </main>
  )
}
