import { unstable_cache } from "next/cache"
import type { MetadataRoute } from "next"

import { withSiteUrl } from "@/app/config/site"
import { getArticles } from "@/app/lib/api/articles"
import { getCategories } from "@/app/lib/api/categories"
import {
  getAboutLastModified,
  getCompanyLastModified,
  getHeroLastModified,
  getWhyLastModified,
} from "@/app/lib/api/sitemap-metadata"
import {
  getAllProductsForSitemap,
  getIndexableProductsForSitemap,
} from "@/app/lib/api/products"
import { shouldIndexCategory } from "@/app/lib/seo/indexability"

type SitemapEntry = MetadataRoute.Sitemap[number]
type SupportedLanguage = "th" | "en"

type SitemapData = {
  categories: Awaited<ReturnType<typeof getCategories>>
  articlesTh: Awaited<ReturnType<typeof getArticles>>
  articlesEn: Awaited<ReturnType<typeof getArticles>>
  allProducts: Awaited<ReturnType<typeof getAllProductsForSitemap>>
  indexableProducts: Awaited<ReturnType<typeof getIndexableProductsForSitemap>>
  aboutLastModified: string | null
  companyLastModified: string | null
  heroLastModified: string | null
  whyLastModified: string | null
}

type SitemapIndexItem = {
  url: string
  lastModified?: Date
}

function toDate(value?: string | Date | null) {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function maxDate(values: Array<Date | string | null | undefined>) {
  const timestamps = values
    .map((value) => toDate(value)?.getTime())
    .filter((value): value is number => typeof value === "number")

  if (!timestamps.length) {
    return undefined
  }

  return new Date(Math.max(...timestamps))
}

function buildAlternates(
  thUrl: string,
  enUrl: string,
  languages: SupportedLanguage[] = ["th", "en"]
) {
  const mapped: Record<string, string> = {}

  if (languages.includes("th")) {
    mapped.th = thUrl
  }

  if (languages.includes("en")) {
    mapped.en = enUrl
  }

  return { languages: mapped }
}

function createEntry(input: {
  url: string
  lastModified?: Date
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>
  priority: number
  alternates?: SitemapEntry["alternates"]
}) {
  const entry: SitemapEntry = {
    url: input.url,
    changeFrequency: input.changeFrequency,
    priority: input.priority,
  }

  if (input.lastModified) {
    entry.lastModified = input.lastModified
  }

  if (input.alternates) {
    entry.alternates = input.alternates
  }

  return entry
}

function dedupeEntries(entries: MetadataRoute.Sitemap) {
  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values()
  )
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function renderLastModified(lastModified?: Date | string) {
  const normalized = toDate(lastModified)

  return normalized
    ? `\n    <lastmod>${escapeXml(normalized.toISOString())}</lastmod>`
    : ""
}

function renderAlternates(alternates?: SitemapEntry["alternates"]) {
  const languages = alternates?.languages

  if (!languages) {
    return ""
  }

  return Object.entries(languages)
    .reduce<string[]>((links, [locale, href]) => {
      if (typeof href !== "string") {
        return links
      }

      links.push(
        `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(href)}" />`
      )

      return links
    }, [])
    .join("")
}

function getEntryLastModified(entries: MetadataRoute.Sitemap) {
  return maxDate(entries.map((entry) => entry.lastModified))
}

function toAbsoluteUrl(pathOrUrl: string) {
  return withSiteUrl(pathOrUrl)
}

function buildPageUrl(path: string) {
  return toAbsoluteUrl(path)
}

const getSitemapData = unstable_cache(
  async (): Promise<SitemapData> => {
    const [
      categories,
      articlesTh,
      articlesEn,
      allProducts,
      indexableProducts,
      aboutLastModified,
      companyLastModified,
      heroLastModified,
      whyLastModified,
    ] = await Promise.all([
      getCategories("th"),
      getArticles("th"),
      getArticles("en"),
      getAllProductsForSitemap(),
      getIndexableProductsForSitemap(),
      getAboutLastModified(),
      getCompanyLastModified(),
      getHeroLastModified(),
      getWhyLastModified(),
    ])

    return {
      categories: categories ?? [],
      articlesTh: articlesTh ?? [],
      articlesEn: articlesEn ?? [],
      allProducts: allProducts ?? [],
      indexableProducts: indexableProducts ?? [],
      aboutLastModified,
      companyLastModified,
      heroLastModified,
      whyLastModified,
    }
  },
  ["sitemap-data-v1"],
  { revalidate: 300, tags: ["categories", "company", "products"] }
)

export async function getCategorySitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()
  const categoryModifiedMap = new Map<string, Date>()

  data.allProducts.forEach((product) => {
    const current = categoryModifiedMap.get(product.categorySlug)
    const candidate = toDate(product.modified)

    if (!candidate) {
      return
    }

    if (!current || candidate.getTime() > current.getTime()) {
      categoryModifiedMap.set(product.categorySlug, candidate)
    }
  })

  const maxProductLastModified = maxDate(
    data.indexableProducts.map((product) => product.modified)
  )
  const homeLastModified = maxDate([
    data.heroLastModified,
    data.whyLastModified,
    data.companyLastModified,
    maxProductLastModified,
  ])
  const categoriesIndexUrlTh = buildPageUrl("/categories")
  const categoriesIndexUrlEn = buildPageUrl("/en/categories")

  const staticEntries: MetadataRoute.Sitemap = [
    createEntry({
      url: buildPageUrl("/"),
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: buildAlternates(buildPageUrl("/"), buildPageUrl("/en")),
    }),
    createEntry({
      url: buildPageUrl("/en"),
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: buildAlternates(buildPageUrl("/"), buildPageUrl("/en")),
    }),
    createEntry({
      url: buildPageUrl("/about"),
      lastModified: toDate(data.aboutLastModified),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: buildAlternates(
        buildPageUrl("/about"),
        buildPageUrl("/en/about")
      ),
    }),
    createEntry({
      url: buildPageUrl("/en/about"),
      lastModified: toDate(data.aboutLastModified),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(
        buildPageUrl("/about"),
        buildPageUrl("/en/about")
      ),
    }),
    createEntry({
      url: buildPageUrl("/contact"),
      lastModified: toDate(data.companyLastModified),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: buildAlternates(
        buildPageUrl("/contact"),
        buildPageUrl("/en/contact")
      ),
    }),
    createEntry({
      url: buildPageUrl("/en/contact"),
      lastModified: toDate(data.companyLastModified),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: buildAlternates(
        buildPageUrl("/contact"),
        buildPageUrl("/en/contact")
      ),
    }),
    createEntry({
      url: categoriesIndexUrlTh,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: buildAlternates(categoriesIndexUrlTh, categoriesIndexUrlEn),
    }),
    createEntry({
      url: categoriesIndexUrlEn,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: buildAlternates(categoriesIndexUrlTh, categoriesIndexUrlEn),
    }),
  ]

  const categoryEntries = data.categories
    .filter((category) => shouldIndexCategory(category, 1))
    .flatMap((category) => {
      const thUrl = buildPageUrl(`/categories/${category.slug}`)
      const enUrl = buildPageUrl(`/en/categories/${category.slug}`)
      const lastModified = categoryModifiedMap.get(category.slug)
      const alternates = buildAlternates(thUrl, enUrl)

      return [
        createEntry({
          url: thUrl,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates,
        }),
        createEntry({
          url: enUrl,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates,
        }),
      ]
    })

  return dedupeEntries([...staticEntries, ...categoryEntries])
}

export async function getArticleSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()
  const articlesBySlugEn = new Map(
    data.articlesEn.map((article) => [article.slug, article])
  )
  const articlesIndexLastModified = maxDate(
    data.articlesTh.map((article) => article.updatedAt ?? article.publishedAt)
  )
  const articlesIndexUrlTh = buildPageUrl("/articles")
  const articlesIndexUrlEn = buildPageUrl("/en/articles")

  const listingEntries: MetadataRoute.Sitemap = [
    createEntry({
      url: articlesIndexUrlTh,
      lastModified: articlesIndexLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: buildAlternates(articlesIndexUrlTh, articlesIndexUrlEn),
    }),
    createEntry({
      url: articlesIndexUrlEn,
      lastModified: articlesIndexLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: buildAlternates(articlesIndexUrlTh, articlesIndexUrlEn),
    }),
  ]

  const articleEntries = data.articlesTh.flatMap((articleTh) => {
    const articleEn = articlesBySlugEn.get(articleTh.slug)
    const thUrl = toAbsoluteUrl(
      articleTh.canonicalUrl ?? `/articles/${articleTh.slug}`
    )
    const enUrl = toAbsoluteUrl(
      articleEn?.canonicalUrl ?? `/en/articles/${articleTh.slug}`
    )
    const lastModified = maxDate([
      articleTh.updatedAt,
      articleEn?.updatedAt,
      articleTh.publishedAt,
      articleEn?.publishedAt,
    ])
    const alternates = buildAlternates(thUrl, enUrl)

    return [
      createEntry({
        url: thUrl,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
      }),
      createEntry({
        url: enUrl,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates,
      }),
    ]
  })

  return dedupeEntries([...listingEntries, ...articleEntries])
}

export async function getProductSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const data = await getSitemapData()

  const productEntries = data.indexableProducts.flatMap((product) => {
    const thUrl = buildPageUrl(
      `/categories/${product.categorySlug}/${product.slug}`
    )
    const enUrl = buildPageUrl(
      `/en/categories/${product.categorySlug}/${product.slug}`
    )
    const languages: SupportedLanguage[] = []

    if (product.indexTh) {
      languages.push("th")
    }

    if (product.indexEn) {
      languages.push("en")
    }

    const alternates =
      languages.length > 0 ? buildAlternates(thUrl, enUrl, languages) : undefined
    const lastModified = toDate(product.modified)
    const entries: MetadataRoute.Sitemap = []

    if (product.indexTh) {
      entries.push(
        createEntry({
          url: thUrl,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.9,
          alternates,
        })
      )
    }

    if (product.indexEn) {
      entries.push(
        createEntry({
          url: enUrl,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates,
        })
      )
    }

    return entries
  })

  return dedupeEntries(productEntries)
}

export async function getSitemapIndexItems(): Promise<SitemapIndexItem[]> {
  const [categories, articles, products] = await Promise.all([
    getCategorySitemapEntries(),
    getArticleSitemapEntries(),
    getProductSitemapEntries(),
  ])

  return [
    {
      url: buildPageUrl("/sitemap-categories.xml"),
      lastModified: getEntryLastModified(categories),
    },
    {
      url: buildPageUrl("/sitemap-articles.xml"),
      lastModified: getEntryLastModified(articles),
    },
    {
      url: buildPageUrl("/sitemap-products.xml"),
      lastModified: getEntryLastModified(products),
    },
  ]
}

export function renderSitemap(entries: MetadataRoute.Sitemap) {
  const body = entries
    .map((entry) => {
      const alternates = renderAlternates(entry.alternates)
      const lastModified = renderLastModified(entry.lastModified)
      const changeFrequency = entry.changeFrequency
        ? `\n    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`
        : ""
      const priority =
        typeof entry.priority === "number"
          ? `\n    <priority>${escapeXml(entry.priority.toString())}</priority>`
          : ""

      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>${alternates}${lastModified}${changeFrequency}${priority}`,
        "  </url>",
      ].join("\n")
    })
    .join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    "</urlset>",
  ].join("\n")
}

export function renderSitemapIndex(items: SitemapIndexItem[]) {
  const body = items
    .map((item) => {
      const lastModified = renderLastModified(item.lastModified)

      return [
        "  <sitemap>",
        `    <loc>${escapeXml(item.url)}</loc>${lastModified}`,
        "  </sitemap>",
      ].join("\n")
    })
    .join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</sitemapindex>",
  ].join("\n")
}
