'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
}

const FOOTER_LINKS = {
  products: {
    th: {
      title: 'สินค้าของเรา',
      items: [
        'จุกซอง & Spout',
        'ตลับแป้ง',
        'ถุงสบู่',
        'ที่จับพลาสติก',
        'มาสคาร่า',
        'ฝากด',
        'แพ็กเกจลิปสติก',
      ],
    },
    en: {
      title: 'Products',
      items: [
        'Spout & Cap',
        'Compact Powder',
        'Soap Bag',
        'Plastic Handle',
        'Mascara',
        'Dispensing Cap',
        'Lipstick Packaging',
      ],
    },
    href: '/categories',
  },
  services: {
    th: {
      title: 'บริการ',
      items: [
        'OEM ผลิตตามแบบ',
        'ODM ออกแบบให้',
        'ขอตัวอย่างฟรี',
        'ใบเสนอราคา',
        'ส่งออกต่างประเทศ',
      ],
    },
    en: {
      title: 'Services',
      items: [
        'OEM Manufacturing',
        'ODM Design',
        'Free Sample',
        'Quotation',
        'Export Support',
      ],
    },
    href: '/contact',
  },
  info: {
    th: {
      title: 'ข้อมูลเพิ่มเติม',
      items: [
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'บทความ', href: '/articles' },
        { label: 'ติดต่อเรา', href: '/contact' },
      ],
    },
    en: {
      title: 'More Info',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Articles', href: '/articles' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  },
} as const

export default function Footer({ company }: FooterProps) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'
  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const currentYear = new Date().getFullYear()
  const primaryPhone = company.phones[0]?.number
  const lineUrl = company.socials.find((social) => social.type === 'line')?.url
  const primaryEmail = company.email[0]

  return (
    <footer className="bg-[#111827] text-white/[0.6]">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-5">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-heading mb-3 text-[18px] font-extrabold text-white">
              168 Innovative
            </p>
            <p className="mb-5 text-[12px] leading-[1.85] text-white/[0.42]">
              {locale === 'th'
                ? 'บริษัท 168 อินโนเวทีฟ จำกัด ผู้ผลิตและจำหน่ายบรรจุภัณฑ์พลาสติกสำหรับงาน OEM และ ODM ครบวงจร'
                : 'Manufacturer and distributor of packaging solutions for OEM and ODM projects.'}
            </p>

            <div className="flex flex-col gap-2 text-[12px]">
              {primaryPhone ? (
                <a
                  href={`tel:${primaryPhone.replace(/[^+\d]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {primaryPhone}
                </a>
              ) : null}
              {lineUrl ? (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  LINE: @168innovative
                </a>
              ) : null}
              {primaryEmail ? (
                <a href={`mailto:${primaryEmail}`} className="transition-colors hover:text-white">
                  {primaryEmail}
                </a>
              ) : null}
              <span>{company.address}</span>
            </div>
          </div>

          <div>
            <p className="mb-3 border-b border-white/[0.10] pb-2 text-[13px] font-semibold text-white/[0.82]">
              {FOOTER_LINKS.products[locale].title}
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.products[locale].items.map((label) => (
                <li key={label}>
                  <Link
                    href={withLocale(FOOTER_LINKS.products.href)}
                    className="text-[12px] text-white/[0.44] transition-colors hover:text-white/[0.85]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 border-b border-white/[0.10] pb-2 text-[13px] font-semibold text-white/[0.82]">
              {FOOTER_LINKS.services[locale].title}
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.services[locale].items.map((label) => (
                <li key={label}>
                  <Link
                    href={withLocale(FOOTER_LINKS.services.href)}
                    className="text-[12px] text-white/[0.44] transition-colors hover:text-white/[0.85]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 border-b border-white/[0.10] pb-2 text-[13px] font-semibold text-white/[0.82]">
              {FOOTER_LINKS.info[locale].title}
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.info[locale].items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={withLocale(item.href)}
                    className="text-[12px] text-white/[0.44] transition-colors hover:text-white/[0.85]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
          <p className="text-[11px] text-white/[0.28]">
            © {currentYear} บริษัท 168 อินโนเวทีฟ จำกัด
          </p>

          <div className="flex gap-2">
            {['ISO Certified', 'OEM/ODM', locale === 'th' ? 'ส่งทั่วประเทศ' : 'Nationwide Delivery'].map((badge) => (
              <span
                key={badge}
                className="rounded border border-white/[0.10] bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/[0.32]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
