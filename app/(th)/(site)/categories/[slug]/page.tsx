import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"

import CategoryProductsSection from "@/app/components/product/CategoryProductsSection"
import RecentlyViewed from "@/app/components/product/RecentlyViewed"
import Breadcrumb from "@/app/components/ui/Breadcrumb"
import FaqSection from "@/app/components/ui/FaqSection"
import RichTextSection from "@/app/components/ui/RichTextSection"
import { buildMetadata } from "@/app/config/seo"
import { SITE_URL } from "@/app/config/site"
import {
  getAllCategorySlugs,
  getCategories,
  getCategoryBySlug,
} from "@/app/lib/api/categories"
import {
  getAllProductsByCategory,
  getProductsByCategory,
} from "@/app/lib/api/products"
import { shouldIndexCategory } from "@/app/lib/seo/indexability"
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildFaqJsonLd,
} from "@/app/lib/schema"
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

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const currentPage = parsePage((await searchParams).page)
  const [category, countResult] = await Promise.all([
    getCategoryBySlug(slug, "th"),
    getAllProductsByCategory(slug, "th"),
  ])

  if (!category) return { title: "ไม่พบหมวดสินค้า" }

  const productCount = countResult.length
  const path =
    currentPage > 1
      ? `/categories/${slug}?page=${currentPage}`
      : `/categories/${slug}`
  const title =
    currentPage > 1
      ? `${category.seoTitle || category.name} - หน้า ${currentPage}`
      : category.seoTitle || category.name

  const description =
    category.seoDescription ||
    (productCount > 0
      ? `${category.name} คุณภาพสูง ${productCount} รายการ MOQ เพียง 100 ชิ้น รับผลิต OEM/ODM ส่งทั่วประเทศ — 168 Innovative`
      : `รวมสินค้าในหมวด ${category.name} จาก 168 Innovative สำหรับงานบรรจุภัณฑ์และการผลิต OEM/ODM`)

  const keywords = [
    category.name,
    `${category.name} OEM`,
    `${category.name} ราคาส่ง`,
    `${category.name} MOQ`,
    "บรรจุภัณฑ์",
    "รับผลิตตามสั่ง",
    "168 Innovative",
  ]

  const metadata = buildMetadata({ locale: "th", title, description, path, keywords })

  return {
    ...metadata,
    robots: { index: shouldIndexCategory(category, currentPage), follow: true },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const locale: Locale = "th"
  const currentPage = parsePage((await searchParams).page)

  const [category, categories, result, allProducts] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getCategories(locale),
    getProductsByCategory(slug, locale, currentPage),
    getAllProductsByCategory(slug, locale),
  ])

  if (!category) notFound()

  const categoryUrl =
    currentPage > 1
      ? `${SITE_URL}/categories/${slug}?page=${currentPage}`
      : `${SITE_URL}/categories/${slug}`

  const faqPageId      = category.faqItems?.length ? `${categoryUrl}#faq` : undefined
  const hasDistinctIntro =
    Boolean(category.introHtml) &&
    normalizeText(category.introHtml) !== normalizeText(category.description)

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "หน้าแรก",       item: SITE_URL },
      { name: "หมวดหมู่สินค้า", item: `${SITE_URL}/categories` },
      { name: category.name,    item: categoryUrl },
    ],
    { id: `${categoryUrl}#breadcrumb` }
  )

  // CollectionPage with ItemList — เพิ่มให้ Google เข้าใจ catalog structure
  const collectionPageJsonLd = buildCollectionPageJsonLd({
    url: categoryUrl,
    name: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
    locale,
    products: allProducts.map((p) => ({
      name: p.name,
      url: `${SITE_URL}/categories/${slug}/${p.slug}`,
      image: p.image?.src ? `${SITE_URL}${p.image.src}` : undefined,
      description: p.description,
    })),
  })

  const faqJsonLd = buildFaqJsonLd(category.faqItems, { pageId: faqPageId })

  return (
    <main className="min-h-screen bg-transparent">
      <Script
        id="category-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="category-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="category-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-8 lg:px-8">
        <div className="mb-7">
          <Breadcrumb
            items={[
              { label: "หมวดหมู่สินค้า", href: "/categories" },
              { label: category.name },
            ]}
          />
        </div>

        <CategoryProductsSection
          slug={slug}
          locale={locale}
          basePath={`/categories/${slug}`}
          currentPage={currentPage}
          category={category}
          categories={categories}
          products={result.products}
          searchProducts={allProducts}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
        />

        <RecentlyViewed locale={locale} />

        <FaqSection
          className="mt-12"
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          items={category.faqItems}
        />

        {hasDistinctIntro && (
          <RichTextSection
            className="mt-12"
            eyebrow="รายละเอียดหมวดสินค้า"
            title="ข้อมูลเพิ่มเติมในหมวดนี้"
            html={category.introHtml ?? ""}
          />
        )}
      </div>
    </main>
  )
}
