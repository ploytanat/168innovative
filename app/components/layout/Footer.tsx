'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, MapPin } from 'lucide-react'

import { CompanyView } from '@/app/lib/types/view'
import {
  COLORS,
  CTA_GRADIENT,
  EYEBROW_PILL_STYLE,
  GLASS,
  NAV_ACTIVE_PILL_STYLE,
  SECTION_BACKGROUNDS,
  SECTION_BORDER,
} from '@/app/components/ui/designSystem'

interface FooterProps {
  company: CompanyView
}

const navigation = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'หมวดสินค้า', en: 'Products' } },
  { href: '/articles', label: { th: 'บทความ', en: 'Articles' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About Us' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

const copy = {
  th: {
    eyebrow: '168 Innovative',
    title: 'บรรจุภัณฑ์ที่พร้อมต่อยอดสู่การขายจริง',
    description:
      'บรรจุภัณฑ์เครื่องสำอางจากแหล่งผลิตโดยตรง ทำงานง่ายขึ้น ตอบกลับไวขึ้น และติดต่อทีมขายได้ตรงกว่าเดิม',
    navigation: 'Navigation',
    contact: 'Contact',
    connect: 'Connect',
    language: 'Language',
    openMap: 'เปิดใน Google Maps',
    salesDesk: 'โทรศัพท์ติดต่อ',
    emailDesk: 'Email',
    copyright: 'All rights reserved.',
  },
  en: {
    eyebrow: '168 Innovative',
    title: 'Packaging that feels ready for market',
    description:
      'Factory-sourced cosmetic packaging with a cleaner process, faster response, and direct contact with sales.',
    navigation: 'Navigation',
    contact: 'Contact',
    connect: 'Connect',
    language: 'Language',
    openMap: 'Open in Google Maps',
    salesDesk: 'Sales & Office',
    emailDesk: 'Email',
    copyright: 'All rights reserved.',
  },
} as const

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/168+INNOVATIVE/@13.6189889,100.4238107,16.58z/data=!4m15!1m8!3m7!1s0x30e2bcb939ac5e39:0xa5d1f39039bd8382!2zODkg4LiL4Lit4LiiIOC5gOC4l-C4teC4ouC4meC4l-C4sOC5gOC4pSAyMCDguYHguILguKfguIfguYHguKrguKHguJTguLMg4LmA4LiC4LiV4Lia4Liy4LiH4LiC4Li44LiZ4LmA4LiX4Li14Lii4LiZIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDE1MA!3b1!8m2!3d13.620821!4d100.4236494!16s%2Fg%2F11sp98b_dz!3m5!1s0x30e2bd007a6774dd:0xa3b3383a2a290b44!8m2!3d13.6174254!4d100.4232667!16s%2Fg%2F11w4sb_jqj?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D"

function formatSocialLabel(type: string) {
  return type.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Footer({ company }: FooterProps) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'
  const text = copy[locale]

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const toTH = pathname.startsWith('/en')
    ? pathname.replace(/^\/en/, '') || '/'
    : pathname

  const toEN = pathname.startsWith('/en')
    ? pathname
    : `/en${pathname === '/' ? '' : pathname}`

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ borderColor: SECTION_BORDER, background: SECTION_BACKGROUNDS.footer }}
      aria-label="Site footer"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: CTA_GRADIENT }} />
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#fff3e8]/50 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-10 h-56 w-56 rounded-full bg-[#9fb3cc]/24 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#dfc0cd]/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 pb-5 pt-7 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.78fr_0.9fr]">
          <section className="rounded-[0.95rem] p-4" style={GLASS.secondary}>
            <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>
              {text.eyebrow}
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <Link
                href={withLocale('/')}
                className="inline-flex rounded-[0.85rem] px-2.5 py-2 transition-transform hover:-translate-y-0.5"
                style={GLASS.card}
              >
                <Image
                  src={company.logo.src}
                  alt={company.logo.alt}
                  width={112}
                  height={36}
                  sizes="112px"
                  className="h-auto w-auto object-contain"
                />
              </Link>

              <div className="min-w-0">
                <h2 className="font-heading text-lg leading-tight sm:text-[1.45rem]" style={{ color: COLORS.dark }}>
                  {text.title}
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-xl text-[13px] leading-6" style={{ color: COLORS.mid }}>
              {text.description}
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[0.9rem] p-3" style={GLASS.card}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                  {text.contact}
                </p>
                <p className="mt-1.5 text-[13px] leading-6" style={{ color: COLORS.mid }}>
                  {company.address}
                </p>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-[0.85rem] px-3 py-2 text-[12px] font-semibold tracking-[0.04em] transition-all hover:-translate-y-0.5"
                  style={{ ...GLASS.card, color: COLORS.dark }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{text.openMap}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-[0.9rem] p-3" style={GLASS.card}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                  {text.language}
                </p>
                <div className="mt-2.5 inline-flex rounded-[0.85rem] p-1" style={GLASS.stats}>
                  <Link
                    href={toTH}
                    hrefLang="th"
                    className="rounded-[0.7rem] px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors"
                    style={!isEN ? NAV_ACTIVE_PILL_STYLE : { color: COLORS.brandMuted }}
                  >
                    TH
                  </Link>
                  <Link
                    href={toEN}
                    hrefLang="en"
                    className="rounded-[0.7rem] px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors"
                    style={isEN ? NAV_ACTIVE_PILL_STYLE : { color: COLORS.brandMuted }}
                  >
                    EN
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[0.95rem] p-4" style={GLASS.secondary}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
              {text.navigation}
            </p>
            <nav aria-label="Footer navigation" className="mt-3">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="group flex items-center justify-between rounded-[0.85rem] px-3 py-2.5 text-[13px] transition-all"
                      style={{ ...GLASS.card, color: COLORS.mid }}
                    >
                      <span>{item.label[locale]}</span>
                      <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ color: COLORS.brandNavy }}>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="rounded-[0.95rem] p-4" style={GLASS.secondary}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                {text.salesDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number}`}
                    className="block rounded-[0.85rem] px-3 py-2 transition-all hover:-translate-y-0.5"
                    style={GLASS.card}
                  >
                    {phone.label && (
                      <span className="block text-[11px] uppercase tracking-[0.12em]" style={{ color: COLORS.hint }}>
                        {phone.label}
                      </span>
                    )}
                    <span className="mt-1 block text-[13px] font-semibold" style={{ color: COLORS.dark }}>
                      {phone.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                {text.emailDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.email.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block rounded-[0.85rem] px-3 py-2.5 text-[13px] transition-all hover:-translate-y-0.5"
                    style={{ ...GLASS.card, color: COLORS.mid }}
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {company.socials.length > 0 && (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                  {text.connect}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.socials.map((social) => (
                    <a
                      key={`${social.type}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[0.85rem] px-3 py-2 text-[13px] transition-all hover:-translate-y-0.5"
                      style={{ ...GLASS.card, color: COLORS.mid }}
                    >
                      {social.icon && (
                        <Image
                          src={social.icon.src}
                          alt={social.icon.alt}
                          width={16}
                          height={16}
                          sizes="16px"
                          className="h-4 w-4 object-contain"
                        />
                      )}
                      <span>{formatSocialLabel(social.type)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t pt-4 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: SECTION_BORDER, color: COLORS.soft }}>
          <p>
            © {new Date().getFullYear()} {company.name}. {text.copyright}
          </p>
          <p className="tracking-[0.14em] uppercase" style={{ color: COLORS.brandMuted }}>
            Cosmetic Packaging • OEM • ODM
          </p>
        </div>
      </div>
    </footer>
  )
}
