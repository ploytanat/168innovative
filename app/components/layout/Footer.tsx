// components/Footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
  locale: 'th' | 'en'
}

export default function Footer({ company, locale }: FooterProps) {
  const isEN = locale === 'en'

  const withLocale = (path: string) => {
    return isEN ? (path === '/' ? '/en' : `/en${path}`) : path
  }

  const navigation = [
    {
      href: '/',
      label: isEN ? 'Home' : 'หน้าหลัก',
    },
    {
      href: '/categories',
      label: isEN ? 'Products' : 'หมวดหมู่สินค้า',
    },
    {
      href: '/about',
      label: isEN ? 'About Us' : 'เกี่ยวกับเรา',
    },
    {
      href: '/contact',
      label: isEN ? 'Contact' : 'ติดต่อเรา',
    },
  ]

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">

        {/* ===== Main Grid ===== */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          {/* ===== Brand ===== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link
              href={withLocale('/')}
              className="inline-block hover:opacity-80 transition"
            >
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              {company.address}
            </p>

            {/* Social */}
            <div className="flex gap-3 pt-2">
              {company.socials.map((s, index) => (
                <a
                  key={`${s.type}-${index}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg
                    bg-white border border-slate-200
                    hover:border-[#1e3a5f]
                    transition
                  "
                >

                  {

                    /*
                       <Image
                    src={s.icon.src}
                    alt={s.icon.alt}
                    width={18}
                    height={18}
                    className="opacity-70"
                  />
                    */
                  }
               
                </a>
              ))}
            </div>
          </div>

          {/* ===== Navigation + Contact ===== */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6">
                {isEN ? 'Navigation' : 'เมนูหลัก'}
              </h4>
              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="text-sm text-slate-500 hover:text-[#1e3a5f] transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phones */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6">
                {isEN ? 'Phone' : 'เบอร์โทรศัพท์'}
              </h4>
              <div className="space-y-4">
                {company.phones.map((p) => (
                  <a
                    key={p.number}
                    href={`tel:${p.number}`}
                    className="block text-sm text-slate-500 hover:text-[#1e3a5f] transition"
                  >
                    {p.label && (
                      <span className="block text-[10px] uppercase text-slate-400">
                        {p.label}
                      </span>
                    )}
                    {p.number}
                  </a>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-6">
                Email
              </h4>
              <div className="space-y-4">
                {company.email.map((e, index) => (
                  <a
                    key={`${e}-${index}`}
                    href={`mailto:${e}`}
                    className="block text-sm text-slate-500 hover:text-[#1e3a5f] transition break-all"
                  >
                    {e}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>

          <Link
            href="#top"
            className="text-xs font-semibold text-slate-500 hover:text-[#1e3a5f] transition"
          >
            {isEN ? 'Back to top ↑' : 'กลับขึ้นด้านบน ↑'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
