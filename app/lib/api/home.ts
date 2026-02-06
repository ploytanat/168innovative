// lib/api/home.ts
import { homeMock } from '../mock/home.mock'
import { Locale } from '../types/content'
import { HomeView } from '../types/view'

export function getHome(locale: Locale): HomeView {
  return {
    hero: {
      slides: homeMock.hero.slides.map(slide => ({
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
    
  }
}
