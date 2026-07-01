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
import { SITE_URL } from "@/app/config/site"
import { getAllCategorySlugs, getCategoryBySlug } from "@/app/lib/api/categories"
import {
  getAllProductsByCategory,
  getProductsByCategory,
} from "@/app/lib/api/products"
import { shouldIndexCategory } from "@/app/lib/seo/indexability"
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/app/lib/schema"
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

  const [category, result, allProducts] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, currentPage),
    getAllProductsByCategory(slug, locale),
  ])

  if (!category) notFound()
  const resolvedCategory = category
  const categoryUrl =
    currentPage > 1
      ? `${SITE_URL}/categories/${slug}?page=${currentPage}`
      : `${SITE_URL}/categories/${slug}`
  const faqPageId = resolvedCategory.faqItems?.length ? `${categoryUrl}#faq` : undefined
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "หน้าแรก", item: SITE_URL },
      { name: "หมวดหมู่สินค้า", item: `${SITE_URL}/categories` },
      { name: resolvedCategory.name, item: categoryUrl },
    ],
    { id: `${categoryUrl}#breadcrumb` }
  )
  const faqJsonLd = buildFaqJsonLd(resolvedCategory.faqItems, { pageId: faqPageId })
  const hasDistinctIntro =
    Boolean(resolvedCategory.introHtml) &&
    normalizeText(resolvedCategory.introHtml) !== normalizeText(resolvedCategory.description)
  const categoryIntroSection = hasDistinctIntro ? (
    <RichTextSection
      className="mt-12"
      eyebrow="รายละเอียดหมวดสินค้า"
      title="ข้อมูลเพิ่มเติมในหมวดนี้"
      html={resolvedCategory.introHtml ?? ""}
    />
  ) : null

  return (
    <main className="min-h-screen bg-transparent">
      {faqJsonLd ? (
        <Script
          id="category-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <Script
        id="category-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-[1200px] px-5 pb-16">
        <PageIntro
          title={resolvedCategory.name}
          description={resolvedCategory.description}
          breadcrumbs={[
            { label: "หมวดหมู่สินค้า", href: "/categories" },
            { label: resolvedCategory.name },
          ]}
          actions={
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded border border-[#ececec] px-4 py-2 text-[13px] font-semibold text-[#4a7a1e] transition-colors hover:border-[#4a7a1e] hover:bg-[#4a7a1e] hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              ดูหมวดสินค้าทั้งหมด
            </Link>
          }
        />

        <CategoryProductsSection
          slug={slug}
          locale={locale}
          basePath={`/categories/${slug}`}
          currentPage={currentPage}
          products={result.products}
          searchProducts={allProducts}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
        />

        <FaqSection
          className="mt-12"
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          items={resolvedCategory.faqItems}
        />
        {categoryIntroSection}
      </div>
    </main>
  )
}
