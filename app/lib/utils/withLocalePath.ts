// lib/utils/withLocalePath.ts
export function withLocalePath(
  path: string,
  locale: 'th' | 'en'
) {
  return locale === 'en' ? `/en${path}` : path
}
