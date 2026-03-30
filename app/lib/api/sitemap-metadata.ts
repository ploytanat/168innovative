import { getMockLastModified } from "../mock/runtime"

export function getAboutLastModified() {
  return Promise.resolve(getMockLastModified())
}

export function getCompanyLastModified() {
  return Promise.resolve(getMockLastModified())
}

export function getHeroLastModified() {
  return Promise.resolve(getMockLastModified())
}

export function getWhyLastModified() {
  return Promise.resolve(getMockLastModified())
}
