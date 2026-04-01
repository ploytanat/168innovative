import { getMockLastModified } from "../mock/runtime"
import {
  getWordPressAboutLastModified,
  getWordPressCompanyLastModified,
  getWordPressHeroLastModified,
  getWordPressWhyLastModified,
} from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export function getAboutLastModified() {
  return loadWithWordPressFallback(
    "about last modified",
    () => getWordPressAboutLastModified(),
    () => Promise.resolve(getMockLastModified())
  )
}

export function getCompanyLastModified() {
  return loadWithWordPressFallback(
    "company last modified",
    () => getWordPressCompanyLastModified(),
    () => Promise.resolve(getMockLastModified())
  )
}

export function getHeroLastModified() {
  return loadWithWordPressFallback(
    "hero last modified",
    () => getWordPressHeroLastModified(),
    () => Promise.resolve(getMockLastModified())
  )
}

export function getWhyLastModified() {
  return loadWithWordPressFallback(
    "why last modified",
    () => getWordPressWhyLastModified(),
    () => Promise.resolve(getMockLastModified())
  )
}
