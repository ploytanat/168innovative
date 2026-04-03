import Image from "next/image"

import { CLIENT_ACCENT_COLORS, CLIENT_ITEMS } from "@/app/config/clients"
import type { ClientItem } from "@/app/config/clients"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientsSectionProps {
  locale: "th" | "en"
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  th: {
    eyebrow: "ลูกค้าของเรา",
    title: "แบรนด์ที่ไว้วางใจ 168 Innovative",
    subtitle: "เราร่วมงานกับแบรนด์ชั้นนำในอุตสาหกรรมความงามและเครื่องสำอาง",
    stats: [
      { value: "500+", label: "แบรนด์ที่ร่วมงาน" },
      { value: "10+",  label: "ปีประสบการณ์" },
      { value: "50+",  label: "หมวดสินค้า" },
      { value: "24hr", label: "ตอบกลับใบเสนอราคา" },
    ],
  },
  en: {
    eyebrow: "Our Clients",
    title: "Brands That Trust 168 Innovative",
    subtitle: "We partner with leading brands across the beauty and cosmetics industry.",
    stats: [
      { value: "500+", label: "Partner brands" },
      { value: "10+",  label: "Years of experience" },
      { value: "50+",  label: "Product categories" },
      { value: "24hr", label: "Quote turnaround" },
    ],
  },
} as const

// ─── Card ─────────────────────────────────────────────────────────────────────

function ClientCard({ item, index }: { item: ClientItem; index: number }) {
  const accent = CLIENT_ACCENT_COLORS[index % CLIENT_ACCENT_COLORS.length]
  const initials = item.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="glass-frosted mx-3 flex w-44 shrink-0 flex-col items-center gap-2 rounded-3xl px-4 py-5 transition-transform duration-300 hover:-translate-y-1">
      {/* Logo or monogram */}
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
        style={{ background: `${accent}18` }}
      >
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.name}
            width={56}
            height={56}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span
            className="font-heading text-[18px] font-black"
            style={{ color: accent }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Name */}
      <p className="text-center text-[13px] font-bold leading-tight text-[#2c2521]">
        {item.name}
      </p>

      {/* Tag */}
      {item.tag && (
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ background: `${accent}18`, color: accent }}
        >
          {item.tag}
        </span>
      )}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ClientsSection({ locale }: ClientsSectionProps) {
  const copy = COPY[locale]
  // Duplicate items for seamless loop
  const doubled = [...CLIENT_ITEMS, ...CLIENT_ITEMS]

  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      {/* Subtle radial background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,123,138,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c47b8a]">
            {copy.eyebrow}
          </p>
          <h2
            className={`mx-auto mt-3 max-w-[26ch] text-[#1f2430] ${
              locale === "th"
                ? "font-body text-[clamp(1.35rem,2.4vw,2rem)] font-extrabold leading-[1.28]"
                : "font-heading text-[clamp(1.7rem,2.8vw,2.6rem)] font-black leading-[1.06]"
            }`}
          >
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-neutral-500">
            {copy.subtitle}
          </p>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {copy.stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-frosted flex flex-col items-center gap-1 rounded-3xl px-4 py-4"
            >
              <span className="font-heading text-[1.6rem] font-black text-[#c47b8a]">
                {stat.value}
              </span>
              <span className="text-center text-[11px] font-semibold leading-tight text-neutral-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee — full-bleed, faded edges */}
      <div
        className="group relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="animate-marquee">
          {doubled.map((item, i) => (
            <ClientCard key={`${item.id}-${i}`} item={item} index={i % CLIENT_ITEMS.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
