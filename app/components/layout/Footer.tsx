'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, MapPin } from 'lucide-react'

import { CompanyView } from '@/app/lib/types/view'

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
      className="relative overflow-hidden border-t border-[rgba(205,222,241,0.78)] bg-[linear-gradient(180deg,#fefcff_0%,#f2fbff_38%,#fff1f6_100%)]"
      aria-label="Site footer"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(46,207,196,0.65),rgba(248,167,184,0.55),transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#2ecfc4]/12 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-10 h-48 w-48 rounded-full bg-[#f8a7b8]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#cab8f2]/14 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 pb-5 pt-7 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.78fr_0.9fr]">
          <section className="glass-panel rounded-[1.5rem] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {text.eyebrow}
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <Link
                href={withLocale('/')}
                className="inline-flex rounded-[1rem] border border-[rgba(209,225,241,0.88)] bg-white/88 px-2.5 py-2 transition-transform hover:-translate-y-0.5"
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
                <h2 className="font-heading text-lg leading-tight text-[var(--color-ink)] sm:text-[1.45rem]">
                  {text.title}
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[var(--color-ink-soft)]">
              {text.description}
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1rem] border border-[rgba(209,225,241,0.78)] bg-[linear-gradient(145deg,rgba(236,251,255,0.9),rgba(255,243,247,0.86))] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {text.contact}
                </p>
                <p className="mt-1.5 text-[13px] leading-6 text-[var(--color-ink-soft)]">
                  {company.address}
                </p>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(205,222,241,0.86)] bg-white/88 px-3 py-2 text-[12px] font-semibold tracking-[0.04em] text-[var(--color-ink)] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:text-[#0F766E]"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{text.openMap}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-[1rem] border border-[rgba(159,210,246,0.45)] bg-[linear-gradient(145deg,#7dbdf0,#baacf1)] p-3 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/88">
                  {text.language}
                </p>
                <div className="mt-2.5 inline-flex rounded-full border border-white/10 bg-white/10 p-1">
                  <Link
                    href={toTH}
                    hrefLang="th"
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors ${
                      !isEN
                        ? 'bg-white text-[var(--color-ink)]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    TH
                  </Link>
                  <Link
                    href={toEN}
                    hrefLang="en"
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors ${
                      isEN
                        ? 'bg-white text-[var(--color-ink)]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-[1.5rem] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {text.navigation}
            </p>
            <nav aria-label="Footer navigation" className="mt-3">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="group flex items-center justify-between rounded-[0.9rem] border border-transparent px-3 py-2.5 text-[13px] text-[var(--color-ink-soft)] transition-all hover:border-[rgba(205,222,241,0.82)] hover:bg-white hover:text-[var(--color-ink)]"
                    >
                      <span>{item.label[locale]}</span>
                      <span className="text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="glass-panel rounded-[1.5rem] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {text.salesDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number}`}
                    className="block rounded-[0.95rem] border border-[rgba(209,225,241,0.82)] bg-white/88 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-[#14B8A6]"
                  >
                    {phone.label && (
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#7f90ab]">
                        {phone.label}
                      </span>
                    )}
                    <span className="mt-1 block text-[13px] font-semibold text-[var(--color-ink)]">
                      {phone.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {text.emailDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.email.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block rounded-[0.95rem] border border-[rgba(209,225,241,0.82)] bg-white/88 px-3 py-2.5 text-[13px] text-[var(--color-ink-soft)] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:text-[var(--color-ink)]"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {company.socials.length > 0 && (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {text.connect}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.socials.map((social) => (
                    <a
                      key={`${social.type}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(209,225,241,0.82)] bg-white/88 px-3 py-2 text-[13px] text-[var(--color-ink-soft)] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:text-[var(--color-ink)]"
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

        <div className="mt-5 flex flex-col gap-2 border-t border-white/70 pt-4 text-[11px] text-[#6f8099] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. {text.copyright}
          </p>
          <p className="tracking-[0.14em] uppercase text-[#8394ab]">
            Cosmetic Packaging • OEM • ODM
          </p>
        </div>
      </div>
    </footer>
  )
}
