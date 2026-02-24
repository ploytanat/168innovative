'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface NavigationProps {
  locale: string
  logo: {
    src: string
    alt: string
  }
}

const NAV_MENU = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/articles', label: { th: 'บทความของเรา', en: 'Articles' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

export default function Navigation({ locale, logo }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const isActive = (path: string) => pathname === withLocale(path)

  const toggleLanguage = useCallback(() => {
    const nextPath = isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(nextPath)
  }, [isEN, pathname, router])

  // ✅ ตรวจจับ scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`sticky top-0 z-[60] w-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'border-b border-neutral-200'
          : ''
      }`}
    >
      <nav
        className={`flex items-center justify-between px-8 lg:px-16 transition-all duration-500 ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        {/* Logo */}
        <Link
          href={withLocale('/')}
          onClick={() => setOpen(false)}
          className="relative transition-transform active:scale-95"
        >
          <Image
            src={logo.src}
            alt={logo.alt || 'Company logo'}
            width={160}
            height={50}
            priority
            className={`w-auto object-contain transition-all duration-500 ${
              scrolled ? 'h-9 md:h-10' : 'h-10 md:h-11'
            }`}
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={withLocale(item.href)}
                className={`text-[12px] tracking-[0.12em] uppercase transition-colors ${
                  isActive(item.href)
                    ? 'text-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {item.label[lang]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="hidden md:block text-[11px] tracking-[0.12em] uppercase text-neutral-500 border border-neutral-200 px-3 py-1.5 hover:border-black hover:text-black transition-colors"
        >
          TH / EN
        </button>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          
          aria-label='menu'
          className="md:hidden text-sm tracking-[0.12em] uppercase text-neutral-700"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 px-8 py-8 space-y-6 bg-white">
          {NAV_MENU.map((item) => (
            <Link
              key={item.href}
              href={withLocale(item.href)}
              onClick={() => setOpen(false)}
              className={`block text-sm tracking-[0.12em] uppercase ${
                isActive(item.href)
                  ? 'text-black'
                  : 'text-neutral-500'
              }`}
            >
              {item.label[lang]}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleLanguage}
            className="mt-6 text-xs tracking-[0.12em] uppercase border border-neutral-200 px-4 py-2 text-neutral-500"
          >
            Switch Language
          </button>
        </div>
      )}
    </header>
  )
}