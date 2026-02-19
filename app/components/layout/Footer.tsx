'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
  locale: 'th' | 'en'
}

export default function Footer({ company, locale }: FooterProps) {
  const pathname = usePathname()
  const isEN = locale === 'en'

  const withLocale = (path: string) => {
    return isEN ? (path === '/' ? '/en' : `/en${path}`) : path
  }

  // ── Language switcher ──
  // /en/categories → /categories  |  /categories → /en/categories
  const switchToTH = () => {
    const newPath = pathname.startsWith('/en')
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname
    return newPath
  }

  const switchToEN = () => {
    const newPath = pathname.startsWith('/en')
      ? pathname
      : `/en${pathname === '/' ? '' : pathname}`
    return newPath
  }

  const navigation = [
    { href: '/', label: isEN ? 'Home' : 'หน้าหลัก' },
    { href: '/categories', label: isEN ? 'Products' : 'หมวดหมู่สินค้า' },
    { href: '/articles', label: isEN ? 'Articles' : 'บทความของเรา' },
    { href: '/about', label: isEN ? 'About Us' : 'เกี่ยวกับเรา' },
    { href: '/contact', label: isEN ? 'Contact' : 'ติดต่อเรา' },
  ]

  return (
    <footer className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #fdf8f8)',
        borderTop: '1px solid rgba(212,160,160,0.2)',
      }}
    >
      {/* ── Rose-gold shimmer top line ── */}
      <div
        className="absolute top-0 inset-x-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(to right, transparent 5%, #e8c4b8 30%, #d4a0a0 50%, #e8c4b8 70%, transparent 95%)',
        }}
      />

      {/* ── Ambient blush orb ── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255,182,193,0.5), transparent)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          {/* ── Brand col ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href={withLocale('/')} className="inline-block hover:opacity-75 transition">
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>

            <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#9e8080' }}>
              {company.address}
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              {company.socials.map((s, index) => (
                <a
                  key={`${s.type}-${index}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(212,160,160,0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,160,0.6)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,240,242,0.9)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,160,0.25)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.8)'
                  }}
                >
                  {/* icon placeholder */}
                </a>
              ))}
            </div>

            {/* ── Language switcher ── */}
            <div className="flex items-center gap-1 pt-1">
              <Link
                href={switchToTH()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={!isEN ? {
                  background: 'rgba(212,160,160,0.15)',
                  color: '#c07080',
                  border: '1px solid rgba(212,160,160,0.4)',
                } : {
                  color: '#b09090',
                  border: '1px solid transparent',
                }}
              >
                TH
              </Link>
              <span style={{ color: 'rgba(212,160,160,0.4)', fontSize: '10px' }}>|</span>
              <Link
                href={switchToEN()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={isEN ? {
                  background: 'rgba(212,160,160,0.15)',
                  color: '#c07080',
                  border: '1px solid rgba(212,160,160,0.4)',
                } : {
                  color: '#b09090',
                  border: '1px solid transparent',
                }}
              >
                EN
              </Link>
            </div>
          </div>

          {/* ── Nav + Contact cols ── */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Navigation */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#c07080' }}
              >
                {isEN ? 'Navigation' : 'เมนูหลัก'}
              </h4>
              <ul className="space-y-3.5">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href)}
                      className="text-sm transition-colors"
                      style={{ color: '#9e8080' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c07080'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9e8080'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phones */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#c07080' }}
              >
                {isEN ? 'Phone' : 'เบอร์โทรศัพท์'}
              </h4>
              <div className="space-y-4">
                {company.phones.map((p) => (
                  <a
                    key={p.number}
                    href={`tel:${p.number}`}
                    className="block text-sm transition-colors"
                    style={{ color: '#9e8080' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c07080'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9e8080'}
                  >
                    {p.label && (
                      <span className="block text-[10px] uppercase mb-0.5" style={{ color: '#c4a0a0' }}>
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
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#c07080' }}
              >
                Email
              </h4>
              <div className="space-y-4">
                {company.email.map((e, index) => (
                  <a
                    key={`${e}-${index}`}
                    href={`mailto:${e}`}
                    className="block text-sm transition-colors break-all"
                    style={{ color: '#9e8080' }}
                    onMouseEnter={el => (el.currentTarget as HTMLElement).style.color = '#c07080'}
                    onMouseLeave={el => (el.currentTarget as HTMLElement).style.color = '#9e8080'}
                  >
                    {e}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(212,160,160,0.15)' }}
        >
          <p className="text-xs" style={{ color: '#c4a8a8' }}>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>

          <Link
            href="#top"
            className="text-xs font-semibold transition-colors"
            style={{ color: '#c4a8a8' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c07080'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#c4a8a8'}
          >
            {isEN ? 'Back to top ↑' : 'กลับขึ้นด้านบน ↑'}
          </Link>
        </div>
      </div>
    </footer>
  )
}