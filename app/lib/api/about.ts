import { unstable_cache } from 'next/cache'

import { queryAboutSections } from '../db/content'
import { getMockAbout, isMockModeEnabled } from '../mock/runtime'
import type { Locale } from '../types/content'
import type { AboutView } from '../types/view'
import { mapDbAbout } from './content-db'

export async function getAbout(
  locale: Locale
): Promise<Omit<AboutView, "why"> | null> {
  if (isMockModeEnabled()) {
    return getMockAbout(locale)
  }

  return unstable_cache(
    async () => {
      const sections = await queryAboutSections()
      return mapDbAbout(sections, locale)
    },
    [`about-db-${locale}-v1`],
    { revalidate: 300, tags: ['about'] }
  )()
}
