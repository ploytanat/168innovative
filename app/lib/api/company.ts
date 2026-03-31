import { unstable_cache } from 'next/cache'

import { queryCompanyContactMethods, queryCompanyGalleryImages, queryCompanyProfile } from '../db/content'
import { getMockCompany, isMockModeEnabled } from '../mock/runtime'
import type { Locale } from '../types/content'
import type { CompanyView } from '../types/view'
import { mapDbCompany } from './content-db'

export async function getCompany(locale: Locale): Promise<CompanyView | null> {
  if (isMockModeEnabled()) {
    return getMockCompany(locale)
  }

  return unstable_cache(
    async () => {
      const company = await queryCompanyProfile()
      if (!company) return null

      const [contacts, gallery] = await Promise.all([
        queryCompanyContactMethods(company.id),
        queryCompanyGalleryImages(company.id),
      ])

      return mapDbCompany(company, contacts, gallery, locale)
    },
    [`company-db-${locale}-v1`],
    { revalidate: 300, tags: ['company'] }
  )()
}
