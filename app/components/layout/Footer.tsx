'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
}

type NavItem = {
  href: string
  label: { th: string; en: string }
}

const NAV_ITEMS: NavItem[] = [
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/articles', label: { th: 'บทความ', en: 'Articles' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

const COPY = {
  th: {
    about:
      'บรรจุภัณฑ์เครื่องสำอางและพลาสติกสำหรับงาน OEM และ ODM นำเข้าโดยตรงจากโรงงาน คุณภาพสูง ราคาโรงงาน',
    brandTitle: '168 Innovative',
    navTitle: 'บริษัท',
    contactTitle: 'ติดต่อ',
    socialTitle: 'ช่องทางออนไลน์',
    phoneTitle: 'โทรศัพท์',
    emailTitle: 'อีเมล',
    addressTitle: 'ที่อยู่',
    copyright: 'สงวนลิขสิทธิ์',
    badges: ['Food Grade', 'Cosmetic Grade', 'OEM/ODM'],
  },
  en: {
    about:
      'Cosmetic and plastic packaging for OEM and ODM projects with direct factory sourcing and production-ready quality.',
    brandTitle: '168 Innovative',
    navTitle: 'Company',
    contactTitle: 'Contact',
    socialTitle: 'Online',
    phoneTitle: 'Phone',
    emailTitle: 'Email',
    addressTitle: 'Address',
    copyright: 'All rights reserved.',
    badges: ['Food Grade', 'Cosmetic Grade', 'OEM/ODM'],
  },
} as const

function formatSocialLabel(type: string) {
  return type.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function socialAccent(type: string) {
  const key = type.toLowerCase()
  if (key === 'line') return '#6bbfa8'
  if (key === 'facebook') return '#6aaae0'
  if (key === 'shopee') return '#e8a870'
  if (key === 'instagram') return '#e8939a'
  return '#c96870'
}

export default function Footer({ company }: FooterProps) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'
  const copy = COPY[locale]

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  return (
    <footer className="bg-[#2e2820] pb-7 pt-16 text-white/55">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1.15fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-[#e8939a] px-3 py-1.5 font-serif text-[14px] font-semibold text-white">
                168
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white/90">{copy.brandTitle}</div>
                <div className="text-[11px] text-white/45">บรรจุภัณฑ์ OEM/ODM</div>
              </div>
            </div>

            <div className="max-w-[420px] text-[14px] leading-8 text-white/55">
              {copy.about}
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {company.socials.map((social) => (
                <a
                  key={`${social.type}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={formatSocialLabel(social.type)}
                  className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/10 transition hover:-translate-y-0.5"
                  style={{ color: socialAccent(social.type) }}
                >
                  {social.icon?.src ? (
                    <Image
                      src={social.icon.src}
                      alt={social.icon.alt || formatSocialLabel(social.type)}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain brightness-0 invert"
                    />
                  ) : (
                    <span className="text-[13px] font-semibold text-white">
                      {formatSocialLabel(social.type).slice(0, 1)}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[14px] font-semibold text-white/80">
              {copy.navTitle}
            </div>
            <div className="flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={withLocale(item.href)}
                  className="text-[14px] text-white/45 transition hover:text-[#e8939a]"
                >
                  {item.label[locale]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[14px] font-semibold text-white/80">
              {copy.socialTitle}
            </div>
            <div className="flex flex-col gap-2.5">
              {company.socials.map((social) => (
                <a
                  key={`footer-${social.type}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] text-white/45 transition hover:text-[#e8939a]"
                >
                  {formatSocialLabel(social.type)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[14px] font-semibold text-white/80">
              {copy.contactTitle}
            </div>

            <div className="mb-4 flex items-start gap-3">
              <span className="mt-0.5 text-[15px]">📍</span>
              <div className="text-[13.5px] leading-7 text-white/45">{company.address}</div>
            </div>

            {company.phones.length > 0 && (
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 text-[15px]">📞</span>
                <div className="text-[13.5px] leading-7 text-white/45">
                  {company.phones.map((phone) => (
                    <div key={phone.number}>{phone.number}</div>
                  ))}
                </div>
              </div>
            )}

            {company.email.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[15px]">📧</span>
                <div className="text-[13.5px] leading-7 text-white/45">
                  {company.email.map((email) => (
                    <div key={email}>{email}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <div className="text-[13px] text-white/45">
            © {new Date().getFullYear()} {company.name}. {copy.copyright}
          </div>

          <div className="flex flex-wrap gap-2">
            {copy.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/8 px-3 py-1 text-[12px] text-white/40"
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
