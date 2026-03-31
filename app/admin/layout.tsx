'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tag,
  FileText,
  Home,
  Building2,
  Info,
  Navigation,
  Search,
  Settings,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: <Package size={16} /> },
      { href: '/admin/categories', label: 'Categories', icon: <Tag size={16} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/articles', label: 'Articles', icon: <FileText size={16} /> },
    ],
  },
  {
    title: 'Pages',
    items: [
      { href: '/admin/homepage', label: 'Homepage', icon: <Home size={16} /> },
      { href: '/admin/company', label: 'Company', icon: <Building2 size={16} /> },
      { href: '/admin/about', label: 'About', icon: <Info size={16} /> },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/navigation', label: 'Navigation', icon: <Navigation size={16} /> },
      { href: '/admin/seo', label: 'SEO', icon: <Search size={16} /> },
    ],
  },
]

function SidebarLink({ href, label, icon }: NavItem) {
  const pathname = usePathname()
  const isActive =
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] min-w-[260px] bg-gray-950 flex flex-col border-r border-gray-800 overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              168
            </div>
            <span className="font-semibold text-white text-base">168 Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title || 'main'}>
              {group.title && (
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 px-3 mb-2">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">Live Database</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
        {children}
      </main>
    </div>
  )
}
