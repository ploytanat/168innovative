import type { Metadata } from "next"
import Script from "next/script"
import { notFound } from "next/navigation"

import ArticleDetail from "@/app/components/article/ArticleDetail"
import { buildMetadata } from "@/app/config/seo"
import { SITE_URL } from "@/app/config/site"
import { getArticleBySlug } from "@/app/lib/api/articles"
import { getArticleInternalLinks } from "@/app/lib/seo/article-internal-links"
import { buildFaqJsonLd } from "@/app/lib/schema"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug, "th")
  if (!article) return {}

  return buildMetadata({
    locale: "th",
    title: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    path: `/articles/${slug}`,
    image: article.coverImage?.src,
    type: "article",
    canonicalUrl: article.canonicalUrl,
    keywords: [article.focusKeyword, article.title],
  })
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug, "th")
  if (!article) notFound()

  const internalLinks = getArticleInternalLinks(slug, "th")
  const articleUrl = article.canonicalUrl || `${SITE_URL}/articles/${slug}`
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: article.coverImage ? [article.coverImage.src] : undefined,
    author: {
      "@type": "Organization",
      name: article.authorName || "168 Innovative",
    },
    publisher: {
      "@type": "Organization",
      name: "168 Innovative",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  }
  const faqJsonLd = buildFaqJsonLd(article.faqItems)

  return (
    <>
      <Script
        id="article-jsonld-th"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <Script
          id="article-faq-jsonld-th"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <ArticleDetail article={article} locale="th" internalLinks={internalLinks} />
    </>
  )
}
