// lib/api/company.ts
import { companyMock } from '../mock/company.mock'
import { Locale } from '../types/content'
import { CompanyView } from '../types/view'

export function getCompany(locale: Locale): CompanyView {
  return {
    logo:{
      src: companyMock.logo.src,
      alt: companyMock.logo.alt[locale],
    },
    name: companyMock.name[locale],
    address: companyMock.address[locale],
    
    // จัดการข้อมูลรูปภาพให้พร้อมใช้ใน UI
    contactImage: companyMock.contactImage ? {
      src: companyMock.contactImage.src,
      alt: companyMock.contactImage.alt[locale]
    } : undefined,

    lineQrCode: companyMock.lineQrCode ? {
      src: companyMock.lineQrCode.src,
      alt: companyMock.lineQrCode.alt[locale]
    } : undefined,

    phones: companyMock.phones.map(p => ({
      number: p.number,
      label: p.label[locale]
    })),
    
    email: companyMock.email,
    socials: companyMock.socials
  }
}