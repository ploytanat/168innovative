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
  
  return (
    <>
      <footer
        className="w-full bg-[#ffffff] border-t border-[#E8E4DF]"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-7xl px-8 pt-16 pb-10">

          {/* Top section */}
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">

            {/* Brand */}
            <div className="flex flex-col gap-5 lg:col-span-4">
              <Link href={withLocale('/')} className="inline-block w-fit transition-opacity hover:opacity-60">
                <Image
                  src={company.logo.src}
                  alt={company.logo.alt}
                  width={130}
                  height={44}
                  className="object-contain"
                />
              </Link>

              <p className="text-xs leading-relaxed text-[#A89F96] max-w-[240px]">
                {isEN
                  ? '89/269 Soi Thian Thale 20, Samae Dam, Bang Khun Thian, Bangkok 10150'
                  : '89/269 ซอย เทียนทะเล 20 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150'}
              </p>

              {/* Language switch */}
              <div className="flex items-center gap-3 mt-1">
                <Link
                  href={toTH}
                  hrefLang="th"
                  className={`text-xs font-medium tracking-widest transition-colors ${
                    !isEN ? 'text-[#14B8A6]' : 'text-[#C4BCB4] hover:text-[#8C7F76]'
                  }`}
                >
                  TH
                </Link>
                <span className="text-[#D8D2CC] text-xs">·</span>
                <Link
                  href={toEN}
                  hrefLang="en"
                  className={`text-xs font-medium tracking-widest transition-colors ${
                    isEN ? 'text-[#14B8A6]' : 'text-[#C4BCB4] hover:text-[#8C7F76]'
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:col-span-8">

              {/* Navigation */}
              <nav aria-label="Footer navigation">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14B8A6]">
                  {isEN ? 'Navigation' : 'เมนู'}
                </p>
                <ul className="space-y-3">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={withLocale(item.href)}
                        className="text-sm text-[#7A6F68] transition-colors hover:text-[#14B8A6]"
                      >
                        {item.label[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Phone */}
              <div>
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14B8A6]">
                  {isEN ? 'Phone' : 'โทรศัพท์'}
                </p>
                <ul className="space-y-3">
                  {company.phones.map((p) => (
                    <li key={p.number}>
                      <a
                        href={`tel:${p.number}`}
                        className="block text-sm text-[#7A6F68] transition-colors hover:text-[#14B8A6]"
                      >
                        {p.label && (
                          <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-[#B8AFA8]">
                            {p.label}
                          </span>
                        )}
                        {p.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email */}
              <div>
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#14B8A6]">
                  Email
                </p>
                <ul className="space-y-3">
                  {company.email.map((e, i) => (
                    <li key={i}>
                      <a
                        href={`mailto:${e}`}
                        className="block break-all text-sm text-[#7A6F68] transition-colors hover:text-[#14B8A6]"
                      >
                        {e}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-14 h-px bg-[#E8E4DF]" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-[#C4BCB4]">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>
           
          </div>

        </div>
      </footer>
    </>
  )
}