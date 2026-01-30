import { whyMock } from '../mock/why.mock'
import { Locale } from '../types/content'

export function getWhy(locale: Locale) {
  return whyMock.map(item => ({
    title: item.title[locale],
    description: item.description[locale]
  }))
}
