'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Facebook, Instagram, Send, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// แยก Menu Items ออกมาเพื่อให้จัดการง่าย
const NAV_MENU = [
  { href: '/', label: { th: 'หน้าหลัก', en: 'Home' } },
  { href: '/categories', label: { th: 'สินค้าของเรา', en: 'Products' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
  { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact' } },
]

export default function Navigation({ logo }: { logo: { src: string, alt: string } }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isEN = pathname.startsWith('/en')
  const lang = isEN ? 'en' : 'th'

  // ตรวจสอบการ Scroll เพื่อเปลี่ยน Style ของ Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // จัดการ Body Scroll เมื่อเปิดเมนูมือถือ
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const isActive = (path: string) => pathname === withLocale(path)

  const toggleLanguage = () => {
    const nextPath = isEN 
      ? pathname.replace(/^\/en/, '') || '/' 
      : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(nextPath)
    setOpen(false)
  }

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* Logo Section */}
        <Link href={withLocale('/')} className="relative z-[110] transition-transform active:scale-95">
          <Image 
            src={logo.src} 
            alt={logo.alt} // สำคัญต่อ SEO
            width={160} 
            height={50} 
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {NAV_MENU.map((item) => (
              <li key={item.href} className="relative group">
                <Link
                  href={withLocale(item.href)}
                  className={`text-sm font-semibold transition-colors duration-300 hover:text-[#1e3a5f] ${
                    isActive(item.href) ? 'text-[#1e3a5f]' : 'text-slate-600'
                  }`}
                >
                  {item.label[lang]}
                </Link>
                {isActive(item.href) && (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#1e3a5f]" 
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all text-[12px] font-bold"
          >
            <Globe size={14} className="text-[#1e3a5f]" />
            <span>{isEN ? 'TH' : 'EN'}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative z-[110] p-2 text-slate-900"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm md:hidden ิเข"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[105] h-full w-[85%] max-w-sm bg-white p-10 pt-32 shadow-2xl md:hidden"
            >
              <nav className="flex flex-col gap-6">
                {NAV_MENU.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={withLocale(item.href)}
                      onClick={() => setOpen(false)}
                      className={`text-4xl font-black tracking-tighter ${
                        isActive(item.href) ? 'text-[#1e3a5f]' : 'text-slate-800'
                      }`}
                    >
                      {item.label[lang]}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-20 border-t pt-10">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Follow Us</p>
                <div className="flex justify-center gap-8 text-slate-900">
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Facebook /></a>
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Instagram /></a>
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Send /></a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}