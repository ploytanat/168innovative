import ProductSummary, { ProductDescription } from "@/app/components/product/ProductSummary"
export const revalidate = 3600

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  ChevronRight,
} from 'lucide-react'

import ProductImageGallery from '@/app/components/product/ProductImageGallery'
import { SITE_URL, withSiteUrl } from '@/app/config/site'
import Breadcrumb from '@/app/components/ui/Breadcrumb'
import FaqSection from '@/app/components/ui/FaqSection'
import RichTextSection from '@/app/components/ui/RichTextSection'
import { getCategoryBySlug } from '@/app/lib/api/categories'
import {
  getAllProductsForSitemap,
  getProductBySlug,
  getRelatedProducts,
} from '@/app/lib/api/products'
import {
  hasDistinctText,
  shouldIndexProduct,
} from '@/app/lib/seo/indexability'
import { buildFaqJsonLd } from '@/app/lib/schema'

interface Props {
  params: Promise<{ slug: string; productSlug: string }>
}



function buildProductDescription(
  productName: string,
  categoryName?: string,
  description?: string
) {
  const summary = description?.trim() || `${productName} from 168 Innovative`
  const categoryText = categoryName ? ` in ${categoryName}` : ''
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
    getCategoryBySlug(slug, 'en'),
    getProductBySlug(productSlug, 'en'),
  ])

  if (!product) {
    return { title: 'Product not found' }
  }

  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/en/categories/${product.categorySlug}/${productSlug}`)
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
    '168 Innovative',
    '168 Innovative Co., Ltd.',
    'cosmetic packaging',
  ].filter(Boolean) as string[]
  const shouldIndex = shouldIndexProduct(product)

  return {
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
      type: 'website',
      url: `${SITE_URL}${canonicalPath}`,
      title: `${product.name} | 168 Innovative`,
      description,
      siteName: '168 Innovative',
      images: [
        {
          url: withSiteUrl(product.image.src),
          alt: product.image.alt || product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
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
  const locale = 'en'

  const [category, product, related] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductBySlug(productSlug, locale),
    getRelatedProducts(slug, productSlug, locale),
  ])

  if (!category || !product) notFound()
  if (product.categorySlug && product.categorySlug !== slug) {
    permanentRedirect(`/en/categories/${product.categorySlug}/${productSlug}`)
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

  const productUrl = `${SITE_URL}/en/categories/${slug}/${productSlug}`
  const breadcrumbId = `${productUrl}#breadcrumb`
  const faqPageId = product.faqItems?.length ? `${productUrl}#faq` : undefined
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/en`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${SITE_URL}/en/categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${SITE_URL}/en/categories/${slug}`,
      },
      {
        '@type': 'ListItem',
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
        id="breadcrumb-jsonld-en"
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
            { label: "Categories", href: "/en/categories" },
            { label: category.name, href: `/en/categories/${slug}` },
            { label: product.name },
          ]}
        />

        <section className="product-detail-layout">
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

        </section>

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

<FaqSection
          className="mt-8"
          eyebrow="Frequently Asked Questions"
          title="FAQ"
          items={product.faqItems}
        />

        {related.length > 0 && (
          <section className="mt-14" aria-label="Related Products">
            <div className="mb-10 flex items-end justify-between border-b border-[rgba(222,214,205,0.88)] pb-6">
              <div>
                <h2 className="mt-2 font-heading font-semibold text-[#1A2535]">
                  You May Also Like
                </h2>
              </div>

              <Link
                href={`/en/categories/${slug}`}
                                  className="hidden items-center gap-1.5 rounded-full border border-[rgba(211,217,225,0.92)] bg-white px-4 py-2.5 font-semibold text-[#637284] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:flex"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/en/categories/${slug}/${item.slug}`}
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
                    <h3 className="line-clamp-2 font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                      {item.name}
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#D8E1EA] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--color-accent)]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
