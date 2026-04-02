"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/admin", label: "สินค้า", icon: "📦", exact: true },
  { href: "/admin/categories", label: "หมวดหมู่", icon: "📂" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="a-sidebar">
      <nav className="a-sidebar-nav">
        <p className="a-sidebar-section">จัดการเนื้อหา</p>
        {NAV.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`a-sidebar-link${active ? " a-sidebar-link--active" : ""}`}
            >
              <span className="a-sidebar-icon">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
