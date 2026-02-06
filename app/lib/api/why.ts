import { whyMock } from '../mock/why.mock'
import { Locale } from '../types/content'
import { WhyItemView } from '../types/view'

export function getWhy(locale: Locale): WhyItemView[] {
  return whyMock.map(item => ({
    title: item.title[locale],
    description: item.description[locale],
    image: item.image
      ? {
          src: item.image.src,
          alt: item.image.alt[locale],
        }
      : undefined,
  }))
}
