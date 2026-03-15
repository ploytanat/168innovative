"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  locale: string
  logo: {
    src: string
    alt: string
  }
}

const NAV_MENU = [
  { href: "/", label: { th: "หน้าหลัก", en: "Home" } },
  { href: "/categories", label: { th: "สินค้าของเรา", en: "Products" } },
  { href: "/articles", label: { th: "บทความของเรา", en: "Articles" } },
  { href: "/about", label: { th: "เกี่ยวกับเรา", en: "About" } },
  { href: "/contact", label: { th: "ติดต่อเรา", en: "Contact" } },
] as const

function LangToggle({
  isEN,
  onToggle,
}: {
  isEN: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle language"
      className="liquid-glass-pill group inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-all hover:border-[var(--color-accent)] hover:shadow-[0_12px_26px_rgba(15,118,110,0.12)]"
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
          !isEN ? "text-[var(--color-ink)]" : "text-[#7f90a6]"
        }`}
      >
        TH
      </span>

      <span
        className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
          isEN
            ? "bg-[linear-gradient(90deg,#dff4ef,#dce7fb)]"
            : "bg-[linear-gradient(90deg,#e7f6f0,#e8eefb)]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[var(--color-accent)] shadow-sm transition-transform duration-300 ${
            isEN ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>

      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
          isEN ? "text-[var(--color-ink)]" : "text-[#7f90a6]"
        }`}
      >
        EN
      </span>
    </button>
  )
}

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()

  return <NavigationInner key={pathname} pathname={pathname} {...props} />
}

function NavigationInner({
  locale,
  logo,
  pathname,
}: NavigationProps & {
  pathname: string
}) {
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

  const closeMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const toggleLanguage = useCallback(() => {
    closeMenu()

    const nextPath = isEN
      ? pathname.replace(/^\/en/, "") || "/"
      : pathname === "/"
        ? "/en"
        : `/en${pathname}`

    router.push(nextPath)
  }, [closeMenu, isEN, pathname, router])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    let frame = 0

    const updateScrolled = () => {
      frame = 0
      const next = window.scrollY > 8
      setScrolled((current) => (current === next ? current : next))
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
      className={`sticky top-0 z-[60] w-full border-b transition-all duration-300 ${
        scrolled || open
          ? "liquid-glass-shell border-[rgba(205,222,241,0.76)] shadow-[0_18px_38px_rgba(28,40,66,0.1)]"
          : "liquid-glass-shell border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[4.35rem] max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-[4.75rem] lg:px-8">
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

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={withLocale(item.href)}
                className={`inline-flex rounded-full px-3.5 py-2 text-[16px] font-semibold uppercase tracking-[0.12em] transition-all ${
                  isActive(item.href)
                    ? "btn-primary-soft"
                    : "text-[#55657d] hover:bg-white/80 hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label[lang]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="liquid-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full text-[#4f5d74] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        className="overflow-hidden border-t border-black/5 transition-all duration-300 ease-out md:hidden"
        style={{
          maxHeight: open ? "420px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="liquid-glass-panel rounded-b-[1.75rem] border-x border-b border-[rgba(205,222,241,0.72)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(241,251,255,0.92)_48%,rgba(242,247,255,0.9)_100%)] px-5 pb-6 pt-4">
          <div className="space-y-1">
            {NAV_MENU.map((item) => (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-md font-medium uppercase tracking-[0.12em] transition-all ${
                  isActive(item.href)
                    ? "btn-primary-soft"
                    : "text-[#55657d] hover:bg-white hover:text-[var(--color-ink)]"
                }`}
              >
                <span>{item.label[lang]}</span>
                {isActive(item.href) ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                ) : null}
              </Link>
            ))}
          </div>

          <div className="liquid-glass-pill mt-5 flex items-center justify-between rounded-2xl px-4 py-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#66748a]">
              {isEN ? "Language" : "ภาษา"}
            </span>
            <LangToggle isEN={isEN} onToggle={toggleLanguage} />
          </div>
        </div>
      </div>
    </header>
  )
}
