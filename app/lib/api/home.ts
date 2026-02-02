// lib/api/home.ts
import { Locale } from '../types/content'
import { homeMock } from '../mock/home.mock'

import { getCategories } from './categories'
import { getProducts } from './products'
import { getCompany } from './company'
import { getHomeSEO } from './seo'

export function getHome(locale: Locale) {
  return {
    hero: {
      title: homeMock.hero.title[locale],
      description: homeMock.hero.description[locale],
      image: {
        src: homeMock.hero.image.src,
        alt: homeMock.hero.image.alt[locale],
      },
      ctaPrimary: {
        href: homeMock.hero.ctaPrimary.href,
        label: homeMock.hero.ctaPrimary.label[locale],
      },
      ctaSecondary: {
        href: homeMock.hero.ctaSecondary.href,
        label: homeMock.hero.ctaSecondary.label[locale],
      },
    },

    categories: getCategories(locale),
    products: getProducts(locale),

    why: homeMock.why.map(w => ({
      title: w.title[locale],
      description: w.description[locale],
    })),

    company: getCompany(locale),
    seo: getHomeSEO(locale),
  }
}
