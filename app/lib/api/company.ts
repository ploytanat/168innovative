import { companyMock } from '../mock/company.mock'
import { Locale } from '../types/content'
import { CompanyView } from '../types/view'

export function getCompany(locale: Locale): CompanyView {
  return {
    name: companyMock.name[locale],
    address: companyMock.address[locale],
    phones: companyMock.phones.map(p => ({
      number: p.number,
      label: p.label[locale]
    })),
    email: companyMock.email,
    socials: companyMock.socials
  }
}
