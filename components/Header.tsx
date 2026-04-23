import type { NavLink } from "@/types/homepage"
import { ChevronDown, Search } from "lucide-react"
import Link from "next/link"
interface HeaderProps {
  brandName: string
  searchHref: string
  links: NavLink[]
}

export default function Header({ brandName, searchHref, links }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[1000] bg-white shadow-[0_1px_0_#eee]">
      {/* Row 1 — brand + search + icons */}
      <div className="mx-auto flex max-w-[1200px] items-center gap-[20px] px-[20px] py-[12px]">
        <Link href="/" className="shrink-0 text-[22px] font-black tracking-tight text-[#111]">
          {brandName}
        </Link>

        <form
          action={searchHref}
          method="GET"
          className="flex flex-1 items-center gap-[8px] rounded-[6px] border border-[#e0e0e0] bg-[#f7f7f7] px-[14px] py-[9px]"
        >
          <Search className="h-[16px] w-[16px] shrink-0 text-[#999]" strokeWidth={2} />
          <input
            type="text"
            name="q"
            placeholder="ค้นหาสินค้าทั้งหมด..."
            className="w-full bg-transparent text-[14px] text-[#333] placeholder-[#aaa] outline-none"
          />
        </form>

        <div className="flex shrink-0 items-center gap-[14px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-block h-[20px] w-[20px] rounded-full bg-[#ccc]" />
          ))}
        </div>
      </div>

      {/* Row 2 — category navigation */}
      <div className="border-t border-[#f0f0f0]">
        <nav className="mx-auto max-w-[1200px] px-[20px]">
          <ul className="flex items-center gap-[4px]">
            <li>
              <Link
                href="/categories"
                className="flex items-center gap-[4px] px-[12px] py-[10px] text-[13px] font-bold uppercase text-[#111] hover:text-[#333]"
              >
                สินค้าทั้งหมด
                <ChevronDown className="h-[10px] w-[10px]" strokeWidth={2.5} />
              </Link>
            </li>
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="block px-[12px] py-[10px] text-[13px] font-medium text-[#555] hover:text-[#111]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
