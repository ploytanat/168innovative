import { articlesMock } from '../mock/articles.mock'
import { Locale } from '../types/content'
import { ArticleView } from '../types/view'

export function getArticles(locale: Locale): ArticleView[] {
  return articlesMock.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title[locale],
    excerpt: a.excerpt[locale],
    content: a.content[locale],
    coverImage: a.coverImage
      ? {
          src: a.coverImage.src,
          alt: a.coverImage.alt[locale],
        }
      : undefined,
    category: a.category,
    publishedAt: a.publishedAt,
  }))
}

export function getArticleBySlug(
  slug: string,
  locale: Locale
): ArticleView | undefined {
  const article = articlesMock.find(a => a.slug === slug)
  if (!article) return undefined

  return {
    id: article.id,
    slug: article.slug,
    title: article.title[locale],
    excerpt: article.excerpt[locale],
    content: article.content[locale],
    coverImage: article.coverImage
      ? {
          src: article.coverImage.src,
          alt: article.coverImage.alt[locale],
        }
      : undefined,
    category: article.category,
    publishedAt: article.publishedAt,
  }
}
