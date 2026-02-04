'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

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
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">

        {/* ===== Logo ===== */}
        <Link href={withLocale('/')} className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={140}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden gap-8 text-[15px] font-medium md:flex items-center">
          {menu.map(item => (
            <li key={item.href}>
              <Link
                href={withLocale(item.href)}
                className={`transition-colors duration-200 hover:text-[#1e3a5f] ${
                  isActive(item.href)
                    ? 'text-[#1e3a5f] font-bold'
                    : 'text-gray-500'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLanguage}
            className="group flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#1e3a5f]"
          >
            <span className={!isEN ? 'text-[#1e3a5f]' : ''}>TH</span>
            <div className="h-3 w-px bg-gray-300" />
            <span className={isEN ? 'text-[#1e3a5f]' : ''}>EN</span>
          </button>

          <button
            className="md:hidden text-[#1e3a5f]"
            aria-label="Open menu"
            onClick={() => setOpen(prev => !prev)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white absolute w-full left-0 animate-in fade-in slide-in-from-top-5">
          <ul className="flex flex-col text-base font-medium">
            {menu.map(item => (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  onClick={() => setOpen(false)}
                  className={`block px-8 py-5 border-b border-gray-50 ${
                    isActive(item.href)
                      ? 'bg-blue-50/50 text-[#1e3a5f]'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
