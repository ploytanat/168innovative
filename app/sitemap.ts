import { MetadataRoute } from 'next'
import { getCategories } from './lib/api/categories'
import { getArticles } from './lib/api/articles'
import { getAllProductsForSitemap } from './lib/api/products'

function formatDate(date: string | Date) {
  return new Date(date).toISOString().split('T')[0]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://168innovative.co.th'

  const staticRoutes = ['', '/about', '/contact', '/articles', '/categories'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }))

  const categories = await getCategories('th')
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: formatDate(new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articles = await getArticles('th')
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: formatDate(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const products = await getAllProductsForSitemap()
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/categories/${product.categorySlug}/${product.slug}`,
    lastModified: formatDate(product.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryUrls, ...articleUrls, ...productUrls]
}