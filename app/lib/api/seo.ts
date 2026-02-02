// lib/api/seo.ts
import { seoMock } from '../mock/seo.mock'
import { Locale } from '../types/content'

export function getHomeSEO(locale: Locale) {
  return {
    title: seoMock.home.title[locale],
    description: seoMock.home.description[locale],
    keywords: seoMock.home.keywords,
  }
}
