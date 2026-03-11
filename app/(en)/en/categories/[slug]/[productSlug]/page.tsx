export const revalidate = 3600

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Factory,
  Package,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import ProductImageGallery from '@/app/components/product/ProductImageGallery'
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

const SITE_URL = 'https://168innovative.co.th'

const TRUST_BADGES = [
  { icon: Factory, text: 'Factory Standard' },
  { icon: ShieldCheck, text: 'Food Grade Material' },
  { icon: Package, text: 'Secure Packaging' },
  { icon: Truck, text: 'Nationwide Shipping' },
]

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

  const canonicalPath = `/en/categories/${slug}/${productSlug}`
  const description = buildProductDescription(
    product.name,
    category?.name,
    product.description
  )
  const keywords = [
    product.name,
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
          url: product.image.src,
          alt: product.image.alt || product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | 168 Innovative`,
      description,
      images: [product.image.src],
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
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    url: productUrl,
    mainEntityOfPage: productUrl,
    name: product.name,
    image: [`${SITE_URL}${product.image.src}`],
    description: product.description,
    sku: product.slug,
    category: category.name,
    brand: { '@type': 'Brand', name: '168 Innovative' },
    manufacturer: { '@type': 'Organization', name: '168 Innovative Co., Ltd.' },
    additionalProperty: product.specs.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    })),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'THB',
      url: productUrl,
    },
  }
  const faqJsonLd = buildFaqJsonLd(product.faqItems)

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Script
        id="product-jsonld-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/en/categories" },
            { label: category.name, href: `/en/categories/${slug}` },
            { label: product.name },
          ]}
        />

        <section className="mt-6 grid grid-cols-1 overflow-hidden rounded-[2rem] border border-[#DEE5EC] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:grid-cols-2">
          <div className="bg-[#F3F6F9] p-8 lg:p-12">
            <Link
              href={`/en/categories/${slug}`}
              className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-[#D7E0E8] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#687788] transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {category.name}
            </Link>

            <ProductImageGallery
              src={product.image.src}
              alt={product.image.alt}
            />

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#D8E1EA]" />
              <span className="rounded-full border border-[#D8E1EA] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#728092]">
                {product.slug}
              </span>
              <div className="h-px flex-1 bg-[#D8E1EA]" />
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-[#E3EAF1] p-8 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6]">
              Product Detail
            </p>

            <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-[#1A2535] md:text-4xl lg:text-[2.55rem]">
              {product.name}
            </h1>

            <div className="my-6 flex items-center gap-2.5">
              <div className="h-[3px] w-10 rounded-full bg-[#14B8A6]" />
              <div className="h-[3px] w-4 rounded-full bg-[#B9EAE5]" />
            </div>

            <p className="text-sm leading-7 text-[#556476] md:text-[15px]">
              {product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7E8C9B]">
                  Specifications
                </p>

                <div className="overflow-hidden rounded-[1.4rem] border border-[#E3EAF1] bg-[#FAFCFD]">
                  {product.specs.map((spec, index) => (
                    <div
                      key={index}
                      className={`grid gap-2 px-5 py-4 text-sm sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center ${
                        index !== product.specs.length - 1
                          ? 'border-b border-[#ECF1F5]'
                          : ''
                      }`}
                    >
                      <div className="text-[#7B8897]">{spec.label}</div>
                      <div className="font-semibold text-[#1A2535] sm:text-right">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/en/contact?product=${encodeURIComponent(product.name)}`}
                className="group inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-[#1A2535] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#14B8A6] active:scale-[0.98]"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Request a Quote
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="rounded-[1rem] border border-[#E7EDF3] bg-[#F8FAFC] p-3 text-center"
                >
                  <Icon
                    className="mx-auto h-4 w-4 text-[#14B8A6]"
                    strokeWidth={1.8}
                  />
                  <span className="mt-2 block text-[11px] font-medium leading-tight text-[#6E7D8D]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
          <section className="mt-24" aria-label="Related Products">
            <div className="mb-10 flex items-end justify-between border-b border-[#E5EBF1] pb-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6]">
                  Discover More
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-[#1A2535] md:text-3xl">
                  You May Also Like
                </h2>
              </div>

              <Link
                href={`/en/categories/${slug}`}
                prefetch={false}
                className="hidden items-center gap-1.5 rounded-full border border-[#D9E2EA] bg-white px-4 py-2.5 text-sm font-semibold text-[#637284] transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6] md:flex"
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
                  className="group overflow-hidden rounded-[1.6rem] border border-[#E3EAF1] bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#F3F6F9]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-2 pb-3 pt-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#1A2535] transition-colors group-hover:text-[#14B8A6]">
                      {item.name}
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#D8E1EA] transition-all duration-300 group-hover:w-16 group-hover:bg-[#14B8A6]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
