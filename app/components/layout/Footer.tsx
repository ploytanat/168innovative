'use client'

import { ExternalLink, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, ShoppingBag, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { HOME } from '@/app/components/sections/home-theme'
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
    tagline: 'บรรจุภัณฑ์เครื่องสำอาง · OEM · ODM',
    description: 'บรรจุภัณฑ์เครื่องสำอางจากแหล่งผลิตโดยตรง ทำงานง่ายขึ้น ตอบกลับไวขึ้น และติดต่อทีมขายได้ตรงกว่าเดิม',
    quote: 'ขอใบเสนอราคา',
    navigation: 'เมนู', contact: 'ติดต่อ', connect: 'โซเชียล', language: 'ภาษา',
    rights: 'สงวนลิขสิทธิ์',
  },
  en: {
    tagline: 'Cosmetic Packaging · OEM · ODM',
    description: 'Factory-sourced cosmetic packaging with a cleaner process, faster response, and direct contact with sales.',
    quote: 'Request a quote',
    navigation: 'Menu', contact: 'Contact', connect: 'Connect', language: 'Language',
    rights: 'All rights reserved.',
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
    <footer style={{ background: HOME.mist, borderTop: `1px solid ${HOME.line}`, color: HOME.inkMid }} aria-label="Site footer">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:py-16">
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr] lg:gap-x-16">

          <div>
            <Link href={withLocale('/')} className="inline-block">
              <Image src={company.logo.src} alt={company.logo.alt} width={140} height={45} className="h-12 w-auto" />
            </Link>
            <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: HOME.ink }}>
              {text.tagline}
            </p>
            <p className="mt-3 max-w-sm text-[15px] leading-[1.75]" style={{ color: HOME.inkMid }}>
              {text.description}
            </p>
            <Link href={withLocale('/contact')}
              className="home-btn home-btn-accent mt-6 inline-flex items-center rounded-[5px] px-5 py-2.5 text-[14px] font-bold">
              {text.quote} →
            </Link>
          </div>

          <div>
            <h3 className="text-[14px] font-bold uppercase tracking-[0.06em]" style={{ color: HOME.ink }}>
              {text.navigation}
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV.map(item => (
                <li key={item.href}>
                  <Link href={withLocale(item.href)} className="text-[15px] transition-colors hover:opacity-70" style={{ color: HOME.inkMid }}>
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[14px] font-bold uppercase tracking-[0.06em]" style={{ color: HOME.ink }}>
              {text.contact}
            </h3>
            <ul className="mt-5 space-y-4 text-[15px]" style={{ color: HOME.inkMid }}>
              {company.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer" className="leading-[1.55] hover:opacity-70">
                    {company.address}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </li>
              )}
              {company.phones.map(phone => (
                <li key={phone.number} className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={`tel:${phone.number.replace(/-/g, '')}`} className="hover:opacity-70">{phone.number}</a>
                </li>
              ))}
              {company.email.map(email => (
                <li key={email} className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={`mailto:${email}`} className="break-all hover:opacity-70">{email}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {company.socials.length > 0 && (
              <>
                <h3 className="text-[14px] font-bold uppercase tracking-[0.06em]" style={{ color: HOME.ink }}>
                  {text.connect}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {company.socials.map(s => {
                    const Icon = SOCIAL_ICONS[s.type] ?? MessageCircle
                    return (
                      <a key={s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.type}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:opacity-70"
                        style={{ background: HOME.surface, border: `1px solid ${HOME.line}`, color: HOME.ink }}>
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              </>
            )}

            <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: HOME.inkSoft }}>
              {text.language}
            </p>
            <div className="mt-3 inline-flex overflow-hidden rounded-full" style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}>
              <Link href={toTH} hrefLang="th" className="px-3.5 py-1.5 text-[13px] font-bold transition-colors"
                style={{ background: !isEN ? HOME.ink : 'transparent', color: !isEN ? HOME.surface : HOME.inkMid }}>
                TH
              </Link>
              <Link href={toEN} hrefLang="en" className="px-3.5 py-1.5 text-[13px] font-bold transition-colors"
                style={{ background: isEN ? HOME.ink : 'transparent', color: isEN ? HOME.surface : HOME.inkMid }}>
                EN
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t pt-7 text-[13px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: HOME.line, color: HOME.inkSoft }}>
          <p>© {new Date().getFullYear()} {company.name}. {text.rights}</p>
          <p className="uppercase tracking-[0.12em]">Cosmetic Packaging • OEM • ODM</p>
        </div>
      </div>
    </footer>
  )
}
