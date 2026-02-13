'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Facebook, Instagram, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_MENU = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

export default function Navigation({ logo }: { logo: { src: string; alt: string } }) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const isActive = (path: string) => pathname === withLocale(path)

  const toggleLanguage = () => {
    const nextPath = isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname === '/'
      ? '/en'
      : `/en${pathname}`
    router.push(nextPath)
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          open
            ? 'bg-white py-3 shadow-sm'
            : scrolled
            ? 'bg-white/70 backdrop-blur-md py-8 shadow-sm'
            : 'bg-white/70  backdrop-blur-md py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href={withLocale('/')}
            onClick={() => setOpen(false)}
            className="relative z-50 transition active:scale-95"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={50}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {NAV_MENU.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={withLocale(item.href)}
                    className={`text-sm font-semibold transition-colors hover:text-[#1e3a5f] ${
                      isActive(item.href)
                        ? 'text-[#1e3a5f]'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Toggle */}
            <div
              onClick={toggleLanguage}
              className="relative flex h-9 w-[84px] cursor-pointer items-center rounded-full bg-slate-100 p-1 shadow-inner"
            >
              <motion.div
                className="absolute h-7 w-[38px] rounded-full bg-white shadow-md"
                initial={false}
                animate={{ x: isEN ? 40 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <div className="relative z-10 flex w-full justify-around text-[11px] font-bold">
                <span className={!isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>
                  TH
                </span>
                <span className={isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>
                  EN
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden z-50 p-2 active:scale-90"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE OVERLAY SYSTEM ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-white p-10 pt-28 shadow-2xl md:hidden flex flex-col"
            >

              {/* Menu */}
              <nav className="flex flex-col gap-8">
                {NAV_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={withLocale(item.href)}
                    onClick={() => setOpen(false)}
                    className={`text-2xl font-bold transition-colors ${
                      isActive(item.href)
                        ? 'text-[#1e3a5f]'
                        : 'text-slate-800'
                    }`}
                  >
                    {item.label[lang]}
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-auto pt-8 border-t border-slate-100">
                <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">
                  Follow Us
                </p>
                <div className="flex justify-center gap-10 text-slate-900">
                  <Facebook size={22} />
                  <Instagram size={22} />
                  <Send size={22} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
