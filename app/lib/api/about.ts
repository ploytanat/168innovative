// lib/api/about.ts
import { Locale } from '../types/content'
import { AboutView } from '../types/view'
import { aboutMock } from '../mock/about.mock'
import { getWhy } from './why'

export function getAbout(locale: Locale): AboutView {
  const whyItems = getWhy(locale)

  return {
    hero: {
      title: aboutMock.hero.title[locale],
      description: aboutMock.hero.description[locale],
      image: {
        src: aboutMock.hero.image.src,
        alt: aboutMock.hero.image.alt[locale],
      },
    },

    whoAreWe: {
      title: aboutMock.whoAreWe.title[locale],
      description: aboutMock.whoAreWe.description[locale],
      image: {
        src: aboutMock.whoAreWe.image.src,
        alt: aboutMock.whoAreWe.image.alt[locale],
      },
    },

    why: {
      title:
        locale === 'th'
          ? 'ทำไมต้องเลือก 168 Innovative'
          : 'Why Choose 168 Innovative',
      items: whyItems,
    },
  }
}
