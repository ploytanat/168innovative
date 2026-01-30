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

  return (
    <nav className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="text-lg font-bold">168 Innovative</div>

        {/* Desktop Menu */}
        <ul className="hidden gap-6 text-sm md:flex">
          <li><Link href={withLocale('/')}>Home</Link></li>
          <li><Link href={withLocale('/products')}>Products</Link></li>
          <li><Link href={withLocale('/about')}>About</Link></li>
          <li><Link href={withLocale('/contact')}>Contact</Link></li>
        </ul>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className=" cursor-pointer relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200"
        >
          <span
            className={`absolute left-1 top-1 h-5 w-6 rounded-full bg-white shadow transition ${
              isEN ? 'translate-x-6' : ''
            }`}
          />
          <span className="absolute left-2 text-xs">TH</span>
          <span className="absolute right-2 text-xs">EN</span>
        </button>
      </div>
    </nav>
  )
}
