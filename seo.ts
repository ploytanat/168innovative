// lib/api/seo.ts
import { seoMock } from './app/lib/mock/seo.mock'
import { Locale } from './app/lib/types/content'

export function getHomeSEO(locale: Locale) {
  return {
    title: seoMock.home.title[locale],
    description: seoMock.home.description[locale],
    keywords: seoMock.home.keywords,
  }
}

export function getAboutSEO(locale: Locale) {
  return {
    title: seoMock.about.title[locale],
    description: seoMock.about.description[locale],
    keywords: seoMock.about.keywords,
  }
}

export function getProductsSEO(locale: Locale) {
  return {
    title: seoMock.products.title[locale],
    description: seoMock.products.description[locale],
    keywords: seoMock.products.keywords,
  }
}
