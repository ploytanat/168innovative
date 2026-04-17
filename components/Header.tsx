import type { NavLink } from "@/types/homepage"

interface HeaderProps {
  links: NavLink[]
}

export default function Header({ links }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[1000] border-b border-[#eee] bg-white py-[15px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[20px]">
        <a href="#" className="text-[24px] font-bold text-[#333]">
          ORGANIC STORE
        </a>
        <nav>
          <ul className="flex gap-[20px]">
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a href={link.href} className="text-[14px] font-bold uppercase text-[#333]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-[15px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="inline-block h-[20px] w-[20px] rounded-full bg-[#ccc]"
            />
          ))}
        </div>
      </div>
    </header>
  )
}
