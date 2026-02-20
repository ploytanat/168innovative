'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
}

export default function Footer({ company }: FooterProps) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')
  const locale = isEN ? 'en' : 'th'

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const toTH = pathname.startsWith('/en')
    ? pathname.replace(/^\/en/, '') || '/'
    : pathname

  const toEN = pathname.startsWith('/en')
    ? pathname
    : `/en${pathname === '/' ? '' : pathname}`

  const navigation = [
    { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
    { href: '/categories', label: { th: 'หมวดหมู่สินค้า', en: 'Products' } },
    { href: '/articles', label: { th: 'บทความของเรา', en: 'Articles' } },
    { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About Us' } },
    { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    image: company.logo.src,
    url: 'https://168innovative.co.th',
    telephone: company.phones.map(p => p.number),
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '89/269 ซอย เทียนทะเล 20',
      addressLocality: 'แขวงแสมดำ เขตบางขุนเทียน',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10150',
      addressCountry: 'TH',
    },
    description: 'บริการรับนำเข้าและจำหน่ายบรรจุภัณฑ์ OEM ครบวงจร',
  }

  const activeLang =
    "bg-[#F0FDFA] text-[#14B8A6] border border-[#14B8A6]"
  const inactiveLang =
    "text-[#94A3B8] border border-transparent"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <footer
        className="relative w-full overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC] border-t border-[#E5E7EB]"
        aria-label="Site footer"
      >
        {/* Accent top line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d5effd] to-transparent" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#14B8A611] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20">

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

            {/* Brand */}
            <div className="flex flex-col gap-5 lg:col-span-4">
              <Link href={withLocale('/')} className="inline-block transition hover:opacity-75">
                <Image
                  src={company.logo.src}
                  alt={company.logo.alt}
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </Link>

              <address className="not-italic text-sm leading-relaxed text-[#5A6A7E]">
                {isEN
                  ? '89/269 Soi Thian Thale 20, Samae Dam, Bang Khun Thian, Bangkok 10150'
                  : '89/269 ซอย เทียนทะเล 20 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150'}
              </address>

              {/* Language switch */}
              <div className="flex items-center gap-2">
                <Link
                  href={toTH}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isEN ? activeLang : inactiveLang}`}
                  hrefLang="th"
                >
                  TH
                </Link>

                <span className="text-[#CBD5E1] text-xs">|</span>

                <Link
                  href={toEN}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isEN ? activeLang : inactiveLang}`}
                  hrefLang="en"
                >
                  EN
                </Link>
              </div>
            </div>

            {/* Nav / Phone / Email */}
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:col-span-8">

              {/* Navigation */}
              <nav aria-label="Footer navigation">
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
                  {isEN ? 'Navigation' : 'เมนูหลัก'}
                </h4>
                <ul className="space-y-3.5">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={withLocale(item.href)}
                        className="text-sm text-[#5A6A7E] transition-colors hover:text-[#14B8A6]"
                      >
                        {item.label[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Phone */}
              <div>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
                  {isEN ? 'Phone' : 'เบอร์โทรศัพท์'}
                </h4>
                <address className="not-italic space-y-4">
                  {company.phones.map((p) => (
                    <a
                      key={p.number}
                      href={`tel:${p.number}`}
                      className="block text-sm text-[#5A6A7E] transition-colors hover:text-[#14B8A6]"
                    >
                      {p.label && (
                        <span className="mb-0.5 block text-[10px] uppercase text-[#94A3B8]">
                          {p.label}
                        </span>
                      )}
                      {p.number}
                    </a>
                  ))}
                </address>
              </div>

              {/* Email */}
              <div>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
                  Email
                </h4>
                <address className="not-italic space-y-4">
                  {company.email.map((e, i) => (
                    <a
                      key={i}
                      href={`mailto:${e}`}
                      className="block break-all text-sm text-[#5A6A7E] transition-colors hover:text-[#14B8A6]"
                    >
                      {e}
                    </a>
                  ))}
                </address>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-8 md:flex-row">
            <p className="text-xs text-[#94A3B8]">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>

            <Link
              href="#top"
              className="text-xs font-semibold text-[#94A3B8] transition-colors hover:text-[#14B8A6]"
            >
              {isEN ? 'Back to top ↑' : 'กลับขึ้นด้านบน ↑'}
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}