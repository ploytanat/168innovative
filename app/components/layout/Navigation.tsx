"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ChevronDown,
  Heart,
  HelpCircle,
  Menu,
  PackageCheck,
  Search,
  ShoppingBag,
  Star,
  Truck,
  User,
  X,
} from "lucide-react"

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
  hasDropdown?: boolean
}

const NAV_MENU: NavItem[] = [
  { href: "/categories", label: { th: "สินค้าทั้งหมด", en: "All products" }, hasDropdown: true },
  { href: "/categories/spout", label: { th: "จุกซอง", en: "Spout" }, hasDropdown: true },
  { href: "/categories/plastic-handle", label: { th: "หูหิ้วพลาสติก", en: "Plastic handles" }, hasDropdown: true },
  { href: "/categories/soap-bag", label: { th: "ถุงบรรจุภัณฑ์", en: "Packaging bags" } },
  { href: "/categories/cosmetic-packaging", label: { th: "ตลับเครื่องสำอาง", en: "Cosmetic cases" } },
  { href: "/articles", label: { th: "บทความ", en: "Articles" } },
  { href: "/about", label: { th: "เกี่ยวกับเรา", en: "About" } },
  { href: "/contact", label: { th: "ติดต่อเรา", en: "Contact" } },
]

export default function Navigation(props: NavigationProps) {
  const pathname = usePathname()
  return <NavigationInner key={pathname} pathname={pathname} {...props} />
}

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
    <div className="absolute left-0 top-full z-50 w-72 pt-3" onMouseLeave={onClose}>
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col py-2">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={withLocale(`/categories/${cat.slug}`)}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#f7f7f7]"
            >
              {cat.image?.src && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#f4f4f4]">
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt || cat.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              )}
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-black/5 px-4 py-3">
          <Link
            href={withLocale("/categories")}
            onClick={onClose}
            className="flex items-center gap-1.5 text-[13px] font-bold text-black transition-opacity hover:opacity-60"
          >
            {lang === "th" ? "ดูสินค้าทั้งหมด" : "Browse all products"}
            <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function NavigationInner({
  locale,
  pathname,
  logo,
  categories = [],
}: NavigationProps & { pathname: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)

  const isEN = locale === "en" || pathname.startsWith("/en")
  const lang = isEN ? "en" : "th"

  const withLocale = (path: string) =>
    isEN ? (path === "/" ? "/en" : `/en${path}`) : path

  const navHref = (item: NavItem) => withLocale(item.href)

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
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const openProducts = useCallback(() => {
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
    <header className="sticky top-0 z-65 w-full bg-[#f8f8f8]">
      <div className="hidden h-11 bg-[#f8f8f8] lg:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-5 text-[12px] font-medium text-[#4f4f4f]">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" strokeWidth={1.8} />
              {lang === "th" ? "จัดส่งรวดเร็ว" : "Fast Delivery"}
            </div>

            <div className="h-5 w-px bg-black/10" />

            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4" strokeWidth={1.8} />
              {lang === "th" ? "ราคายุติธรรม" : "Fair Prices"}
            </div>

            <div className="h-5 w-px bg-black/10" />

            <div className="flex items-center gap-2">
              <span className="flex text-[#f6a51a]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
              <span>4.8</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[12px] font-medium text-[#4f4f4f]">
            <button type="button" className="flex items-center gap-2 hover:text-black">
              {isEN ? "🇬🇧 United Kingdom" : "🇹🇭 Thailand"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="h-5 w-px bg-black/10" />

            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-2 hover:text-black"
            >
              {isEN ? "EN" : "TH"}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="h-5 w-px bg-black/10" />

            <Link href={withLocale("/contact")} className="flex items-center gap-2 hover:text-black">
              <HelpCircle className="h-4 w-4" strokeWidth={1.8} />
              {lang === "th" ? "บริการและช่วยเหลือ" : "Services & Help"}
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f8f8]">
        <div className="w-full bg-white px-3 pt-6 shadow-[0_-10px_32px_rgba(0,0,0,0.035)] lg:px-5 lg:pt-7">
          <div className="mx-auto max-w-7xl">
            <div className="flex h-14 items-center gap-5 lg:h-16">
              <Link
                href={withLocale("/")}
                onClick={closeMenu}
                className="flex shrink-0 items-center"
              >
                {logo?.src ? (
                  <div className="relative h-12 w-16 overflow-hidden">
                    <Image
                      src={logo.src}
                      alt={logo.alt || "168 Innovative"}
                      fill
                      priority
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-[28px] font-black leading-none tracking-[-0.08em] text-black">
                    168
                  </div>
                )}
              </Link>

              <form
                onSubmit={handleSearch}
                className="hidden h-12 flex-1 items-center rounded-full bg-[#f7f7f7] px-5 transition-colors focus-within:bg-[#f1f1f1] lg:flex"
              >
                <Search className="mr-4 h-5 w-5 shrink-0 text-black" strokeWidth={2.4} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "th" ? "ค้นหาสินค้าและหมวดหมู่" : "Search all categories"}
                  className="w-full bg-transparent text-[15px] font-medium text-black outline-none placeholder:text-[#666]"
                />
              </form>

              <div className="ml-auto hidden items-center gap-5 lg:flex">
                <button type="button" aria-label="Wishlist" className="transition-opacity hover:opacity-60">
                  <Heart className="h-5.5 w-5.5 text-black" strokeWidth={2.4} />
                </button>

                <button type="button" aria-label="Account" className="transition-opacity hover:opacity-60">
                  <User className="h-5.5 w-5.5 text-black" strokeWidth={2.4} />
                </button>

                <button type="button" aria-label="Bag" className="transition-opacity hover:opacity-60">
                  <ShoppingBag className="h-5.5 w-5.5 text-black" strokeWidth={2.4} />
                </button>

                <Link
                  href={withLocale("/contact")}
                  className="text-[17px] font-black text-black transition-opacity hover:opacity-60"
                >
                  ฿ 0.00
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-label={open ? "Close menu" : "Open menu"}
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f7f7] text-black lg:hidden"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            <nav className="hidden items-center gap-7 overflow-x-auto py-6 lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV_MENU.map((item) => {
                const isProducts = item.href === "/categories"
                const showDropdown = isProducts && productsOpen && categories.length > 0

                return (
                  <div
                    key={item.href}
                    className="relative shrink-0"
                    onMouseEnter={isProducts ? openProducts : undefined}
                    onMouseLeave={isProducts ? closeProducts : undefined}
                  >
                    <Link
                      href={navHref(item)}
                      className="flex items-center gap-2 text-[14px] font-black text-black transition-opacity hover:opacity-60"
                    >
                      {item.label[lang]}
                      {(item.hasDropdown || (isProducts && categories.length > 0)) && (
                        <ChevronDown
                          className="h-3.5 w-3.5 transition-transform duration-200"
                          style={{
                            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                          }}
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
                  </div>
                )
              })}
            </nav>

            <div
              className="overflow-hidden transition-all duration-300 lg:hidden"
              style={{
                maxHeight: open ? "760px" : "0",
                opacity: open ? 1 : 0,
              }}
            >
              <form
                onSubmit={handleSearch}
                className="mb-4 mt-4 flex h-12 items-center rounded-full bg-[#f7f7f7] px-4"
              >
                <Search className="mr-3 h-5 w-5 shrink-0 text-black" strokeWidth={2.2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === "th" ? "ค้นหาสินค้า..." : "Search products..."}
                  className="w-full bg-transparent text-[14px] font-medium text-black outline-none placeholder:text-[#666]"
                />
              </form>

              <div className="space-y-1 pb-5">
                {NAV_MENU.map((item) => {
                  const isProducts = item.href === "/categories"

                  return (
                    <div key={item.href}>
                      <div className="flex items-center">
                        <Link
                          href={navHref(item)}
                          onClick={closeMenu}
                          className="flex flex-1 items-center justify-between rounded-xl px-4 py-3 text-[15px] font-black text-black transition-colors hover:bg-[#f7f7f7]"
                        >
                          {item.label[lang]}
                        </Link>

                        {isProducts && categories.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setMobileProductsOpen((current) => !current)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-black hover:bg-[#f7f7f7]"
                            aria-label={
                              mobileProductsOpen
                                ? lang === "th"
                                  ? "ซ่อนหมวดหมู่"
                                  : "Hide categories"
                                : lang === "th"
                                  ? "แสดงหมวดหมู่"
                                  : "Show categories"
                            }
                          >
                            <ChevronDown
                              className="h-4 w-4 transition-transform duration-200"
                              style={{
                                transform: mobileProductsOpen ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                            />
                          </button>
                        )}
                      </div>

                      {isProducts && mobileProductsOpen && categories.length > 0 && (
                        <div className="mb-2 grid grid-cols-3 gap-2 px-1 py-2">
                          {categories.slice(0, 9).map((cat) => (
                            <Link
                              key={cat.id}
                              href={withLocale(`/categories/${cat.slug}`)}
                              onClick={closeMenu}
                              className="flex flex-col items-center gap-2 rounded-2xl bg-[#f7f7f7] px-2 py-3 text-center"
                            >
                              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white">
                                {cat.image?.src ? (
                                  <Image
                                    src={cat.image.src}
                                    alt={cat.image.alt || cat.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[9px] text-[#999]">
                                    -
                                  </div>
                                )}
                              </div>

                              <span className="text-[10px] font-bold leading-tight text-black">
                                {cat.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="flex items-center justify-between border-t border-black/10 pt-4">
                  <button
                    type="button"
                    onClick={toggleLang}
                    className="rounded-full bg-[#f7f7f7] px-4 py-2 text-[13px] font-black text-black"
                  >
                    {isEN ? "🇹🇭 TH" : "🇬🇧 EN"}
                  </button>

                  <Link
                    href={withLocale("/contact")}
                    onClick={closeMenu}
                    className="rounded-full bg-black px-5 py-2.5 text-[13px] font-black text-white"
                  >
                    {lang === "th" ? "ติดต่อเรา" : "Contact"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
