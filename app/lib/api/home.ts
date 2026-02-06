// lib/api/home.ts
import { homeMock } from '../mock/home.mock'
import { HomeContent } from '../types/content'
import { HomeView } from '../types/view'

export function getHome(locale: 'th' | 'en'): HomeView {
  const content: HomeContent = homeMock

  return {
    hero: {
      slides: content.hero.slides.map(slide => ({
        id: slide.id,
        title: slide.title[locale],
        subtitle: slide.subtitle[locale],
        description: slide.description[locale],
        image: {
          src: slide.image.src,
          alt: slide.image.alt[locale],
        },
        ctaPrimary: {
          href: slide.ctaPrimary.href,
          label: slide.ctaPrimary.label[locale],
        },
      })),
    },

    why: content.why.map(item => ({
      title: item.title[locale],
      description: item.description[locale],
    })),

    seo: {
      title: content.seo.title[locale],
      description: content.seo.description[locale],
      keywords: content.seo.keywords,
    },
  }
}
