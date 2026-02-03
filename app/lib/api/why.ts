import { whyMock } from '../mock/why.mock'
import { Locale } from '../types/content'

export function getWhy(locale: Locale) {
  return whyMock.map(item => ({
    image: {
      src: item.image.src,
      alt: item.image.alt[locale],
    },
    title: item.title[locale],
    description: item.description[locale]
  }))
}
