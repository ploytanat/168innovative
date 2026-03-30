export const revalidate = 60

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import Script from "next/script"
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

function buildProductDescription(
  productName: string,
  categoryName?: string,
  description?: string
) {
  const summary = description?.trim() || `สินค้า ${productName} จาก 168 Innovative`
  const categoryText = categoryName ? ` ในหมวด ${categoryName}` : ""
  return `${productName}${categoryText} จาก 168 Innovative Co., Ltd. ${summary}`.slice(
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
    getCategoryBySlug(slug, "th"),
    getProductBySlug(productSlug, "th"),
  ])

  if (!product) {
    return { title: "ไม่พบสินค้า" }
  }

  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/categories/${product.categorySlug}/${productSlug}`)
  }

  if (!category || product.categoryId !== category.id) {
    return {
      title: product.name,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const canonicalPath = `/categories/${slug}/${productSlug}`
  const description = buildProductDescription(
    product.name,
    category?.name,
    product.description
  )
  const keywords = [
    product.name,
    `${product.name} OEM`,
    `${product.name} โรงงาน`,
    category?.name,
    "168 Innovative",
    "168 Innovative Co., Ltd.",
    "บรรจุภัณฑ์เครื่องสำอาง",
  ].filter(Boolean) as string[]
  const shouldIndex = shouldIndexProduct(product)

  return {
    title: product.name,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        th: canonicalPath,
        en: `/en/categories/${slug}/${productSlug}`,
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
  const locale = "th"
  const selectedVariantSlug = (await searchParams)?.v

  const [category, product] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/categories/${product.categorySlug}/${productSlug}`)
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
  const supportCopy = buildProductSupportCopy(product, category, "th")

  const productUrl = `${SITE_URL}/categories/${slug}/${productSlug}`
  const faqPageId = product.faqItems?.length ? `${productUrl}#faq` : undefined
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "หมวดหมู่สินค้า",
        item: `${SITE_URL}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/categories/${slug}`,
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

  const trustBadges = [
    { icon: Factory, text: "มาตรฐานโรงงาน" },
    { icon: ShieldCheck, text: "Food Grade" },
    { icon: Package, text: "บรรจุกันกระแทก" },
    { icon: Truck, text: "จัดส่งทั่วไทย" },
  ]

  return (
    <main className="min-h-screen bg-transparent">
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <Script
          id="product-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/categories/${slug}`}
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
                href={`/contact?product=${encodeURIComponent(selectedVariant?.name || product.name)}`}
                className="btn-primary-soft group inline-flex items-center justify-center gap-2 rounded-[1rem] px-8 py-4 text-sm font-medium tracking-wide active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                ขอใบเสนอราคาออนไลน์
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
            eyebrow="รายละเอียดเชิงลึก"
            title="ข้อมูลสินค้า"
            html={product.contentHtml}
          />
        ) : null}

        {product.applicationHtml && hasDistinctApplication ? (
          <RichTextSection
            className="mt-8"
            eyebrow="การใช้งาน"
            title="เหมาะกับการใช้งานแบบใด"
            html={product.applicationHtml}
          />
        ) : null}

        <section className="deck-card-soft mt-8 rounded-[1.1rem] px-6 py-8">
          <p className="eyebrow-label text-xs">{supportCopy.eyebrow}</p>
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
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          items={product.faqItems}
        />

        {related.length > 0 ? (
          <section className="mt-24" aria-label="สินค้าที่เกี่ยวข้อง">
            <div className="mb-10 flex items-end justify-between border-b border-[rgba(222,214,205,0.88)] pb-6">
              <div>
                <p className="eyebrow-label text-xs">Discover More</p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--color-ink)]">
                  สินค้าที่คุณอาจสนใจ
                </h2>
              </div>

              <Link
                href={`/categories/${slug}`}
                prefetch={false}
                className="hidden items-center gap-1.5 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 md:flex"
              >
                ดูทั้งหมด <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
                  prefetch={false}
                  className="deck-card group overflow-hidden rounded-[1rem] p-2"
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

                  <div className="mt-3 px-2 pb-3 pt-1">
                    <h3 className="break-words text-sm font-medium leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {item.name}
                    </h3>
                    <div className="mt-1.5 h-px w-0 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-8" />
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
