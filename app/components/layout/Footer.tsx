'use client'

import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, ShoppingBag, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, type ReactNode } from 'react'

import { CompanyView } from '@/app/lib/types/view'

// Sonar-style palette — inverted (light)
const D = {
  bg: '#ffffff',
  text: '#0a0c10',
  mid: '#5a6172',
  soft: '#9aa0ac',
  line: 'rgba(10,12,16,0.09)',
  lineStrong: 'rgba(10,12,16,0.18)',
  accent: '#2e7d32',
  surface: 'rgba(10,12,16,0.03)',
} as const

const NAV = [
  { href: '/',           label: { th: 'หน้าหลัก',     en: 'Home' } },
  { href: '/categories', label: { th: 'หมวดสินค้า',   en: 'Products' } },
  { href: '/articles',   label: { th: 'บทความ',       en: 'Articles' } },
  { href: '/about',      label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact',    label: { th: 'ติดต่อเรา',    en: 'Contact' } },
] as const

const SERVICES = [
  { href: '/categories', label: { th: 'รับผลิต OEM',         en: 'OEM Production' } },
  { href: '/categories', label: { th: 'ออกแบบ ODM',           en: 'ODM Development' } },
  { href: '/categories', label: { th: 'บรรจุภัณฑ์สำเร็จรูป',  en: 'Stock Packaging' } },
  { href: '/contact',    label: { th: 'จัดหาเฉพาะ',           en: 'Custom Sourcing' } },
] as const

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  line: MessageCircle,
  instagram: Instagram,
  shopee: ShoppingBag,
}

const COPY = {
  th: {
    company:     'บริษัท',
    services:    'บริการ',
    navigate:    'เมนู',
    reach:       'ติดต่อ',
    follow:      'ติดตาม',
    tagline:     'บรรจุภัณฑ์เครื่องสำอาง · OEM · ODM',
    location:    'กรุงเทพมหานคร, ประเทศไทย',
    quoteEyebrow: 'เริ่มต้นโปรเจกต์',
    quoteHeading: 'พร้อมเริ่มโปรเจกต์ของคุณหรือยัง',
    quoteCopy:    'ส่งบรีฟให้เรา ทีมขายตอบกลับภายใน 24 ชั่วโมง',
    quoteCta:     'ส่งบรีฟ',
    rights:       'สงวนลิขสิทธิ์',
  },
  en: {
    company:     'Company',
    services:    'Services',
    navigate:    'Navigate',
    reach:       'Reach',
    follow:      'Follow',
    tagline:     'Cosmetic Packaging · OEM · ODM',
    location:    'Bangkok, Thailand',
    quoteEyebrow: 'Start a project',
    quoteHeading: 'Ready to start your project?',
    quoteCopy:    'Send us a brief — our team replies within 24 hours.',
    quoteCta:     'Send a brief',
    rights:       'All Rights Reserved.',
  },
} as const

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/168+INNOVATIVE/@13.6189889,100.4238107,16.58z/data=!4m15!1m8!3m7!1s0x30e2bcb939ac5e39:0xa5d1f39039bd8382!2zODkg4LiL4Lit4LiiIOC5gOC4l-C4teC4ouC4meC4l-C4sOC5gOC4pSAyMCDguYHguILguKfguIfguYHguKrguKHguJTguLMg4LmA4LiC4LiV4Lia4Liy4LiH4LiC4Li44LiZ4LmA4LiX4Li14Lii4LiZIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDE1MA!3b1!8m2!3d13.620821!4d100.4236494!16s%2Fg%2F11sp98b_dz!3m5!1s0x30e2bd007a6774dd:0xa3b3383a2a290b44!8m2!3d13.6174254!4d100.4232667!16s%2Fg%2F11w4sb_jqj?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D'

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: D.mid }}>
      <span aria-hidden className="inline-block h-px w-5" style={{ background: D.lineStrong }} />
      {children}
    </p>
  )
}

function ArrowLink({ href, external, children, onClick }: { href: string; external?: boolean; children: ReactNode; onClick?: () => void }) {
  const linkClass = 'group flex items-center justify-between gap-3 py-2 text-[14.5px] transition-colors'
  const content = (
    <>
      <span className="transition-colors" style={{ color: D.text }}>
        {children}
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: D.soft }}
        strokeWidth={1.8}
      />
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={linkClass} onClick={onClick}>
        {content}
      </a>
    )
  }
  return (
    <Link href={href} className={linkClass} onClick={onClick}>
      {content}
    </Link>
  )
}

export default function Footer({ company }: { company: CompanyView }) {
  const pathname = usePathname()
  const router = useRouter()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'
  const text = COPY[locale]

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)

  const toggleLanguage = useCallback(() => {
    const next = isEN ? (pathname.replace(/^\/en/, '') || '/') : (pathname === '/' ? '/en' : `/en${pathname}`)
    router.push(next)
  }, [isEN, pathname, router])

  return (
    <footer style={{ background: D.bg, color: D.text }} aria-label="Site footer">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:py-20 lg:py-24">

        {/* Quote CTA strip */}
        <div
          className="border-b py-10 sm:py-12 lg:py-14"
          style={{ borderColor: D.line }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="md:max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: D.accent }}>
                — {text.quoteEyebrow}
              </p>
              <h2
                lang={locale}
                className="mt-3 text-[clamp(1.6rem,1.1rem+1.6vw,2.4rem)] font-bold leading-[1.18]"
                style={{ color: D.text, wordBreak: 'keep-all', textWrap: 'balance' }}
              >
                {text.quoteHeading}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.65]" style={{ color: D.mid }}>
                {text.quoteCopy}
              </p>
            </div>

            <Link
              href={withLocale('/contact')}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full px-7 py-4 text-[14px] font-bold tracking-[0.04em] transition-all"
              style={{ background: D.text, color: D.bg }}
            >
              {text.quoteCta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-14 grid gap-y-10 gap-x-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr] lg:gap-x-12">

          {/* Company — logo + meta */}
          <div>
            <Link
              href={withLocale('/')}
              className="inline-block"
              aria-label={company.name}
            >
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={320}
                height={104}
                priority={false}
                className="h-16 w-auto transition-opacity hover:opacity-80 sm:h-20 lg:h-[88px]"
              />
            </Link>
            <p className="mt-5 text-[14px] leading-[1.6]" style={{ color: D.mid }}>
              {text.tagline}
            </p>
            <p className="mt-1 text-[14px]" style={{ color: D.mid }}>
              {text.location}
            </p>
          </div>

          {/* Services */}
          <div>
            <SectionLabel>{text.services}</SectionLabel>
            <ul className="-mt-1" style={{ borderTop: `1px solid ${D.line}` }}>
              {SERVICES.map((s, i) => (
                <li key={i} style={{ borderBottom: `1px solid ${D.line}` }}>
                  <ArrowLink href={withLocale(s.href)}>
                    {s.label[locale]}
                  </ArrowLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigate */}
          <div>
            <SectionLabel>{text.navigate}</SectionLabel>
            <ul className="-mt-1" style={{ borderTop: `1px solid ${D.line}` }}>
              {NAV.map(item => (
                <li key={item.href} style={{ borderBottom: `1px solid ${D.line}` }}>
                  <ArrowLink href={withLocale(item.href)}>
                    {item.label[locale]}
                  </ArrowLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach */}
          <div>
            <SectionLabel>{text.reach}</SectionLabel>

            <ul className="space-y-3.5 text-[14px]" style={{ color: D.mid }}>
              {company.address && (
                <li>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2.5 transition-colors hover:text-black"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: D.accent }} strokeWidth={1.6} />
                    <span className="leading-[1.55]">{company.address}</span>
                  </a>
                </li>
              )}

              {company.phones.map(phone => (
                <li key={phone.number}>
                  <a
                    href={`tel:${phone.number.replace(/-/g, '')}`}
                    className="group flex items-center gap-2.5 transition-colors hover:text-black"
                  >
                    <Phone className="h-4 w-4 shrink-0" style={{ color: D.accent }} strokeWidth={1.6} />
                    <span>{phone.number}</span>
                  </a>
                </li>
              ))}

              {company.email.map(email => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center gap-2.5 transition-colors hover:text-black"
                  >
                    <Mail className="h-4 w-4 shrink-0" style={{ color: D.accent }} strokeWidth={1.6} />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Follow */}
            {company.socials.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: D.mid }}>
                  {text.follow}
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.socials.map(s => {
                    const Icon = SOCIAL_ICONS[s.type] ?? MessageCircle
                    return (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.type}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black hover:text-white"
                        style={{ background: D.surface, border: `1px solid ${D.line}`, color: D.text }}
                      >
                        <Icon className="h-[15px] w-[15px]" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Decorative wave */}
        <svg
          aria-hidden
          className="mt-16 w-full"
          height="32"
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
        >
          <path
            d="M0 16 Q 75 0, 150 16 T 300 16 T 450 16 T 600 16 T 750 16 T 900 16 T 1050 16 T 1200 16"
            fill="none"
            stroke={D.lineStrong}
            strokeWidth="1"
          />
        </svg>

        {/* Bottom strip */}
        <div
          className="mt-10 flex flex-col gap-4 border-t pt-6 text-[12px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: D.line, color: D.soft }}
        >
          <p>
            © {new Date().getFullYear()} {company.name}. {text.rights}
          </p>

          <div className="flex items-center gap-5">
            <span className="tracking-[0.16em] uppercase" style={{ color: D.mid }}>
              {text.tagline}
            </span>

            <FooterLangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>
        </div>

      </div>
    </footer>
  )
}

function FooterLangToggle({ isEN, onToggle }: { isEN: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEN}
      aria-label={isEN ? 'Switch language to Thai' : 'Switch language to English'}
      onClick={onToggle}
      className="group relative inline-flex h-9 w-[72px] shrink-0 items-center rounded-full p-1 text-[11px] font-bold tracking-[0.08em] transition-colors"
      style={{ background: D.surface, border: `1px solid ${D.line}` }}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: D.text,
          transform: isEN ? 'translateX(100%)' : 'translateX(0)',
          boxShadow: '0 1px 2px rgba(20,22,28,0.18)',
        }}
      />
      <span
        aria-hidden
        className="relative z-10 flex w-1/2 items-center justify-center transition-colors duration-200"
        style={{ color: !isEN ? D.bg : D.soft }}
      >
        TH
      </span>
      <span
        aria-hidden
        className="relative z-10 flex w-1/2 items-center justify-center transition-colors duration-200"
        style={{ color: isEN ? D.bg : D.soft }}
      >
        EN
      </span>
    </button>
  )
}
