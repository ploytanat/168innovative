'use client'

import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { HOME } from '@/app/components/sections/home-theme'
import type { CategoryView } from '@/app/lib/types/view'

interface NavigationProps {
  locale: string
  logo: { src: string; alt: string }
  categories?: CategoryView[]
}

const NAV_MENU = [
  { href: '/',           label: { th: 'หน้าหลัก',     en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/articles',   label: { th: 'บทความ',       en: 'Articles' } },
  { href: '/about',      label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact',    label: { th: 'ติดต่อเรา',    en: 'Contact' } },
] as const

const QUOTE_LABEL = { th: 'ขอใบเสนอราคา', en: 'Get a quote' }
const MENU_LABEL  = { th: 'เมนู',          en: 'Menu' }

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavInner key={pathname} pathname={pathname} {...props} />
}

function NavInner({ locale, logo, pathname, categories = [] }: NavigationProps & { pathname: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const hasCategories = categories.length > 0

  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const isActive = (path: string) => {
    const full = withLocale(path)
    if (path === '/') return pathname === full
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  const closeMenu = useCallback(() => {
    setOpen(false)
    setMobileProductsOpen(false)
  }, [setMobileProductsOpen])
  const toggleLanguage = useCallback(() => {
    closeMenu()
    const next = isEN ? (pathname.replace(/^\/en/, '') || '/') : (pathname === '/' ? '/en' : `/en${pathname}`)
    router.push(next)
  }, [closeMenu, isEN, pathname, router])

  const openProducts = useCallback(() => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null }
    setProductsOpen(true)
  }, [])
  const closeProducts = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 180)
  }, [])

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProductsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className="sticky top-0 z-[60] w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.88)' : HOME.surface,
        backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        borderBottom: `1px solid ${scrolled ? HOME.line : 'transparent'}`,
        boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-5 lg:h-20">
        <Link
          href={withLocale('/')}
          onClick={closeMenu}
          aria-label="168 Innovative"
          className="relative flex h-11 w-36 shrink-0 items-center sm:h-12 sm:w-40 lg:h-14 lg:w-48"
        >
          <Image
            src={logo.src}
            alt={logo.alt || 'Logo'}
            fill
            priority
            sizes="192px"
            className="object-contain object-left"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_MENU.map(item => {
            const active = isActive(item.href)
            const isProductsItem = item.href === '/categories' && hasCategories
            const showAccent = active || (isProductsItem && productsOpen)

            if (isProductsItem) {
              return (
                <li
                  key={item.href}
                  onMouseEnter={openProducts}
                  onMouseLeave={closeProducts}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={productsOpen ? 'true' : 'false'}
                    onClick={() => setProductsOpen(o => !o)}
                    className="group relative inline-flex items-center gap-1 rounded px-4 py-2 text-[15px] transition-all duration-200 hover:bg-[rgba(20,22,28,0.04)]"
                    style={{
                      color: showAccent ? HOME.ink : HOME.inkMid,
                      fontWeight: showAccent ? 700 : 500,
                    }}
                  >
                    {item.label[lang]}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                      strokeWidth={2.2}
                    />
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded transition-all duration-200 ${
                        showAccent ? 'h-[3px] w-6 opacity-100' : 'h-[2px] w-0 opacity-0 group-hover:w-3 group-hover:opacity-100'
                      }`}
                      style={{ background: HOME.ink, bottom: '-2px' }}
                    />
                  </button>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  aria-current={active ? 'page' : undefined}
                  className="group relative inline-flex items-center rounded px-4 py-2 text-[15px] transition-all duration-200 hover:bg-[rgba(20,22,28,0.04)]"
                  style={{
                    color: active ? HOME.ink : HOME.inkMid,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {item.label[lang]}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded transition-all duration-200 ${
                      active ? 'h-[3px] w-6 opacity-100' : 'h-[2px] w-0 opacity-0 group-hover:w-3 group-hover:opacity-100'
                    }`}
                    style={{ background: HOME.ink, bottom: '-2px' }}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <LangToggle isEN={isEN} onToggle={toggleLanguage} />

          <Link
            href={withLocale('/contact')}
            onClick={closeMenu}
            className="home-btn home-btn-accent hidden items-center gap-1.5 rounded px-5 py-2.5 text-[14px] font-semibold xl:inline-flex"
          >
            {QUOTE_LABEL[lang]}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(c => !c)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open ? 'true' : 'false'}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-[rgba(20,22,28,0.05)] xl:hidden"
            style={{ color: HOME.ink, border: `1px solid ${HOME.line}` }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Desktop mega menu — Products */}
      {hasCategories && (
        <div
          onMouseEnter={openProducts}
          onMouseLeave={closeProducts}
          className="absolute inset-x-0 top-full hidden xl:block"
          style={{ pointerEvents: productsOpen ? 'auto' : 'none' }}
        >
          <div
            className="overflow-hidden transition-[opacity,transform] duration-200 ease-out"
            style={{
              opacity: productsOpen ? 1 : 0,
              transform: productsOpen ? 'translateY(0)' : 'translateY(-6px)',
              background: HOME.surface,
              borderBottom: `1px solid ${HOME.line}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="mx-auto max-w-[1200px] px-5 py-6">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-3 lg:grid-cols-4">
                {categories.slice(0, 12).map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={withLocale(`/categories/${cat.slug}`)}
                      onClick={() => setProductsOpen(false)}
                      className="block truncate rounded-md py-2 text-[14px] transition-colors hover:bg-[#f9f9f9]"
                      style={{ color: HOME.ink }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li className="col-span-full pt-2" style={{ borderTop: `1px solid ${HOME.line}` }}>
                  <Link
                    href={withLocale('/categories')}
                    onClick={() => setProductsOpen(false)}
                    className="inline-flex items-center gap-1.5 py-2 text-[13px] font-semibold transition-colors hover:opacity-70"
                    style={{ color: HOME.ink }}
                  >
                    {lang === 'th' ? 'ดูทั้งหมด' : 'View all categories'}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out xl:hidden"
        style={{
          maxHeight: open ? (mobileProductsOpen ? '1100px' : '600px') : '0',
          opacity: open ? 1 : 0,
          borderTop: open ? `1px solid ${HOME.line}` : 'none',
          background: HOME.surface,
        }}
        aria-hidden={open ? 'false' : 'true'}
      >
        <p
          className="px-5 pt-5 text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: HOME.mintInk }}
        >
          {MENU_LABEL[lang]}
        </p>

        <ul className="space-y-1 px-3 pt-3">
          {NAV_MENU.map(item => {
            const active = isActive(item.href)
            const isProductsItem = item.href === '/categories' && hasCategories

            if (isProductsItem) {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen(o => !o)}
                    aria-expanded={mobileProductsOpen ? 'true' : 'false'}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-[16px] transition-colors"
                    style={{
                      background: active || mobileProductsOpen ? HOME.mist : 'transparent',
                      color: active ? HOME.ink : HOME.inkMid,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    <span>{item.label[lang]}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
                      strokeWidth={2}
                      style={{ color: HOME.inkSoft }}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                    style={{
                      maxHeight: mobileProductsOpen ? `${Math.min(categories.length, 8) * 56 + 64}px` : '0',
                      opacity: mobileProductsOpen ? 1 : 0,
                    }}
                  >
                    <ul className="mt-1 space-y-0.5 pl-3">
                      {categories.slice(0, 8).map(cat => (
                        <li key={cat.id}>
                          <Link
                            href={withLocale(`/categories/${cat.slug}`)}
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors"
                            style={{ color: HOME.inkMid }}
                          >
                            <span className="h-1 w-1 shrink-0 rounded" style={{ background: HOME.line }} />
                            <span className="truncate">{cat.name}</span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={withLocale('/categories')}
                          onClick={closeMenu}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors"
                          style={{ color: HOME.ink }}
                        >
                          {lang === 'th' ? 'ดูทั้งหมด' : 'View all'}
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  onClick={closeMenu}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 text-[16px] transition-colors"
                  style={{
                    background: active ? HOME.mist : 'transparent',
                    color: active ? HOME.ink : HOME.inkMid,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <span>{item.label[lang]}</span>
                  {active ? (
                    <span className="h-1.5 w-1.5 rounded" style={{ background: HOME.mintInk }} />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 opacity-40" strokeWidth={1.8} />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="px-5 pb-6 pt-4">
          <Link
            href={withLocale('/contact')}
            onClick={closeMenu}
            className="home-btn home-btn-accent flex w-full items-center justify-center gap-2 rounded py-3.5 text-[15px] font-semibold"
          >
            {QUOTE_LABEL[lang]}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function LangToggle({ isEN, onToggle }: { isEN: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={isEN ? 'Switch language to Thai' : 'Switch language to English'}
      onClick={onToggle}
      className="inline-flex items-center rounded p-0.5 text-[11px] font-bold tracking-[0.08em]"
      style={{ background: HOME.mist, border: `1px solid ${HOME.line}` }}
    >
      <span
        className="rounded px-2.5 py-1 transition-colors"
        style={{
          background: !isEN ? HOME.ink : 'transparent',
          color: !isEN ? HOME.surface : HOME.inkSoft,
        }}
      >
        TH
      </span>
      <span
        className="rounded px-2.5 py-1 transition-colors"
        style={{
          background: isEN ? HOME.ink : 'transparent',
          color: isEN ? HOME.surface : HOME.inkSoft,
        }}
      >
        EN
      </span>
    </button>
  )
}
