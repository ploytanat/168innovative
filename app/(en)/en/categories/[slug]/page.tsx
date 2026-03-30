import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"

import CategoryProductsSection from "@/app/components/product/CategoryProductsSection"
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
  const category = await getCategoryBySlug(slug, "en")

  if (!category) {
    return { title: "Category not found" }
  }

  const path =
    currentPage > 1
      ? `/categories/${slug}?page=${currentPage}`
      : `/categories/${slug}`
  const title =
    currentPage > 1
      ? `${category.seoTitle || category.name} - Page ${currentPage}`
      : category.seoTitle || category.name

  const metadata = buildMetadata({
    locale: "en",
    title,
    description:
      category.seoDescription ||
      category.description ||
      `Products in the ${category.name} category from 168 Innovative.`,
    path,
    keywords: [category.name, "168 Innovative", "product category"],
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
  const locale: Locale = "en"
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
      ? `${SITE_URL}/en/categories/${slug}?page=${currentPage}`
      : `${SITE_URL}/en/categories/${slug}`
  const faqPageId = category.faqItems?.length ? `${categoryUrl}#faq` : undefined
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "Home", item: `${SITE_URL}/en` },
      { name: "Categories", item: `${SITE_URL}/en/categories` },
      { name: category.name, item: categoryUrl },
    ],
    { id: `${categoryUrl}#breadcrumb` }
  )
  const faqJsonLd = buildFaqJsonLd(category.faqItems, { pageId: faqPageId })
  const hasDistinctIntro =
    Boolean(category.introHtml) &&
    normalizeText(category.introHtml) !== normalizeText(category.description)

  return (
    <main className="min-h-screen bg-transparent">
      {faqJsonLd ? (
        <Script
          id="category-faq-jsonld-en"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <Script
        id="category-breadcrumb-jsonld-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-8 lg:px-8">
        <CategoryProductsSection
          slug={slug}
          locale={locale}
          basePath={`/en/categories/${slug}`}
          currentPage={currentPage}
          category={category}
          categories={categories}
          products={result.products}
          searchProducts={allProducts}
          totalPages={result.totalPages}
          totalCount={result.totalCount}
        />

        <FaqSection
          className="mt-12"
          eyebrow="Frequently Asked Questions"
          title="FAQ"
          items={category.faqItems}
        />

        {hasDistinctIntro ? (
          <RichTextSection
            className="mt-12"
            eyebrow="Category Detail"
            title="Category Overview"
            html={category.introHtml ?? ""}
          />
        ) : null}
      </div>
    </main>
  )
}
