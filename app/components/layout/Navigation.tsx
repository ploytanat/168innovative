'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { X, Menu } from 'lucide-react'

interface NavigationProps {
  locale: string
  logo: {
    src: string
    alt: string
  }
}

const NAV_MENU = [
  { href: '/',           label: { th: 'หน้าหลัก',     en: 'Home'     } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products'  } },
  { href: '/articles',   label: { th: 'บทความของเรา', en: 'Articles'  } },
  { href: '/about',      label: { th: 'เกี่ยวกับเรา', en: 'About'     } },
  { href: '/contact',    label: { th: 'ติดต่อเรา',    en: 'Contact'   } },
]

export default function Navigation({ locale, logo }: NavigationProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const isActive = (path: string) => {
    const full = withLocale(path)
    // homepage exact match เท่านั้น
    if (path === '/') return pathname === full
    return pathname === full || pathname.startsWith(full + '/')
  }

  const toggleLanguage = useCallback(() => {
    const nextPath = isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(nextPath)
  }, [isEN, pathname, router])

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // ปิด mobile menu เมื่อ route เปลี่ยน
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`sticky top-0 z-[60] w-full bg-white transition-all duration-500 ${
        scrolled ? 'border-b border-neutral-200 shadow-[0_1px_12px_rgba(0,0,0,0.04)]' : ''
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-6 lg:px-16">
        {/* Logo */}
        <Link
          href={withLocale('/')}
          className="relative shrink-0 transition-opacity hover:opacity-80 active:opacity-60"
        >
          <Image
            src={logo.src}
            alt={logo.alt || 'Logo'}
            width={160}
            height={50}
            priority
            className="w-auto object-contain h-9 md:h-10" 
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_MENU.map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={withLocale(item.href)}
                className={`text-[13px] tracking-[0.14em] uppercase transition-colors ${
                  isActive(item.href)
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item.label[lang]}
              </Link>
              {/* Active underline indicator */}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-900" />
              )}
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle — desktop */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden md:block text-[10px] tracking-[0.14em] uppercase text-neutral-400
                       border border-neutral-200 px-3 py-1.5
                       hover:border-neutral-100 hover:text-neutral-900
                       transition-colors"
          >
            {isEN ? 'TH' : 'EN'}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            //aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            //aria-expanded={open}
            className="md:hidden flex items-center justify-center w-9 h-9 text-neutral-700
                       hover:text-neutral-900 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — slide down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-neutral-200 bg-white px-6 py-8 space-y-1">
          {NAV_MENU.map((item) => (
            <Link
              key={item.href}
              href={withLocale(item.href)}
              className={`flex items-center justify-between py-3
                          text-sm tracking-[0.1em] uppercase
                          border-b border-neutral-100
                          transition-colors ${
                isActive(item.href)
                  ? 'text-neutral-900 font-medium'
                  : 'text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {item.label[lang]}
              {isActive(item.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
              )}
            </Link>
          ))}

          <div className="pt-6">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-[11px] tracking-[0.14em] uppercase
                         border border-neutral-200 px-4 py-2
                         text-neutral-500 hover:border-neutral-900 hover:text-neutral-900
                         transition-colors"
            >
              {isEN ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}