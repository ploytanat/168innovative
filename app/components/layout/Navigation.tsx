'use client'

import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CategoryView } from '@/app/lib/types/view'

interface NavigationProps {
  locale: string
  logo: { src: string; alt: string }
  categories?: CategoryView[]
}
const NAV_MENU = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้า', en: 'Products' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/articles', label: { th: 'บทความ', en: 'Articles' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
] as const

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavInner key={pathname} pathname={pathname} {...props} />
}
function NavInner({ locale, logo, pathname, categories = [] }: NavigationProps & { pathname: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const productsButtonRef = useRef<HTMLButtonElement>(null)
  const productsPanelRef = useRef<HTMLDivElement>(null)
  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'
  const withLocale = (path: string) => isEN ? (path === '/' ? '/en' : `/en${path}`) : path
  const isActive = (path: string) => path === '/' ? pathname === withLocale(path) : pathname === withLocale(path) || pathname.startsWith(`${withLocale(path)}/`)
  const closeMenu = useCallback(() => { setOpen(false); setMobileProductsOpen(false) }, [])
  function toggleLanguage() {
    closeMenu()
    const next = isEN ? pathname.replace(/^\/en/, '') || '/' : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(next + window.location.search + window.location.hash)
  }
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = requestAnimationFrame(() => headerRef.current?.querySelector<HTMLElement>('.nav-mobile-links a, .nav-mobile-links button')?.focus())
    const background = Array.from(document.querySelectorAll<HTMLElement>('.site-frame > main, .site-frame > footer, .floating-contact, .back-to-top, .shortlist-dock'))
    const previousInert = background.map(element => element.inert)
    background.forEach(element => { element.inert = true })
    function trapFocus(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const controls = Array.from(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter(element => element.getClientRects().length && !element.closest('[inert]'))
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      background.forEach((element, i) => { element.inert = previousInert[i] })
      document.removeEventListener('keydown', trapFocus)
    }
  }, [open])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (productsOpen) { setProductsOpen(false); productsButtonRef.current?.focus() }
      if (open) { closeMenu(); menuButtonRef.current?.focus() }
    }
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setProductsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', outside) }
  }, [productsOpen, open, closeMenu])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1200px)')
    function resize() { closeMenu(); setProductsOpen(false) }
    desktop.addEventListener('change', resize)
    return () => desktop.removeEventListener('change', resize)
  }, [closeMenu])
  function categoryLinks(mobile = false) {
    return categories.map(cat => <li key={cat.id}>
      <Link href={withLocale(`/categories/${cat.slug}`)} className="nav-category-tile" aria-current={pathname === withLocale(`/categories/${cat.slug}`) ? 'page' : undefined} onClick={() => { closeMenu(); setProductsOpen(false) }}>
        {cat.image?.src && <span className="nav-category-image"><Image src={cat.image.src} alt="" fill sizes={mobile ? '44px' : '60px'} className="object-cover" /></span>}
        <span>{cat.name}</span><ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </li>)
  }
  return <header ref={headerRef} className="site-navigation nav-redesign sticky top-0 z-[60] w-full" data-scrolled={scrolled}>
    <nav className="nav-shell" aria-label={isEN ? 'Main navigation' : 'เมนูหลัก'}>
      <Link href={withLocale('/')} onClick={closeMenu} className="nav-brand" aria-label={isEN ? '168 Innovative home' : '168 Innovative หน้าหลัก'}><Image src={logo.src} alt={logo.alt || '168 Innovative'} fill priority sizes="160px" className="object-contain object-left" /></Link>
      <ul className="nav-desktop-links">{NAV_MENU.map(item => <li key={item.href} onBlur={event => { if (item.href === '/categories' && !event.currentTarget.contains(event.relatedTarget as Node)) setProductsOpen(false) }}>
        {item.href === '/categories' && categories.length ? <>
          <button ref={productsButtonRef} className="nav-main-link" data-active={isActive(item.href) || productsOpen} type="button" aria-expanded={productsOpen} aria-controls="desktop-products-menu" onClick={() => setProductsOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setProductsOpen(true); requestAnimationFrame(() => productsPanelRef.current?.querySelector('a')?.focus()) } }}>{item.label[lang]}<ChevronDown size={15} aria-hidden="true" /></button>
          <div ref={productsPanelRef} id="desktop-products-menu" className="nav-catalog-panel" hidden={!productsOpen} inert={!productsOpen}>
            <div className="nav-catalog-content">
              <div className="nav-catalog-intro"><h2>{isEN ? 'Find your packaging' : 'เลือกบรรจุภัณฑ์ที่ใช่'}</h2><p>{isEN ? 'Explore by product category.' : 'เลือกดูตามประเภทสินค้า'}</p><Link href={withLocale('/categories')} onClick={() => setProductsOpen(false)}>{isEN ? 'View all products' : 'ดูสินค้าทั้งหมด'}<ArrowRight size={18} aria-hidden="true" /></Link></div>
              <ul className="nav-category-grid">{categoryLinks()}</ul>
            </div>
          </div>
        </> : <Link href={withLocale(item.href)} className="nav-main-link" aria-current={isActive(item.href) ? 'page' : undefined}>{item.label[lang]}</Link>}
      </li>)}</ul>
      <div className="nav-utilities">
        <div className="nav-locale-switch" role="group" aria-label={isEN ? "Language" : "ภาษา"}><button type="button" lang="th" aria-label="ภาษาไทย" aria-pressed={!isEN} data-current={!isEN} onClick={() => { if (isEN) toggleLanguage() }}>TH</button><span aria-hidden="true" className="nav-locale-divider" /><button type="button" lang="en" aria-label="English" aria-pressed={isEN} data-current={isEN} onClick={() => { if (!isEN) toggleLanguage() }}>EN</button></div>
        <Link href={withLocale('/contact')} className="nav-quote nav-desktop-quote">{isEN ? 'Get a quote' : 'ขอใบเสนอราคา'}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        <button ref={menuButtonRef} type="button" className="nav-mobile-toggle" aria-controls="mobile-menu" aria-expanded={open} aria-label={open ? (isEN ? 'Close menu' : 'ปิดเมนู') : (isEN ? 'Open menu' : 'เปิดเมนู')} onClick={() => { setOpen(value => !value); setProductsOpen(false) }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </nav>
    <div id="mobile-menu" className="mobile-navigation-panel nav-mobile-panel" hidden={!open} inert={!open}>
      <nav aria-label={isEN ? 'Mobile navigation' : 'เมนูมือถือ'}><ul className="nav-mobile-links">{NAV_MENU.map(item => <li key={item.href}>
        {item.href === '/categories' && categories.length ? <>
          <button type="button" aria-expanded={mobileProductsOpen} aria-controls="mobile-product-categories" data-active={isActive(item.href)} onClick={() => setMobileProductsOpen(value => !value)}>{item.label[lang]}<ChevronDown size={18} className={mobileProductsOpen ? 'rotate-180' : ''} aria-hidden="true" /></button>
          <div id="mobile-product-categories" hidden={!mobileProductsOpen} inert={!mobileProductsOpen}><Link className="nav-mobile-all" href={withLocale('/categories')} onClick={closeMenu}>{isEN ? 'View all products' : 'ดูสินค้าทั้งหมด'}<ArrowRight size={16} /></Link><ul className="nav-mobile-categories">{categoryLinks(true)}</ul></div>
        </> : <Link href={withLocale(item.href)} onClick={closeMenu} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label[lang]}<ArrowUpRight size={17} aria-hidden="true" /></Link>}
      </li>)}</ul></nav>
      <div className="nav-mobile-footer"><Link className="nav-quote" href={withLocale('/contact')} onClick={closeMenu}>{isEN ? 'Get a quote' : 'ขอใบเสนอราคา'}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div>
  </header>
}
