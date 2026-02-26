import { MetadataRoute } from 'next'
import { getCategories } from './lib/api/categories'
import { getArticles } from './lib/api/articles'
import { getAllProductsForSitemap } from './lib/api/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://168innovative.co.th'

  // 1. Static Pages
  const staticRoutes = ['', '/about', '/contact', '/articles', '/categories'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 1.0,
  }))

  // 2. Categories
  const categories = await getCategories('th')
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Articles
  const articles = await getArticles('th')
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 4. Products
  const products = await getAllProductsForSitemap()
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/categories/${product.categorySlug}/${product.slug}`,
    lastModified: product.modified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryUrls, ...articleUrls, ...productUrls]
}