import { MetadataRoute } from "next"
import { getCategories } from "./lib/api/categories"
import { getArticles } from "./lib/api/articles"
import { getAllProductsForSitemap } from "./lib/api/products"

const baseUrl = "https://168innovative.co.th"

function formatDate(date?: string | Date | null): Date {
  return date ? new Date(date) : new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { route: "/", priority: 1.0 },
    { route: "/about", priority: 0.8 },
    { route: "/contact", priority: 0.7 },
    { route: "/articles", priority: 0.8 },
    { route: "/categories", priority: 0.9 },
    { route: "/en", priority: 0.9 },
    { route: "/en/about", priority: 0.7 },
    { route: "/en/contact", priority: 0.6 },
    { route: "/en/articles", priority: 0.7 },
    { route: "/en/categories", priority: 0.8 },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: item.priority,
  }))

  const categories = (await getCategories("th")) || []
  const categoryUrls = categories.flatMap((cat) => [
    {
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ])

  const articles = (await getArticles("th")) || []
  const articleUrls = articles.flatMap((article) => [
    {
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: formatDate(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/articles/${article.slug}`,
      lastModified: formatDate(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ])

  const products = (await getAllProductsForSitemap()) || []
  const productUrls = products.flatMap((product) => [
    {
      url: `${baseUrl}/categories/${product.categorySlug}/${product.slug}`,
      lastModified: formatDate(product.modified),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/categories/${product.categorySlug}/${product.slug}`,
      lastModified: formatDate(product.modified),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ])

  return [...staticRoutes, ...categoryUrls, ...articleUrls, ...productUrls]
}
