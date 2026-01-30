import { seoMock } from '../mock/seo.mock'
import { Locale } from '../types/content'

export function getSEO(
  page: 'home' | 'products',
  locale: Locale
) {
  return seoMock[page]
    ? {
        title: seoMock[page].title[locale],
        description: seoMock[page].description[locale],
        keywords: seoMock[page].keywords
      }
    : null
}
