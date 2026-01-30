import { homeMock } from '../mock/home.mock'
import { Locale } from '../types/content'

export function getHome(locale: Locale) {
  return {
    hero: {
      title: homeMock.hero.title[locale],
      description: homeMock.hero.description[locale],
      image: homeMock.hero.image,
      ctaPrimary: {
        ...homeMock.hero.ctaPrimary,
        label: homeMock.hero.ctaPrimary.label[locale]
      },
      ctaSecondary: {
        ...homeMock.hero.ctaSecondary,
        label: homeMock.hero.ctaSecondary.label[locale]
      }
    },
    why: homeMock.why.map(item => ({
      title: item.title[locale],
      description: item.description[locale]
    })),
    seo: {
      title: homeMock.seo.title[locale],
      description: homeMock.seo.description[locale],
      keywords: homeMock.seo.keywords
    }
  }
}
