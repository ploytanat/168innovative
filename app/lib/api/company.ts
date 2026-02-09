// lib/api/company.ts
import { companyMock } from '../mock/company.mock'
import { Locale } from '../types/content'
import { CompanyView } from '../types/view'

export function getCompany(locale: Locale): CompanyView {
  return {
    logo: {
      src: companyMock.logo.src,
      alt: companyMock.logo.alt[locale],
    },

    name: companyMock.name[locale],
    address: companyMock.address[locale],

    phones: companyMock.phones.map(p => ({
      number: p.number,
      label: p.label[locale],
    })),

    email: companyMock.email,

    socials: companyMock.socials.map(s => ({
      type: s.type,
      url: s.url,
      icon: {
        src: s.icon.src,
        alt: s.icon.alt,
      },
    })),

    lineQrCode: companyMock.lineQrCode
      ? {
          src: companyMock.lineQrCode.src,
          alt: companyMock.lineQrCode.alt[locale],
        }
      : undefined,

    /** รูปเดี่ยว (fallback) */
    contactImage: companyMock.contactImage
      ? {
          src: companyMock.contactImage.src,
          alt: companyMock.contactImage.alt[locale],
        }
      : undefined,

    /** ✅ Gallery (ของใหม่) */
    contactGallery: companyMock.contactGallery?.map(img => ({
      src: img.src,
      alt: img.alt[locale],
    })),
  }
}
