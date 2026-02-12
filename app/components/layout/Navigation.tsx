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

export default function Navigation({ logo }: { logo: { src: string, alt: string } }) {
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

  const withLocale = (path: string) => (isEN ? (path === '/' ? '/en' : `/en${path}`) : path)
  const isActive = (path: string) => pathname === withLocale(path)

  const toggleLanguage = () => {
    const nextPath = isEN 
      ? pathname.replace(/^\/en/, '') || '/' 
      : pathname === '/' ? '/en' : `/en${pathname}`
    router.push(nextPath)
    // ไม่สั่ง setOpen(false) ที่นี่ เพื่อให้ user เห็นการเปลี่ยนสถานะก่อนเมนูปิด (หรือจะปิดเลยก็ได้ตามสะดวก)
  }

  return (
    <nav className={`fixed top-0 z-100 w-full transition-all duration-300 ${
      scrolled ? 'bg-white/30 backdrop-blur-md py-3 shadow-sm' : 'bg-white py-5'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* Logo Section - จะจางหายไปเมื่อเปิดเมนูมือถือเพื่อไม่ให้ซ้อนทับ */}
        <Link 
          href={withLocale('/')} 
          onClick={() => setOpen(false)}
          className={`relative z-[110] transition-all duration-300 active:scale-95 ${
            open ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {NAV_MENU.map((item) => (
              <li key={item.href} className="relative group">
                <Link
                  href={withLocale(item.href)}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-[#1e3a5f] ${
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

          {/* Desktop Language Toggle */}
          <div 
            onClick={toggleLanguage}
            className="relative flex h-9 w-[84px] cursor-pointer items-center rounded-full bg-slate-100 p-1 shadow-inner hover:bg-slate-200/50 transition-colors"
          >
            <motion.div
              className="absolute h-7 w-[38px] rounded-full bg-white shadow-md"
              initial={false}
              animate={{ x: isEN ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <div className="relative z-10 flex w-full items-center justify-around text-[11px] font-extrabold">
              <span className={!isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>TH</span>
              <span className={isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>EN</span>
            </div>
          </div>
        </div>

        {/* Mobile Controls (Toggle + Hamburger) */}
        <div className="flex items-center gap-3 md:hidden relative z-[110]">
          {/* Language Toggle on Mobile Header */}
          {!open && (
            <div 
              onClick={toggleLanguage}
              className="relative flex h-8 w-[70px] cursor-pointer items-center rounded-full bg-slate-100/80 p-1 shadow-inner backdrop-blur-sm"
            >
              <motion.div
                className="absolute h-6 w-[30px] rounded-full bg-white shadow-sm"
                initial={false}
                animate={{ x: isEN ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              <div className="relative z-10 flex w-full items-center justify-around text-[10px] font-bold">
                <span className={!isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>TH</span>
                <span className={isEN ? 'text-[#1e3a5f]' : 'text-slate-400'}>EN</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-slate-900"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[105] h-full w-[50%] max-w-sm bg-white p-10 pt-24 shadow-2xl md:hidden flex flex-col"
            >
              {/* Logo in Drawer */}
              <div className="absolute top-8 left-10">
                <Image src={logo.src} alt={logo.alt} width={120} height={40} className="h-8 w-auto object-contain" />
              </div>

              <nav className="flex flex-col gap-6 mt-10">
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
                      className={`text-md  font-medium tracking-tighter ${
                        isActive(item.href) ? 'text-[#1e3a5f]' : 'text-slate-800'
                      }`}
                    >
                      {item.label[lang]}
                    </Link>
                  </motion.div>
                ))}
              </nav>

             
              <div className="mt-auto border-t pt-10 border-slate-100">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Follow Us</p>
                <div className="flex justify-center gap-8 text-slate-900">
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Facebook size={20} /></a>
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Instagram size={20} /></a>
                  <a href="#" className="hover:text-[#1e3a5f] transition-transform hover:-translate-y-1"><Send size={20} /></a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}