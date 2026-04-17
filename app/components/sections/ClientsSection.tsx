import Image from "next/image"

import { CLIENT_ACCENT_COLORS, CLIENT_ITEMS } from "@/app/config/clients"
import type { ClientItem } from "@/app/config/clients"
import Placeholder from "@/app/components/ui/Placeholder"

interface ClientsSectionProps {
  locale: "th" | "en"
}

const COPY = {
  th: {
    eyebrow: "ลูกค้าของเรา",
    title: "แบรนด์ที่ไว้วางใจ 168 Innovative",
    subtitle: "ร่วมงานกับแบรนด์ชั้นนำในอุตสาหกรรมความงามและเครื่องสำอาง",
  },
  en: {
    eyebrow: "Our Clients",
    title: "Brands That Trust 168 Innovative",
    subtitle: "Partnering with leading brands across the beauty and cosmetics industry.",
  },
} as const

function LogoChip({ item, index }: { item: ClientItem; index: number }) {
  const accent = CLIENT_ACCENT_COLORS[index % CLIENT_ACCENT_COLORS.length]
  const initials = item.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="mx-2.5 flex shrink-0 items-center gap-3 rounded-2xl border border-[#e3e1da] bg-white px-5 py-3 transition-transform duration-300 hover:-translate-y-0.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{ background: `${accent}12` }}
      >
        {item.logo ? (
          <Image src={item.logo} alt={item.name} width={36} height={36} className="h-full w-full object-contain p-1" />
        ) : (
          <span className="font-display text-[13px] font-bold" style={{ color: accent }}>
            {initials}
          </span>
        )}
      </div>

      <p className="whitespace-nowrap text-[13px] font-semibold text-[#3d3d38]">
        {item.name}
      </p>

      {item.tag && (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${accent}10`, color: accent }}
        >
          {item.tag}
        </span>
      )}
    </div>
  )
}

export default function ClientsSection({ locale }: ClientsSectionProps) {
  const copy = COPY[locale]
  const doubled = [...CLIENT_ITEMS, ...CLIENT_ITEMS]

  return (
    <section className="relative overflow-hidden border-t border-[#e3e1da] bg-[#f8f8f4] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
              {copy.eyebrow}
            </p>
            <h2
              className={`mt-2 text-[#141412] ${
                locale === "th"
                  ? "font-body text-[clamp(1.35rem,2.4vw,2rem)] font-extrabold leading-tight"
                  : "font-display text-[clamp(1.7rem,2.8vw,2.5rem)] font-bold leading-[1.06]"
              }`}
            >
              {copy.title}
            </h2>
            <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#6b6b64]">
              {copy.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div
        className="group relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="animate-marquee py-1">
          {doubled.map((item, i) => (
            <LogoChip key={`${item.id}-${i}`} item={item} index={i % CLIENT_ITEMS.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
