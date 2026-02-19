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

  /* ---------------- Helpers ---------------- */

  const withLocale = (path: string) => {
    if (isEN) {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
  }

  const switchLanguagePath = () => {
    return isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : `/en${pathname === '/' ? '' : pathname}`
  }

  /* ---------------- Navigation ---------------- */

  const navigation = [
    { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
    { href: '/categories', label: { th: 'หมวดหมู่สินค้า', en: 'Products' } },
    { href: '/articles', label: { th: 'บทความของเรา', en: 'Articles' } },
    { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About Us' } },
    { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
  ]

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Logo + Address */}
        <div className="space-y-4">
          <Link href={withLocale('/')}>
            <Image
              src={company.logo.src}
              alt={company.logo.alt}
              width={160}
              height={50}
              className="object-contain"
            />
          </Link>

          <p className="text-sm text-gray-600 leading-relaxed">
            {company.address}
          </p>

          {/* Language Switch */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href={switchLanguagePath()}
              className="text-xs font-semibold text-gray-700 hover:text-black transition"
            >
              {isEN ? 'TH' : 'EN'}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-5 text-gray-400">
            {locale === 'en' ? 'Navigation' : 'เมนูหลัก'}
          </h4>

          <ul className="space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  className="text-gray-600 hover:text-black transition"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-5 text-gray-400">
            {locale === 'en' ? 'Contact' : 'ติดต่อเรา'}
          </h4>

          <div className="space-y-3 text-sm text-gray-600">
            {company.phones.map((p) => (
              <a key={p.number} href={`tel:${p.number}`} className="block hover:text-black transition">
                {p.number}
              </a>
            ))}

            {company.email.map((e, i) => (
              <a key={i} href={`mailto:${e}`} className="block hover:text-black transition break-all">
                {e}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  )
}
