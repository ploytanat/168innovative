import { unstable_cache } from 'next/cache'

import { queryWhyItems } from '../db/content'
import { getMockWhy, isMockModeEnabled } from '../mock/runtime'
import type { Locale } from '../types/content'
import type { WhyItemView } from '../types/view'
import { mapDbWhyItem } from './content-db'

export async function getWhy(locale: Locale): Promise<WhyItemView[]> {
  if (isMockModeEnabled()) {
    return getMockWhy(locale)
  }

  return unstable_cache(
    async () => {
      const rows = await queryWhyItems('home', 'why')
      return rows.map((item) => mapDbWhyItem(item, locale))
    },
    [`why-home-db-${locale}-v1`],
    { revalidate: 300, tags: ['why'] }
  )()
}
