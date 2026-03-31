import { unstable_cache } from 'next/cache'

import { queryHeroSlideChips, queryHeroSlides, queryHeroSlideStats } from '../db/content'
import { getMockHeroSlides, isMockModeEnabled } from '../mock/runtime'
import type { Locale } from '../types/content'
import { mapDbHeroSlide } from './content-db'

export async function getHeroSlides(locale: Locale) {
  if (isMockModeEnabled()) {
    return getMockHeroSlides(locale)
  }

  return unstable_cache(
    async () => {
      const slides = await queryHeroSlides()
      const slideIds = slides.map((slide) => slide.id)
      const [stats, chips] = await Promise.all([
        queryHeroSlideStats(slideIds),
        queryHeroSlideChips(slideIds),
      ])

      return slides.map((slide) => mapDbHeroSlide(slide, stats, chips, locale))
    },
    [`hero-slides-db-${locale}-v1`],
    { revalidate: 300, tags: ['hero'] }
  )()
}
