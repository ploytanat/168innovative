'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { HOME } from '@/app/components/sections/home-theme'

interface NavigationProps {
  locale: string
  logo: { src: string; alt: string }
}

const NAV_MENU = [
  { href: '/',           label: { th: 'หน้าหลัก',     en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/articles',   label: { th: 'บทความ',       en: 'Articles' } },
  { href: '/about',      label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact',    label: { th: 'ติดต่อเรา',    en: 'Contact' } },
] as const

const QUOTE_LABEL = { th: 'ขอใบเสนอราคา', en: 'Get a quote' }

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavInner key={pathname} pathname={pathname} {...props} />
}

function NavInner({ locale, logo, pathname }: NavigationProps & { pathname: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const isActive = (path: string) => {
    const full = withLocale(path)
    if (path === '/') return pathname === full
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  const closeMenu = useCallback(() => setOpen(false), [])
  const toggleLanguage = useCallback(() => {
    closeMenu()
    const next = isEN ? (pathname.replace(/^\/en/, '') || '/') : (pathname === '/' ? '/en' : `/en${pathname}`)
    router.push(next)
  }, [closeMenu, isEN, pathname, router])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    let frame = 0
    const update = () => { frame = 0; setScrolled(window.scrollY > 8) }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame) }
  }, [])

  return (
    <header
      className="sticky top-0 z-[60] w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : HOME.surface,
        backdropFilter: scrolled ? 'blur(12px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(140%)' : 'none',
        borderBottom: `1px solid ${HOME.line}`,
        boxShadow: scrolled ? '0 4px 16px rgba(20,22,28,0.06)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 lg:h-24">
        <Link href={withLocale('/')} onClick={closeMenu}
          className="relative flex h-12 w-40 items-center sm:h-14 sm:w-48 lg:h-16 lg:w-56">
          <Image src={logo.src} alt={logo.alt || 'Logo'} fill priority sizes="224px" className="object-contain object-left" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(item => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  className="group relative inline-flex items-center pb-1.5 text-[14px] font-bold uppercase tracking-[0.08em] transition-colors"
                  style={{ color: active ? HOME.ink : HOME.inkMid }}
                >
                  {item.label[lang]}
                  <span
                    className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                      active ? 'w-7' : 'w-0 group-hover:w-4'
                    }`}
                    style={{ background: HOME.ink }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href={withLocale('/contact')} onClick={closeMenu}
            className="home-btn home-btn-accent hidden items-center rounded-full px-5 py-2.5 text-[14px] font-bold uppercase tracking-[0.08em] lg:inline-flex">
            {QUOTE_LABEL[lang]}
            <span className="ml-1.5">→</span>
          </Link>
          <LangPills isEN={isEN} onToggle={toggleLanguage} />
          <button type="button" onClick={() => setOpen(c => !c)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 lg:hidden"
            style={{ color: HOME.ink }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        className="overflow-hidden transition-all duration-300 ease-out lg:hidden"
        style={{
          maxHeight: open ? '520px' : '0',
          borderTop: open ? `1px solid ${HOME.line}` : 'none',
        }}
      >
        <ul className="space-y-1 px-5 pt-4">
          {NAV_MENU.map(item => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link href={withLocale(item.href)} onClick={closeMenu}
                  className="flex items-center justify-between rounded-md px-4 py-3 text-[14px] font-bold uppercase tracking-[0.06em] transition-colors"
                  style={{
                    background: active ? HOME.cream : 'transparent',
                    color: active ? HOME.ink : HOME.inkMid,
                  }}>
                  <span>{item.label[lang]}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: HOME.ink }} />}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="px-5 pb-5 pt-3">
          <Link href={withLocale('/contact')} onClick={closeMenu}
            className="home-btn home-btn-accent flex w-full items-center justify-center rounded-full py-3 text-[14px] font-bold uppercase tracking-[0.08em]">
            {QUOTE_LABEL[lang]}
            <span className="ml-1.5">→</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function LangPills({ isEN, onToggle }: { isEN: boolean; onToggle: () => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full" style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}>
      <button type="button" onClick={isEN ? onToggle : undefined} aria-label="ภาษาไทย" disabled={!isEN}
        className="px-3 py-1.5 text-[13px] font-bold transition-colors"
        style={{ background: !isEN ? HOME.ink : 'transparent', color: !isEN ? HOME.surface : HOME.inkMid }}>
        TH
      </button>
      <button type="button" onClick={!isEN ? onToggle : undefined} aria-label="English" disabled={isEN}
        className="px-3 py-1.5 text-[13px] font-bold transition-colors"
        style={{ background: isEN ? HOME.ink : 'transparent', color: isEN ? HOME.surface : HOME.inkMid }}>
        EN
      </button>
    </div>
  )
}
