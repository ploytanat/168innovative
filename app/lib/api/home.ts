// lib/api/home.ts
import { Locale } from '../types/content'
import { homeMock } from '../mock/home.mock'
import { categoriesMock } from '../mock/categories.mock'
import { productsMock } from '../mock/products.mock'
import { companyMock } from '../mock/company.mock'

export function getHome(locale: Locale) {
  return {
    hero: {
      title: homeMock.hero.title[locale],
      description: homeMock.hero.description[locale],
      image: homeMock.hero.image,
      ctaPrimary: {
        href: homeMock.hero.ctaPrimary.href,
        label: homeMock.hero.ctaPrimary.label[locale],
      },
      ctaSecondary: {
        href: homeMock.hero.ctaSecondary.href,
        label: homeMock.hero.ctaSecondary.label[locale],
      },
    },

    categories: categoriesMock.map((c) => ({
      id: c.id,
      name: c.name[locale],
     // image: c.image,
    })),

    products: productsMock.map((p) => ({
      id: p.id,
      name: p.name[locale],
      image: p.image,
    })),

    why: homeMock.why.map((w) => ({
      title: w.title[locale],
      description: w.description[locale],
    })),

    company: {
      name: companyMock.name[locale],
      address: companyMock.address[locale],
      phones: companyMock.phones.map((p) => ({
        number: p.number,
        label: p.label[locale],
      })),
      email: companyMock.email,
    },

    seo: {
      title: homeMock.seo.title[locale],
      description: homeMock.seo.description[locale],
      keywords: homeMock.seo.keywords,
    },
  }
}
