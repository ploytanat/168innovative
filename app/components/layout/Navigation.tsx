'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isEN = pathname.startsWith('/en')

  const withLocale = (path: string) => {
    if (isEN) return path === '/' ? '/en' : `/en${path}`
    return path
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
    <nav className="fixed top-0 z-20 w-full bg-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <div className="text-lg font-bold">168 Innovative</div>

        {/* Desktop Menu */}
        <ul className="hidden gap-6 text-sm md:flex">
          {menu.map(item => (
            <li key={item.href}>
              <Link href={withLocale(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200"
          >
            <span
              className={`absolute left-1 top-1 h-5 w-6 rounded-full bg-white shadow transition ${
                isEN ? 'translate-x-6' : ''
              }`}
            />
            <span className="absolute left-2 text-xs">TH</span>
            <span className="absolute right-2 text-xs">EN</span>
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(prev => !prev)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <ul className="flex flex-col divide-y text-sm">
            {menu.map(item => (
              <li key={item.href}>
                <Link
                  href={withLocale(item.href)}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4"
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
