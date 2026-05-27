'use client'

import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { DISPLAY_HEADING, HOME } from '@/app/components/sections/home-theme'
import { CompanyView } from '@/app/lib/types/view'

const NAV = [
  { href: '/',           label: { th: 'หน้าหลัก',     en: 'Home' } },
  { href: '/categories', label: { th: 'หมวดสินค้า',   en: 'Products' } },
  { href: '/articles',   label: { th: 'บทความ',       en: 'Articles' } },
  { href: '/about',      label: { th: 'เกี่ยวกับเรา', en: 'About Us' } },
  { href: '/contact',    label: { th: 'ติดต่อเรา',    en: 'Contact' } },
]

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  line: MessageCircle,
  instagram: Instagram,
  shopee: ShoppingBag,
}

const COPY = {
  th: {
    eyebrow:     'บรรจุภัณฑ์เครื่องสำอาง',
    headline:    'บรรจุภัณฑ์จากโรงงานตรง พูดคุยกับทีมขายได้ทันที',
    quote:       'ขอใบเสนอราคา',
    locate:      'ดูแผนที่',
    language:    'ภาษา',
    rights:      'สงวนลิขสิทธิ์',
    ribbon:      'บรรจุภัณฑ์เครื่องสำอาง · OEM · ODM',
  },
  en: {
    eyebrow:     'Cosmetic Packaging',
    headline:    'Factory-direct packaging, with sales you can actually reach.',
    quote:       'Request a quote',
    locate:      'View on map',
    language:    'Language',
    rights:      'All rights reserved.',
    ribbon:      'Cosmetic Packaging · OEM · ODM',
  },
} as const

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/168+INNOVATIVE/@13.6189889,100.4238107,16.58z/data=!4m15!1m8!3m7!1s0x30e2bcb939ac5e39:0xa5d1f39039bd8382!2zODkg4LiL4Lit4LiiIOC5gOC4l-C4teC4ouC4meC4l-C4sOC5gOC4pSAyMCDguYHguILguKfguIfguYHguKrguKHguJTguLMg4LmA4LiC4LiV4Lia4Liy4LiH4LiC4Li44LiZ4LmA4LiX4Li14Lii4LiZIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDE1MA!3b1!8m2!3d13.620821!4d100.4236494!16s%2Fg%2F11sp98b_dz!3m5!1s0x30e2bd007a6774dd:0xa3b3383a2a290b44!8m2!3d13.6174254!4d100.4232667!16s%2Fg%2F11w4sb_jqj?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D'

export default function Footer({ company }: { company: CompanyView }) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'
  const text = COPY[locale]

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const toTH = isEN ? (pathname.replace(/^\/en/, '') || '/') : pathname
  const toEN = isEN ? pathname : `/en${pathname === '/' ? '' : pathname}`

  return (
    <footer
      style={{ background: HOME.cream, color: HOME.inkMid }}
      aria-label="Site footer"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:py-20">

        {/* Masthead band */}
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-14">
          <div>
            <Link href={withLocale('/')} className="inline-block">
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={180}
                height={56}
                className="h-14 w-auto"
              />
            </Link>

            <p
              className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: HOME.mintInk }}
            >
              — {text.eyebrow}
            </p>

            <h2
              className={`${DISPLAY_HEADING} mt-3 max-w-[28ch] text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] font-bold normal-case`}
              style={{ color: HOME.ink }}
            >
              {text.headline}
            </h2>
          </div>

          <div className="flex md:justify-end">
            <Link
              href={withLocale('/contact')}
              className="home-btn home-btn-accent group inline-flex items-center gap-2 rounded-[5px] px-6 py-3.5 text-[14px] font-bold tracking-[0.04em]"
            >
              {text.quote}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Rule + horizontal nav */}
        <div
          className="mt-12 border-t pt-7 sm:mt-14"
          style={{ borderColor: HOME.line }}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-5">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 sm:gap-x-9">
                {NAV.map(item => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="text-[14px] font-semibold transition-colors hover:opacity-100"
                      style={{ color: HOME.ink }}
                    >
                      {item.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className="inline-flex overflow-hidden rounded-full text-[12px] font-bold tracking-[0.08em]"
              style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
            >
              <Link
                href={toTH}
                hrefLang="th"
                className="px-3.5 py-1.5 transition-colors"
                style={{ background: !isEN ? HOME.ink : 'transparent', color: !isEN ? HOME.surface : HOME.inkMid }}
              >
                TH
              </Link>
              <Link
                href={toEN}
                hrefLang="en"
                className="px-3.5 py-1.5 transition-colors"
                style={{ background: isEN ? HOME.ink : 'transparent', color: isEN ? HOME.surface : HOME.inkMid }}
              >
                EN
              </Link>
            </div>
          </div>
        </div>

        {/* Inline contact + social row */}
        <div
          className="mt-7 border-t pt-7"
          style={{ borderColor: HOME.line }}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
            <ul className="flex flex-col gap-x-8 gap-y-2.5 text-[14px] sm:flex-row sm:flex-wrap sm:items-center" style={{ color: HOME.inkMid }}>
              {company.address && (
                <li>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 leading-[1.55] hover:opacity-70"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: HOME.mintInk }} />
                    <span className="max-w-[44ch]">{company.address}</span>
                  </a>
                </li>
              )}

              {company.phones.map(phone => (
                <li key={phone.number}>
                  <a
                    href={`tel:${phone.number.replace(/-/g, '')}`}
                    className="inline-flex items-center gap-2 hover:opacity-70"
                  >
                    <Phone className="h-4 w-4 shrink-0" style={{ color: HOME.mintInk }} />
                    {phone.number}
                  </a>
                </li>
              ))}

              {company.email.map(email => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 break-all hover:opacity-70"
                  >
                    <Mail className="h-4 w-4 shrink-0" style={{ color: HOME.mintInk }} />
                    {email}
                  </a>
                </li>
              ))}
            </ul>

            {company.socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {company.socials.map(s => {
                  const Icon = SOCIAL_ICONS[s.type] ?? MessageCircle
                  return (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.type}
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:opacity-80"
                      style={{ background: HOME.surface, border: `1px solid ${HOME.line}`, color: HOME.ink }}
                    >
                      <Icon className="h-[15px] w-[15px]" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-10 flex flex-col gap-2 border-t pt-6 text-[12px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: HOME.line, color: HOME.inkSoft }}
        >
          <p>© {new Date().getFullYear()} {company.name}. {text.rights}</p>
          <p className="uppercase tracking-[0.16em]">{text.ribbon}</p>
        </div>

      </div>
    </footer>
  )
}
