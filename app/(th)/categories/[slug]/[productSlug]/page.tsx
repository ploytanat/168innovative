import ProductSummary, { ProductDescription } from "@/app/components/product/ProductSummary"
export const revalidate = 60

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import Script from "next/script"
import {
  ChevronRight,
} from "lucide-react"

import ProductImageGallery from "@/app/components/product/ProductImageGallery"
import { SITE_URL, withSiteUrl } from "@/app/config/site"
import Breadcrumb from "@/app/components/ui/Breadcrumb"
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
import { buildFaqJsonLd } from "@/app/lib/schema"

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
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

export default async function ProductDetailPage({ params }: Props) {
  const { slug, productSlug } = await params
  const locale = "th"

  const [category, product, related] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
    getRelatedProducts(slug, productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/categories/${product.categorySlug}/${productSlug}`)
  }
  if (product.categoryId !== category.id) notFound()
  const hasDistinctContent = hasDistinctText(
    product.contentHtml,
    product.description
  )
  const hasDistinctApplication = hasDistinctText(product.applicationHtml, [
    product.description,
    product.contentHtml,
  ])

  const productUrl = `${SITE_URL}/categories/${slug}/${productSlug}`
  const breadcrumbId = `${productUrl}#breadcrumb`
  const faqPageId = product.faqItems?.length ? `${productUrl}#faq` : undefined
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "หน้าแรก",
        item: SITE_URL,
      },
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



  return (
    <div className="product-detail-page min-h-screen bg-transparent">
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

      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "หมวดหมู่สินค้า", href: "/categories" },
            { label: category.name, href: `/categories/${slug}` },
            { label: product.name },
          ]}
        />

        <div className="product-detail-layout">
          <div className="product-detail-visual">
            <ProductImageGallery
              key={product.id}
              colors={product.colors}
              src={product.image.src}
              alt={product.image.alt}
            />
            <ProductDescription product={product} locale={locale} />


          </div>

          <ProductSummary product={product} locale={locale} />

        </div>

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

<FaqSection
          className="mt-8"
          eyebrow="คำถามที่พบบ่อย"
          title="FAQ"
          items={product.faqItems}
        />

        {related.length > 0 ? (
          <section className="mt-14" aria-label="สินค้าที่เกี่ยวข้อง">
            <div className="mb-10 flex items-end justify-between border-b border-[rgba(222,214,205,0.88)] pb-6">
              <div>
                <h2 className="mt-2 font-heading font-bold text-[var(--color-ink)]">
                  สินค้าที่คุณอาจสนใจ
                </h2>
              </div>

              <Link
                href={`/categories/${slug}`}
                                  className="hidden items-center gap-1.5 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 font-semibold text-slate-600 hover:text-slate-900 md:flex"
              >
                ดูทั้งหมด <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/categories/${slug}/${item.slug}`}
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
                    <h3 className="break-words font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
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
    </div>
  )
}
