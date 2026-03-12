import type { Metadata } from "next"
import Image from "next/image"
import { ArrowLeft, BookOpen, CalendarDays, Clock } from "lucide-react"
import Script from "next/script"
import { notFound } from "next/navigation"

import ArticleBody from "@/app/components/ui/ArticleBody"
import FaqSection from "@/app/components/ui/FaqSection"
import LocalizedLink from "@/app/components/ui/LocalizedLink"
import PageIntro from "@/app/components/ui/PageIntro"
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
  const article = await getArticleBySlug(slug, "en")
  if (!article) return {}

  return buildMetadata({
    locale: "en",
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
  const article = await getArticleBySlug(slug, "en")
  if (!article) notFound()
  const internalLinks = getArticleInternalLinks(slug, "en")

  const articleUrl = article.canonicalUrl || `${SITE_URL}/en/articles/${slug}`
  const readingTime = article.readingTimeMinutes ?? 5
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
      name: "168 Innovative",
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
    <main className="min-h-screen bg-white">
      <Script
        id="article-jsonld-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <Script
          id="article-faq-jsonld-en"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
        <PageIntro
          eyebrow="Articles & Insights"
          title={article.title}
          description={article.excerpt}
          breadcrumbs={[
            { label: "Articles", href: "/en/articles" },
            { label: article.title },
          ]}
          actions={
            <LocalizedLink
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full border border-[#D8E1EA] bg-white px-5 py-2.5 text-sm font-medium text-[#5A6A7E] shadow-sm transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]"
            >
              <ArrowLeft size={14} />
              All Articles
            </LocalizedLink>
          }
        />

        <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] font-medium uppercase tracking-widest text-[#14B8A6]">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={11} />
            {`${readingTime} min read`}
          </span>
        </div>

        {article.coverImage ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-200">
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
          </div>
        ) : null}

        <ArticleBody html={article.content} />

        {internalLinks ? (
          <section className="mt-14 rounded-[2rem] border border-[#E7E1D9] bg-[#FCFBF8] px-6 py-8 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#14B8A6]">
                Internal Links
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {internalLinks.sectionTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {internalLinks.sectionDescription}
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {internalLinks.groups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[1.5rem] border border-[#E7E1D9] bg-white p-5"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {group.title}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <LocalizedLink
                        key={item.href}
                        href={item.href.replace(/^\/en/, "")}
                        className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6]"
                      >
                        {item.label}
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <FaqSection
          className="mt-12"
          eyebrow="Frequently Asked Questions"
          title="FAQ"
          items={article.faqItems}
        />

        <div className="mt-8 flex items-center justify-between">
          <LocalizedLink
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-[#D8E1EA] bg-white px-5 py-2.5 text-sm font-medium text-[#5A6A7E] shadow-sm transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]"
          >
            <ArrowLeft size={14} />
            All Articles
          </LocalizedLink>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />
            {`${readingTime} min read`}
          </span>
        </div>
      </div>
    </main>
  )
}
