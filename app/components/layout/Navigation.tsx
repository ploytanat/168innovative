'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Facebook, Instagram, Send, Globe } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  locale: string
  logo: {
    src: string
    alt: string
  }
}

const NAV_MENU = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/articles', label: { th: 'บทความของเรา', en: 'Articles' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

export default function Navigation({ locale, logo }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = locale === 'en' || pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const withLocale = (path: string) =>
    isEN ? (path === '/' ? '/en' : `/en${path}`) : path

  const isActive = (path: string) => pathname === withLocale(path)

  const toggleLanguage = useCallback(() => {
    const nextPath = isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(nextPath)
  }, [isEN, pathname, router])

  return (
    <>
      <header
        className={`fixed top-0 z-[60] w-full transition-all duration-500 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
            : 'bg-white py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          
          {/* Logo */}
          <Link
            href={withLocale('/')}
            className="relative z-[70] transition-transform active:scale-95"
            onClick={() => setOpen(false)}
          >
            <Image
              src={logo.src}
              alt={logo.alt || 'Company logo'}
              width={160}
              height={50}
              priority
              className="h-10 md:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {NAV_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={withLocale(item.href)}
                    className={`relative text-[13px] font-bold uppercase tracking-wider transition-colors ${
                      isActive(item.href) ? 'text-[#14B8A6]' : 'text-[#1A2535] hover:text-[#14B8A6]'
                    }`}
                  >
                    {item.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-4 w-px bg-gray-200" />

            <button
              type="button"
              onClick={toggleLanguage}
              className="group flex items-center gap-2 text-[13px] font-bold text-[#1A2535] hover:text-[#14B8A6] transition-colors"
            >
              <Globe size={14} className="text-gray-400 group-hover:text-[#14B8A6]" />
              {isEN ? 'TH' : 'EN'}
            </button>
          </div>

          {/* Mobile Menu Button - แก้ไขแบบถาวร */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative z-[70] md:hidden p-2 text-[#1A2535]"

            aria-controls="mobile-nav-panel" // อ้างอิง ID ที่มีอยู่ตลอดเวลา
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Panel Structure */}
      <div id="mobile-nav-panel" className="md:hidden">
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[50] bg-[#1A2535]/40 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Drawer Content */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 z-[55] h-full w-full max-w-[320px] bg-white p-8 pt-28 shadow-2xl flex flex-col"
              >
                <nav className="flex flex-col gap-5">
                  {NAV_MENU.map((item, idx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={withLocale(item.href)}
                        onClick={() => setOpen(false)}
                        className={`text-2xl font-bold ${
                          isActive(item.href) ? 'text-[#14B8A6]' : 'text-[#1A2535]'
                        }`}
                      >
                        {item.label[lang]}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto space-y-8 pt-10 border-t border-gray-100">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-3 text-lg font-bold text-[#1A2535]"
                  >
                    <Globe size={20} className="text-[#14B8A6]" />
                    {isEN ? 'ภาษาไทย' : 'English Edition'}
                  </button>
                  <div className="flex gap-6">
                    <Facebook size={22} className="text-[#1A2535] hover:text-[#14B8A6]" />
                    <Instagram size={22} className="text-[#1A2535] hover:text-[#14B8A6]" />
                    <Send size={22} className="text-[#1A2535] hover:text-[#14B8A6]" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}