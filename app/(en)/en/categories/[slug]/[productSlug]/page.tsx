export const revalidate = 3600

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { notFound, permanentRedirect } from "next/navigation"
import { ChevronRight, Factory, Package, Send, ShieldCheck, Truck } from "lucide-react"

import CatalogDetailGallery from "@/app/components/product/CatalogDetailGallery"
import CatalogDetailSpecs from "@/app/components/product/CatalogDetailSpecs"
import ProductVariantSelector from "@/app/components/product/ProductVariantSelector"
import { SITE_URL, withSiteUrl } from "@/app/config/site"
import FaqSection from "@/app/components/ui/FaqSection"
import RichTextSection from "@/app/components/ui/RichTextSection"
import { getCategoryBySlug } from "@/app/lib/api/categories"
import {
  getAllProductsForSitemap,
  getProductBySlug,
  getRelatedProducts,
} from "@/app/lib/api/products"
import {
  hasDistinctText,
  shouldIndexProduct,
} from "@/app/lib/seo/indexability"
import { buildProductSupportCopy } from "@/app/lib/seo/product-support-copy"
import { buildFaqJsonLd } from "@/app/lib/schema"

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
  searchParams?: Promise<{ v?: string }>
}

const trustBadges = [
  { icon: Factory, text: "Factory Standard" },
  { icon: ShieldCheck, text: "Food Grade Material" },
  { icon: Package, text: "Secure Packaging" },
  { icon: Truck, text: "Nationwide Shipping" },
]

function buildProductDescription(
  productName: string,
  categoryName?: string,
  description?: string
) {
  const summary = description?.trim() || `${productName} from 168 Innovative`
  const categoryText = categoryName ? ` in ${categoryName}` : ""
  return `${productName}${categoryText} from 168 Innovative Co., Ltd. ${summary}`.slice(
    0,
    160
  )
}

export async function generateStaticParams() {
  const products = await getAllProductsForSitemap()

  return products.map((product) => ({
    slug: product.categorySlug,
    productSlug: product.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug, slug } = await params
  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, "en"),
    getProductBySlug(productSlug, "en"),
  ])

  if (!product) {
    return {
      metadataBase: new URL(SITE_URL),
      title: "Product not found",
    }
  }

  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/en/categories/${product.categorySlug}/${productSlug}`)
  }

  if (!category || product.categoryId !== category.id) {
    return {
      metadataBase: new URL(SITE_URL),
      title: product.name,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const canonicalPath = `/en/categories/${slug}/${productSlug}`
  const description = buildProductDescription(
    product.name,
    category?.name,
    product.description
  )
  const keywords = [
    product.name,
    `${product.name} OEM`,
    `${product.name} supplier`,
    `${product.name} manufacturer`,
    category?.name,
    "168 Innovative",
    "168 Innovative Co., Ltd.",
    "cosmetic packaging",
  ].filter(Boolean) as string[]
  const shouldIndex = shouldIndexProduct(product)

  return {
    metadataBase: new URL(SITE_URL),
    title: product.name,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: canonicalPath,
        th: `/categories/${slug}/${productSlug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonicalPath}`,
      title: `${product.name} | 168 Innovative`,
      description,
      siteName: "168 Innovative",
      images: [
        {
          url: withSiteUrl(product.image.src),
          alt: product.image.alt || product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | 168 Innovative`,
      description,
      images: [withSiteUrl(product.image.src)],
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
  }
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const { slug, productSlug } = await params
  const locale = "en"
  const selectedVariantSlug = (await searchParams)?.v

  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/en/categories/${product.categorySlug}/${productSlug}`)
  }
  if (product.categoryId !== category.id) notFound()

  const selectedVariant =
    product.variants.find((variant) => variant.slug === selectedVariantSlug) ??
    product.variants.find((variant) => variant.slug === product.defaultVariantSlug) ??
    product.variants[0]
  const activeSpecs = selectedVariant?.specs ?? product.specs
  const activeGallery = selectedVariant?.gallery ?? product.gallery
  const activeDescription = selectedVariant?.description || product.description
  const related = await getRelatedProducts(slug, productSlug, locale)
  const hasDistinctContent = hasDistinctText(product.contentHtml, product.description)
  const hasDistinctApplication = hasDistinctText(product.applicationHtml, [
    product.description,
    product.contentHtml,
  ])
  const supportCopy = buildProductSupportCopy(product, category, "en")

  const productUrl = `${SITE_URL}/en/categories/${slug}/${productSlug}`
  const faqPageId = product.faqItems?.length ? `${productUrl}#faq` : undefined
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${SITE_URL}/en/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/en/categories/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  }
  const faqJsonLd = buildFaqJsonLd(product.faqItems, { pageId: faqPageId })

  return (
    <main className="min-h-screen bg-transparent">
      <Script
        id="breadcrumb-jsonld-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <Script
          id="product-faq-jsonld-en"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/en/categories/${slug}`}
            className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            Back to Category
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <CatalogDetailGallery images={activeGallery} name={product.name} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              {category.name}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {product.name}
            </h1>

            <div className="mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              SKU: {selectedVariant?.sku ?? product.sku ?? product.slug}
            </div>

            <ProductVariantSelector
              categorySlug={slug}
              productSlug={productSlug}
              selectedVariantSlug={selectedVariant?.slug}
              variants={product.variants}
              locale={locale}
            />

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-semibold text-slate-950">Description</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {activeDescription}
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href={`/en/contact?product=${encodeURIComponent(selectedVariant?.name || product.name)}`}
                className="btn-primary-soft group inline-flex items-center justify-center gap-2 rounded-[1rem] px-8 py-4 text-sm font-medium tracking-wide active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Request a Quote
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 rounded-[0.95rem] border border-[rgba(211,217,225,0.92)] bg-white p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={1.5} />
                  <span className="break-words text-xs text-slate-600">{text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {activeSpecs.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-semibold text-slate-950">
              Specifications
            </h2>
            <CatalogDetailSpecs specs={activeSpecs} />
          </section>
        ) : null}

        {product.contentHtml && hasDistinctContent ? (
          <RichTextSection
            className="mt-16"
            eyebrow="Deep Detail"
            title="Product Overview"
            html={product.contentHtml}
          />
        ) : null}

        {product.applicationHtml && hasDistinctApplication ? (
          <RichTextSection
            className="mt-8"
            eyebrow="Applications"
            title="Recommended Applications"
            html={product.applicationHtml}
          />
        ) : null}

        <section className="deck-card-soft mt-8 rounded-[1.1rem] px-6 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {supportCopy.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {supportCopy.title}
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            {supportCopy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <FaqSection
          className="mt-8"
          eyebrow="Frequently Asked Questions"
          title="FAQ"
          items={product.faqItems}
        />

        {related.length > 0 ? (
          <section className="mt-24" aria-label="Related Products">
            <div className="mb-10 flex items-end justify-between border-b border-[rgba(222,214,205,0.88)] pb-6">
              <div>
                <p className="eyebrow-label text-[11px]">Discover More</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-[#1A2535] md:text-3xl">
                  You May Also Like
                </h2>
              </div>

              <Link
                href={`/en/categories/${slug}`}
                prefetch={false}
                className="hidden items-center gap-1.5 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 text-sm font-semibold text-[#637284] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:flex"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/en/categories/${slug}/${item.slug}`}
                  prefetch={false}
                  className="deck-card group overflow-hidden rounded-[1rem] p-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(32,36,43,0.06)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[0.9rem] bg-[linear-gradient(160deg,#eef2f6,#e7edf4)]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-2 pb-3 pt-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                      {item.name}
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#D8E1EA] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--color-accent)]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
