import { Locale } from '../types/content'
import { aboutMock } from '../mock/about.mock'
import { getAboutSEO } from './seo'

export function getAbout(locale: Locale) {
  return {
    hero: {
      title: aboutMock.hero.title[locale],
      description: aboutMock.hero.description[locale],
      image: {
        src: aboutMock.hero.image.src,
        alt: aboutMock.hero.image.alt[locale],
      },
    },

    who: {
      title: aboutMock.whoWeAre.title[locale],
      description: aboutMock.whoWeAre.description[locale],
      image: {
        src: aboutMock.whoWeAre.image.src,
        alt: aboutMock.whoWeAre.image.alt[locale],
      },
    },

    seo: getAboutSEO(locale),
  }
}
