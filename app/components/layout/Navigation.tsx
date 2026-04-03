"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, Menu, Search, X } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavigationProps {
  locale: string
  logo: { src: string; alt: string }
  categories?: NavCategory[]
}

type NavCategory = {
  id: string
  slug: string
  name: string
  image?: { src: string; alt: string }
}

type NavItem = {
  href: string
  label: { th: string; en: string }
}

// ─── Static data ──────────────────────────────────────────────────────────────

const NAV_MENU: NavItem[] = [
  { href: "/",           label: { th: "หน้าหลัก",     en: "Home" } },
  { href: "/categories", label: { th: "สินค้าของเรา", en: "Products" } },
  { href: "/articles",   label: { th: "บทความ",        en: "Articles" } },
  { href: "/about",      label: { th: "เกี่ยวกับเรา", en: "About" } },
  { href: "/contact",    label: { th: "ติดต่อเรา",     en: "Contact" } },
]

// ─── Root (re-mounts on path change to reset open state) ─────────────────────

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavigationInner key={pathname} pathname={pathname} {...props} />
}

// ─── Category Dropdown ───────────────────────────────────────────────────────

function CategoryDropdown({
  categories,
  withLocale,
  lang,
  onClose,
}: {
  categories: NavCategory[]
  withLocale: (path: string) => string
  lang: "th" | "en"
  onClose: () => void
}) {
  return (
    <div
      className="absolute left-1/2 top-full z-50 w-130 -translate-x-1/2 pt-1"
      onMouseLeave={onClose}
    >
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="grid grid-cols-3 gap-2 p-4">
          {categories.slice(0, 9).map((cat) => (
            <Link
              key={cat.id}
              href={withLocale(`/categories/${cat.slug}`)}
              onClick={onClose}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-colors hover:bg-[#fdf3f5]"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f5f0ee]">
                {cat.image?.src ? (
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt || cat.name}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-[#b0a09a]">
                    —
                  </div>
                )}
              </div>
              <span className="text-[12px] font-semibold leading-tight text-[#2c2521] group-hover:text-[#c47b8a]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t px-4 py-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <Link
            href={withLocale("/categories")}
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#c47b8a] transition-opacity hover:opacity-75"
          >
            {lang === "th" ? "ดูสินค้าทั้งหมด" : "Browse all products"}
            <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Inner ────────────────────────────────────────────────────────────────────

function NavigationInner({
  locale,
  pathname,
  categories = [],
}: NavigationProps & { pathname: string }) {
  const router                    = useRouter()
  const inputRef                  = useRef<HTMLInputElement>(null)
  const closeTimerRef             = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen]           = useState(false)
  const [query, setQuery]         = useState("")
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)

  const isEN     = locale === "en" || pathname.startsWith("/en")
  const lang     = isEN ? "en" : "th"
  const withLocale = (path: string) =>
    isEN ? (path === "/" ? "/en" : `/en${path}`) : path
  const navHref  = (item: NavItem) => withLocale(item.href)

  const isActive = (item: NavItem) => {
    const full = navHref(item)
    if (item.href === "/") return pathname === full
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  const closeMenu = useCallback(() => setOpen(false), [])

  const toggleLang = useCallback(() => {
    closeMenu()
    const next = isEN
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname === "/"
        ? "/en"
        : `/en${pathname}`
    router.push(next)
  }, [closeMenu, isEN, pathname, router])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Dropdown hover — small delay prevents flicker when mouse moves to dropdown
  const openProducts  = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setProductsOpen(true)
  }, [])
  const closeProducts = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setProductsOpen(false), 80)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(withLocale(`/search?q=${encodeURIComponent(query.trim())}`))
    setQuery("")
    closeMenu()
  }

  return (
    <header
      className="sticky z-65 w-full bg-white/82 shadow-[0_1px_0_rgba(0,0,0,.06),0_2px_12px_rgba(0,0,0,.04)] backdrop-blur-xl"
      style={{ top: 32 }}
    >
      <nav className="mx-auto flex h-15 max-w-7xl items-center gap-2 px-4 sm:px-5">

        {/* Logo */}
        <Link
          href={withLocale("/")}
          onClick={closeMenu}
          className="mr-auto flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c47b8a] font-black text-white text-[15px]">
            168
          </div>
          <div className="hidden sm:block">
            <div className="font-heading text-[17px] font-extrabold leading-tight text-[#2c2521]">
              168 Innovative
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c47b8a]">
              OEM/ODM Packaging
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center lg:flex">
          {NAV_MENU.map((item) => {
            const active       = isActive(item)
            const isProducts   = item.href === "/categories"
            const showDropdown = isProducts && productsOpen && categories.length > 0

            return (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={isProducts ? openProducts : undefined}
                onMouseLeave={isProducts ? closeProducts : undefined}
              >
                <Link
                  href={navHref(item)}
                  className="flex h-15 items-center gap-1 border-b-[3px] px-3.5 text-[13px] font-semibold transition-colors"
                  style={{
                    color:       active || (isProducts && showDropdown) ? "#2c2521" : "#8a7a74",
                    background:  active || (isProducts && showDropdown) ? "rgba(196,123,138,.07)" : "transparent",
                    borderColor: active ? "#c47b8a" : "transparent",
                  }}
                >
                  {item.label[lang]}
                  {isProducts && categories.length > 0 && (
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform duration-200"
                      style={{ transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  )}
                </Link>

                {isProducts && showDropdown && (
                  <CategoryDropdown
                    categories={categories}
                    withLocale={withLocale}
                    lang={lang}
                    onClose={() => setProductsOpen(false)}
                  />
                )}
              </li>
            )
          })}
        </ul>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="ml-2 hidden items-center overflow-hidden rounded-lg bg-[#f4ede8] lg:flex"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "th" ? "ค้นหาสินค้า..." : "Search products..."}
            className="w-40 bg-transparent px-3 py-2 text-[13px] text-[#2c2521] placeholder:text-[#b8a89e] outline-none"
          />
          <button
            type="submit"
            aria-label={lang === "th" ? "ค้นหา" : "Search"}
            className="bg-[#c47b8a] px-3 py-2 text-white transition-opacity hover:opacity-85"
          >
            <Search className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>

        {/* Lang */}
        <button
          type="button"
          onClick={toggleLang}
          aria-label={isEN ? "Switch to Thai" : "Switch to English"}
          className="hidden rounded-full border border-[#e0d4cc] px-2.5 py-1 text-[11px] font-semibold text-[#8a7a74] transition-colors hover:text-[#2c2521] lg:block"
        >
          {isEN ? "TH" : "EN"}
        </button>

        {/* CTA */}
        <Link
          href={withLocale("/contact")}
          className="hidden rounded-lg bg-[#c47b8a] px-4 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-85 lg:block"
        >
          {lang === "th" ? "ขอใบเสนอราคา" : "Get a Quote"}
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-[#8a7a74] transition-colors hover:bg-[#f4ede8] hover:text-[#2c2521] lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className="overflow-hidden border-t border-[#ede4dd] transition-all duration-300 lg:hidden"
        style={{ maxHeight: open ? "680px" : "0", opacity: open ? 1 : 0 }}
      >
        <div className="space-y-1 bg-[#fefcfa] px-4 pb-5 pt-3">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mb-3 flex items-center overflow-hidden rounded-lg bg-[#f4ede8]"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "th" ? "ค้นหาสินค้า..." : "Search products..."}
              className="flex-1 bg-transparent px-3 py-2.5 text-[14px] text-[#2c2521] placeholder:text-[#b8a89e] outline-none"
            />
            <button type="submit" aria-label={lang === "th" ? "ค้นหา" : "Search"} className="bg-[#c47b8a] px-4 py-2.5 text-white">
              <Search className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>

          {NAV_MENU.map((item) => {
            const active     = isActive(item)
            const isProducts = item.href === "/categories"

            return (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={navHref(item)}
                    onClick={closeMenu}
                    className="flex flex-1 items-center justify-between rounded-lg px-4 py-3 text-[14px] font-semibold transition-colors"
                    style={{
                      color:      active ? "#2c2521" : "#8a7a74",
                      background: active ? "rgba(196,123,138,.10)" : "transparent",
                    }}
                  >
                    {item.label[lang]}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[#c47b8a]" />}
                  </Link>

                  {isProducts && categories.length > 0 && (
                    <button
                      type="button"
                      aria-label={mobileProductsOpen ? (lang === "th" ? "ซ่อนหมวดหมู่" : "Hide categories") : (lang === "th" ? "แสดงหมวดหมู่" : "Show categories")}
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8a7a74]"
                    >
                      <ChevronDown
                        className="h-4 w-4 transition-transform duration-200"
                        style={{ transform: mobileProductsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile category grid */}
                {isProducts && mobileProductsOpen && categories.length > 0 && (
                  <div className="mb-1 grid grid-cols-3 gap-1.5 px-1 pb-1">
                    {categories.slice(0, 9).map((cat) => (
                      <Link
                        key={cat.id}
                        href={withLocale(`/categories/${cat.slug}`)}
                        onClick={closeMenu}
                        className="flex flex-col items-center gap-1.5 rounded-xl bg-[#f8f3f0] px-2 py-3 text-center"
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white">
                          {cat.image?.src ? (
                            <Image
                              src={cat.image.src}
                              alt={cat.image.alt || cat.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[9px] text-[#b0a09a]">—</div>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold leading-tight text-[#2c2521]">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <div className="flex items-center justify-between border-t border-[#ede4dd] pt-3">
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-[#e0d4cc] px-3 py-1.5 text-[12px] font-semibold text-[#8a7a74] transition-colors hover:text-[#2c2521]"
            >
              {isEN ? "🇹🇭 TH" : "🇬🇧 EN"}
            </button>
            <Link
              href={withLocale("/contact")}
              onClick={closeMenu}
              className="rounded-lg bg-[#c47b8a] px-4 py-2 text-[13px] font-bold text-white"
            >
              {lang === "th" ? "ขอใบเสนอราคา" : "Get a Quote"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
