'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    salesDesk: 'Sales Desk',
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
    salesDesk: 'Sales Desk',
    emailDesk: 'Email',
    copyright: 'All rights reserved.',
  },
} as const

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
      className="relative overflow-hidden border-t border-[#D9D3CB] bg-[linear-gradient(180deg,#fcfbf9_0%,#f4efe9_100%)]"
      aria-label="Site footer"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,184,166,0.6),transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#14B8A6]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#1A2535]/8 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 pb-5 pt-7 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.78fr_0.9fr]">
          <section className="rounded-[1.25rem] border border-white/70 bg-white/75 p-4 shadow-[0_10px_28px_rgba(26,37,53,0.06)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6]">
              {text.eyebrow}
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <Link
                href={withLocale('/')}
                className="inline-flex rounded-[1rem] border border-[#EAE3DB] bg-white px-2.5 py-2 transition-transform hover:-translate-y-0.5"
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
                <h2 className="font-heading text-lg leading-tight text-[#1A2535] sm:text-[1.45rem]">
                  {text.title}
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-xl text-[12px] leading-5 text-[#6B625C]">
              {text.description}
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1rem] border border-[#E9E2D9] bg-[#F8F4EF] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#14B8A6]">
                  {text.contact}
                </p>
                <p className="mt-1.5 text-[12px] leading-5 text-[#5F5650]">
                  {company.address}
                </p>
              </div>

              <div className="rounded-[1rem] border border-[#E9E2D9] bg-[#1A2535] p-3 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7DE3D8]">
                  {text.language}
                </p>
                <div className="mt-2.5 inline-flex rounded-full border border-white/10 bg-white/10 p-1">
                  <Link
                    href={toTH}
                    hrefLang="th"
                    className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-colors ${
                      !isEN
                        ? 'bg-white text-[#1A2535]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    TH
                  </Link>
                  <Link
                    href={toEN}
                    hrefLang="en"
                    className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-colors ${
                      isEN
                        ? 'bg-white text-[#1A2535]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.25rem] border border-white/70 bg-white/60 p-4 shadow-[0_10px_28px_rgba(26,37,53,0.05)] backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#14B8A6]">
              {text.navigation}
            </p>
            <nav aria-label="Footer navigation" className="mt-3">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="group flex items-center justify-between rounded-[0.9rem] border border-transparent px-3 py-2 text-[12px] text-[#5D544E] transition-all hover:border-[#D9D3CB] hover:bg-white hover:text-[#1A2535]"
                    >
                      <span>{item.label[locale]}</span>
                      <span className="text-[#14B8A6] opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section className="rounded-[1.25rem] border border-white/70 bg-white/60 p-4 shadow-[0_10px_28px_rgba(26,37,53,0.05)] backdrop-blur">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#14B8A6]">
                {text.salesDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number}`}
                    className="block rounded-[0.95rem] border border-[#E9E2D9] bg-white px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-[#14B8A6]"
                  >
                    {phone.label && (
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-[#A7988C]">
                        {phone.label}
                      </span>
                    )}
                    <span className="mt-1 block text-[12px] font-semibold text-[#1A2535]">
                      {phone.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#14B8A6]">
                {text.emailDesk}
              </p>
              <div className="mt-3 space-y-2">
                {company.email.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block rounded-[0.95rem] border border-[#E9E2D9] bg-white px-3 py-2 text-[12px] text-[#5D544E] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:text-[#1A2535]"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {company.socials.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#14B8A6]">
                  {text.connect}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.socials.map((social) => (
                    <a
                      key={`${social.type}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#E9E2D9] bg-white px-3 py-1.5 text-[12px] text-[#5D544E] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:text-[#1A2535]"
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

        <div className="mt-5 flex flex-col gap-2 border-t border-white/70 pt-4 text-[10px] text-[#9A8F86] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. {text.copyright}
          </p>
          <p className="tracking-[0.18em] uppercase text-[#B2A69B]">
            Cosmetic Packaging • OEM • ODM
          </p>
        </div>
      </div>
    </footer>
  )
}
