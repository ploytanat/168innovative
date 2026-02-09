'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  logo: {
    src: string
    alt: string
  }
}

export default function Navigation({ logo }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isEN = pathname.startsWith('/en')

  /* ======================
     Close mobile menu on resize
  ====================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ======================
     Lock body scroll on mobile menu open
  ====================== */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* ======================
     Locale helpers
  ====================== */
  const withLocale = (path: string) => {
    if (isEN) return path === '/' ? '/en' : `/en${path}`
    return path
  }

  const isActive = (path: string) => {
    const localizedPath = withLocale(path)
    return pathname === localizedPath
  }

  function toggleLanguage() {
    const nextPath = isEN
      ? pathname.replace(/^\/en/, '') || '/'
      : pathname === '/' ? '/en' : `/en${pathname}`

    router.push(nextPath)
    setOpen(false)
  }

  const menu = [
    { href: '/', label: isEN ? 'Home' : 'หน้าหลัก' },
    { href: '/categories', label: isEN ? 'Products' : 'สินค้าของเรา' },
    { href: '/about', label: isEN ? 'About' : 'เกี่ยวกับเรา' },
    { href: '/contact', label: isEN ? 'Contact' : 'ติดต่อเรา' },
  ]

  return (
    <nav className="fixed top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">

        {/* ===== Logo ===== */}
        <Link
          href={withLocale('/')}
          className="relative z-[110] flex items-center transition-transform active:scale-95"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={140}
            height={40}
            priority
            className="h-9 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* ===== Desktop Menu ===== */}
        <ul className="hidden md:flex items-center gap-10 text-[14px] font-bold tracking-wide">
          {menu.map(item => (
            <li key={item.href} className="relative group">
              <Link
                href={withLocale(item.href)}
                className={`transition-colors duration-300 hover:text-[#1e3a5f] ${
                  isActive(item.href) ? 'text-[#1e3a5f]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </Link>

              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-[31px] left-0 right-0 h-[3px] bg-[#1e3a5f] rounded-full"
                />
              )}
            </li>
          ))}
        </ul>

        {/* ===== Right Actions ===== */}
        <div className="relative z-[110] flex items-center gap-4">


          {/* ===== Language Toggle ===== */}
<button
  onClick={toggleLanguage}
  aria-label="Toggle Language"
  className={`
    relative flex items-center w-[72px] h-[34px] rounded-full cursor-pointer
    border border-slate-300/50 shadow-inner
    transition-all duration-500 overflow-hidden
    ${isEN ? 'bg-slate-100' : 'bg-slate-100'}
  `}
>
  {/* 1. ปุ่ม Knob ที่เลื่อนไปมา (ลอยอยู่เหนือตัวอักษร) */}
  <motion.div
    initial={false}
    animate={{ x: isEN ? 36 : 4 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className="absolute z-10 w-[32px] h-[26px] bg-white rounded-full shadow-md flex items-center justify-center pointer-events-none"
  >
    {/* แสดงภาษาปัจจุบันใน Knob เพื่อความชัดเจนที่สุด */}
    <span className="text-[10px] font-black text-slate-900">
      {isEN ? 'EN' : 'TH'}
    </span>
  </motion.div>

  {/* 2. พื้นหลัง Label (อยู่ด้านล่าง Knob) */}
  <div className="flex w-full justify-between px-3 relative z-0">
    <span className={`text-[10px] font-black transition-opacity duration-300 ${isEN ? 'opacity-40 text-slate-900' : 'opacity-0'}`}>
      TH
    </span>
    <span className={`text-[10px] font-black transition-opacity duration-300 ${!isEN ? 'opacity-40 text-slate-900' : 'opacity-0'}`}>
      EN
    </span>
  </div>
</button>

          {/* ===== Hamburger ===== */}
         <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-900 transition-active active:scale-90"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

{/* ===== Mobile Menu Overlay ===== */}
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] md:hidden" 
      >
        {/* Backdrop: แผ่นสีมืดจางๆ ช่วยให้เมนูสี Amber/White ดูลอยเด่นขึ้น */}
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" 
          onClick={() => setOpen(false)} 
        />

        {/* Menu Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="
            absolute right-0 top-0 h-full w-[80%] max-w-sm
            bg-white shadow-2xl p-8 pt-24
          "
        >
          <nav className="flex flex-col gap-2">
            {menu.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                <Link
                  href={withLocale(item.href)}
                  onClick={() => setOpen(false)}
                  className={`
                    block py-5 text-2xl font-black
                    border-b border-slate-50
                    transition-colors
                    ${isActive(item.href) ? 'text-[#1e3a5f]' : 'text-slate-400'}
                  `}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Social Footer */}
          <div className="mt-12">
             <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Follow Us
             </p>
             <div className="flex gap-6 text-slate-900 font-bold">
               <a href="#" className="hover:text-[#1e3a5f]">FB</a>
               <a href="#" className="hover:text-[#1e3a5f]">LN</a>
               <a href="#" className="hover:text-[#1e3a5f]">IG</a>
             </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

    </nav>
  )
}
