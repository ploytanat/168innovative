"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import {
  COLORS,
  GLASS,
  NAV_ACTIVE_PILL_STYLE,
  NAV_SHELL_STYLE,
  SECTION_BACKGROUNDS,
} from "@/app/components/ui/designSystem"

interface NavigationProps {
  locale: string
  logo: {
    src: string
    alt: string
  }
}

const NAV_MENU = [
  { href: "/",           label: { th: "หน้าหลัก",     en: "Home" } },
  { href: "/categories", label: { th: "สินค้าของเรา", en: "Products" } },
  { href: "/articles",   label: { th: "บทความของเรา", en: "Articles" } },
  { href: "/about",      label: { th: "เกี่ยวกับเรา", en: "About" } },
  { href: "/contact",    label: { th: "ติดต่อเรา",    en: "Contact" } },
] as const

const BRAND_NAVY = COLORS.brandNavy
const BRAND_MUTED = COLORS.brandMuted

const LANG_TOGGLE_STYLE = {
  ...GLASS.stats,
  border: "1px solid rgba(36,69,124,0.18)",
  borderRadius: 9999,
} as const

const LANG_TOGGLE_TRACK_STYLE = {
  background: "rgba(36,69,124,0.10)",
  borderRadius: 9999,
} as const

// ← changed: white frost indicator instead of heavy navy gradient
const LANG_TOGGLE_INDICATOR_STYLE = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: 9999,
  boxShadow: "0 1px 6px rgba(30,40,60,0.16)",
} as const

const MOBILE_MENU_BUTTON_STYLE = {
  ...GLASS.card,
  border: "1px solid rgba(36,69,124,0.16)",
  borderRadius: 12,
  color: BRAND_NAVY,
} as const

const MOBILE_DROPDOWN_STYLE = {
  ...GLASS.primary,
  background: SECTION_BACKGROUNDS.neutral,
  borderRadius: 16,
} as const

const MOBILE_PANEL_ROW_STYLE = {
  ...GLASS.card,
  borderRadius: 16,
} as const

// Active dot accent — matches project accent gradient
const ACTIVE_DOT_STYLE = {
  background: "linear-gradient(135deg,#3a7bd5,#2ab8b0)",
  borderRadius: 9999,
  width: 6,
  height: 6,
  flexShrink: 0,
} as const

// ─── LangToggle ─────────────────────────────────────────────────────────────────

function LangToggle({ isEN, onToggle }: { isEN: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle language"
      className="group inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-all"
      style={LANG_TOGGLE_STYLE}
    >
      <span
        className="text-[11px] uppercase tracking-[0.14em] transition-colors"
        style={{ color: !isEN ? BRAND_NAVY : BRAND_MUTED, fontWeight: !isEN ? 600 : 400 }}
      >
        TH
      </span>

      <span className="relative h-5 w-9 rounded-full" style={LANG_TOGGLE_TRACK_STYLE}>
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 transition-transform duration-300 ${
            isEN ? "translate-x-4" : "translate-x-0"
          }`}
          style={LANG_TOGGLE_INDICATOR_STYLE}
        />
      </span>

      <span
        className="text-[11px] uppercase tracking-[0.14em] transition-colors"
        style={{ color: isEN ? BRAND_NAVY : BRAND_MUTED, fontWeight: isEN ? 600 : 400 }}
      >
        EN
      </span>
    </button>
  )
}

// ─── Navigation ─────────────────────────────────────────────────────────────────

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavigationInner key={pathname} pathname={pathname} {...props} />
}

function NavigationInner({
  locale,
  logo,
  pathname,
}: NavigationProps & { pathname: string }) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = locale === "en" || pathname.startsWith("/en")
  const lang = isEN ? "en" : "th"

  const withLocale = (path: string) =>
    isEN ? (path === "/" ? "/en" : `/en${path}`) : path

  const isActive = (path: string) => {
    const full = withLocale(path)
    if (path === "/") return pathname === full
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  const closeMenu = useCallback(() => setOpen(false), [])

  const toggleLanguage = useCallback(() => {
    closeMenu()
    const nextPath = isEN
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname === "/" ? "/en" : `/en${pathname}`
    router.push(nextPath)
  }, [closeMenu, isEN, pathname, router])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    let frame = 0
    const updateScrolled = () => {
      frame = 0
      const next = window.scrollY > 8
      setScrolled(c => c === next ? c : next)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateScrolled)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header
      data-elevated={scrolled || open ? "true" : "false"}
      className="sticky top-0 z-[60] w-full transition-all duration-300"
      style={NAV_SHELL_STYLE}
    >
      <nav className="mx-auto flex h-[4.35rem] max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-[4.75rem] lg:px-8">

        {/* Logo */}
        <Link
          href={withLocale("/")}
          onClick={closeMenu}
          className="relative shrink-0 rounded-full px-1 py-1 transition-opacity hover:opacity-85 active:opacity-70"
        >
          <Image
            src={logo.src}
            alt={logo.alt || "Logo"}
            width={160}
            height={50}
            priority
            className="h-9 w-auto object-contain md:h-10"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_MENU.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  // ← changed: text-[13px] instead of text-[16px]
                  className={`inline-flex rounded-full border px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                    active
                      ? ""
                      : "border-transparent bg-transparent text-[#4d6181] hover:border-[rgba(36,69,124,0.14)] hover:bg-[rgba(233,241,255,0.72)] hover:text-[#24457c]"
                  }`}
                  style={active ? NAV_ACTIVE_PILL_STYLE : undefined}
                >
                  {item.label[lang]}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>

          <button
            type="button"
            onClick={() => setOpen(c => !c)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] transition-all hover:bg-[rgba(233,241,255,0.86)] hover:text-[#24457c] md:hidden"
            style={MOBILE_MENU_BUTTON_STYLE}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className="overflow-hidden border-t transition-all duration-300 ease-out md:hidden"
        style={{
          borderColor: "rgba(255,255,255,0.55)",
          maxHeight: open ? "420px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="mx-4 my-2 px-5 pb-6 pt-4" style={MOBILE_DROPDOWN_STYLE}>
          <div className="space-y-1">
            {NAV_MENU.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={withLocale(item.href)}
                  onClick={closeMenu}
                  // ← changed: text-[13px] instead of text-md
                  className={`flex items-center justify-between rounded-full border px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                    active
                      ? ""
                      : "border-transparent bg-transparent text-[#4d6181] hover:border-[rgba(36,69,124,0.14)] hover:bg-[rgba(233,241,255,0.72)] hover:text-[#24457c]"
                  }`}
                  style={active ? NAV_ACTIVE_PILL_STYLE : undefined}
                >
                  <span>{item.label[lang]}</span>
                  {/* ← changed: inline style gradient dot instead of var(--color-accent) */}
                  {active && <span style={ACTIVE_DOT_STYLE} />}
                </Link>
              )
            })}
          </div>

          {/* Language row */}
          <div
            className="mt-5 flex items-center justify-between px-4 py-3"
            style={MOBILE_PANEL_ROW_STYLE}
          >
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: BRAND_MUTED }}
            >
              {isEN ? "Language" : "ภาษา"}
            </span>
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>
        </div>
      </div>
    </header>
  )
}
