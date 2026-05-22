import { Boxes, Factory, ShieldCheck, Truck } from "lucide-react"

import { CONTAINER, HOME } from "./home-theme"

const ITEMS = [
  { Icon: Factory,     th: "นำเข้าตรงจากโรงงาน",          en: "Direct factory import" },
  { Icon: ShieldCheck, th: "วัสดุ Food & Cosmetic Grade", en: "Food & cosmetic grade" },
  { Icon: Boxes,       th: "รองรับงาน OEM / ODM",         en: "OEM & ODM ready" },
  { Icon: Truck,       th: "จัดส่งทั่วประเทศ",             en: "Nationwide delivery" },
] as const

export default function UspBar({ locale }: { locale: "th" | "en" }) {
  return (
    <section
      style={{
        background: HOME.cream,
        borderTop: `1px solid ${HOME.line}`,
        borderBottom: `1px solid ${HOME.line}`,
      }}
    >
      <div className={CONTAINER}>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 md:grid-cols-4">
          {ITEMS.map(({ Icon, th, en }) => (
            <li key={en} className="flex items-center justify-center gap-2.5">
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={1.8}
                style={{ color: HOME.mintInk }}
                aria-hidden="true"
              />
              <span
                className="text-[12px] font-bold uppercase tracking-[0.04em]"
                style={{ color: HOME.inkMid }}
              >
                {locale === "th" ? th : en}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
