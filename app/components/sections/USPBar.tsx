import { Award, Clock, Package, Settings2, Truck, Users } from "lucide-react"

type Locale = "th" | "en"

const ITEMS = {
  th: [
    { Icon: Package,   label: "ตัวอย่างสินค้าฟรี" },
    { Icon: Award,     label: "ISO รับรอง" },
    { Icon: Settings2, label: "OEM/ODM ครบวงจร" },
    { Icon: Clock,     label: "ตอบกลับ 24 ชม." },
    { Icon: Truck,     label: "ส่งทั่วประเทศ" },
    { Icon: Users,     label: "500+ แบรนด์คู่ค้า" },
  ],
  en: [
    { Icon: Package,   label: "Free Sample" },
    { Icon: Award,     label: "ISO Certified" },
    { Icon: Settings2, label: "Full OEM / ODM" },
    { Icon: Clock,     label: "Quote in 24 h" },
    { Icon: Truck,     label: "Nationwide Delivery" },
    { Icon: Users,     label: "500+ Partner Brands" },
  ],
} as const

export default function USPBar({ locale }: { locale: Locale }) {
  const items = ITEMS[locale]
  return (
    <div className="border-b border-[#e3e1da] bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex min-w-max items-center divide-x divide-[#e3e1da] lg:min-w-0 lg:justify-between">
          {items.map(({ Icon, label }, i) => (
            <li
              key={i}
              className="flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold text-[#3d3d38] first:pl-0 last:pr-0 lg:flex-1 lg:justify-center lg:px-3"
            >
              <Icon className="h-[15px] w-[15px] shrink-0 text-[#4c6b35]" strokeWidth={1.9} />
              <span className="whitespace-nowrap">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
