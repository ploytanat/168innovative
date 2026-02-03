'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

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
  }

  const menu = {
    home: isEN ? 'Home' : 'หน้าหลัก',
    products: isEN ? 'Products' : 'สินค้าของเรา',
    about: isEN ? 'About' : 'เกี่ยวกับเรา',
    contact: isEN ? 'Contact' : 'ติดต่อเรา',
  }

  return (
    <nav className="fixed top-0 z-20 w-full bg-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <div className="text-lg font-bold">168 Innovative</div>

        {/* Desktop Menu */}
        <ul className="hidden gap-6 text-sm md:flex">
          <li><Link href={withLocale('/')}>{menu.home}</Link></li>
          <li><Link href={withLocale('/categories')}>{menu.products}</Link></li>
          <li><Link href={withLocale('/about')}>{menu.about}</Link></li>
          <li><Link href={withLocale('/contact')}>{menu.contact}</Link></li>
        </ul>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200"
        >
          <span
            className={`absolute left-1 top-1 h-5 w-6 rounded-full bg-white  shadow transition ${
              isEN ? 'translate-x-6' : ''
            }`}
          />
          <span className="cursor-pointer absolute left-2 text-xs">TH</span>
          <span className="cursor-pointer absolute right-2 text-xs">EN</span>
        </button>

      </div>
    </nav>
  )
}
