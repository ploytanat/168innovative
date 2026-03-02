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

function LangToggle({ isEN, onToggle }: { isEN: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle language"
      className="flex items-center gap-1.5 group"
    >
      <span className={`text-[10px] tracking-[0.14em] uppercase transition-colors ${!isEN ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
        TH
      </span>

      {/* Track */}
      <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${isEN ? 'bg-neutral-900' : 'bg-neutral-300'}`}>
        {/* Thumb */}
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isEN ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </div>

      <span className={`text-[10px] tracking-[0.14em] uppercase transition-colors ${isEN ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
        EN
      </span>
    </button>
  )
}

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

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-[60] w-full bg-white transition-all duration-500">
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
            <li key={item.href} className="relative pb-1">
              <Link
                href={withLocale(item.href)}
                className={`text-[13px] tracking-[0.14em] uppercase transition-colors ${
                  isActive(item.href)
                    ? 'text-neutral-900 border-b-2 border-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item.label[lang]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle — desktop */}
          <div className="hidden md:flex">
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-neutral-700
                       hover:text-neutral-900 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — slide down */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? '500px' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="bg-white px-6 py-8 space-y-1">
          {NAV_MENU.map((item) => (
            <Link
              key={item.href}
              href={withLocale(item.href)}
              className={`flex items-center justify-between py-3
                          text-sm tracking-[0.1em] uppercase
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

          {/* Language toggle — mobile */}
          <div className="pt-6 flex items-center gap-3">
            <span className="text-[11px] tracking-[0.1em] uppercase text-neutral-400">
              {isEN ? 'Language' : 'ภาษา'}
            </span>
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>
        </div>
      </div>
    </header>
  )
}