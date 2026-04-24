import Image from "next/image"
import Link from "next/link"
import {
  Droplets,
  Eye,
  Package,
  Palette,
  Sparkles,
  SprayCan,
  ArrowRight,
} from "lucide-react"

import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

// ─── Types ──────────────────────────────────────────────────────────────────

type Locale = "th" | "en"

interface CategoryBarProps {
  items: CategoryView[]
  locale: Locale
  /** Slug of the currently active category, if inside a category page */
  activeSlug?: string
}

// ─── Config ─────────────────────────────────────────────────────────────────

const SLOT_CONFIG = {
  spout: {
    icon: Droplets,
    palette: { bg: "#eafffb", iconColor: "#0aa79d", accent: "#9eeaf3" },
  },
  "powder-compact": {
    icon: Palette,
    palette: { bg: "#fff0f5", iconColor: "#ff4f7b", accent: "#ffc2d2" },
  },
  "soap-bag": {
    icon: Package,
    palette: { bg: "#edf7ff", iconColor: "#2f8cff", accent: "#b7dcff" },
  },
  "plastic-pump-bottle-cap": {
    icon: SprayCan,
    palette: { bg: "#f3efff", iconColor: "#8b5cf6", accent: "#d8ccff" },
  },
  "mascara-packaging": {
    icon: Eye,
    palette: { bg: "#fff4df", iconColor: "#ff8a3d", accent: "#ffd49f" },
  },
  "lipstick-packaging": {
    icon: Sparkles,
    palette: { bg: "#fff0f5", iconColor: "#ff4f7b", accent: "#ffc2d2" },
  },
  fallback: {
    icon: Package,
    palette: { bg: "#f7fdff", iconColor: "#0aa79d", accent: "#9eeaf3" },
  },
} as const

type SlotKey = keyof typeof SLOT_CONFIG

const COPY = {
  th: { all: "ดูทั้งหมด", allSub: "สินค้าทุกหมวด" },
  en: { all: "All categories", allSub: "Browse everything" },
} as const

// ─── Helpers ────────────────────────────────────────────────────────────────

function getConfig(slug: string) {
  return SLOT_CONFIG[slug as SlotKey] ?? SLOT_CONFIG.fallback
}

// ─── Single category pill ───────────────────────────────────────────────────
// Used for items index 1+ (smaller, horizontal)

function CategoryPill({
  name,
  slug,
  href,
  image,
  isActive,
}: {
  name: string
  slug: string
  href: string
  image?: { src: string; alt?: string } | null
  isActive: boolean
}) {
  const cfg = getConfig(slug)
  const Icon = cfg.icon

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`
        group relative flex shrink-0 flex-row items-center gap-2 rounded-full px-3.5 py-2
        outline-none transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[#c47b8a] focus-visible:ring-offset-2
        ${isActive
          ? "bg-[#111827] shadow-md"
          : "bg-white shadow-[0_1px_6px_rgba(31,41,55,.06)] hover:shadow-[0_8px_22px_rgba(31,41,55,.10)] hover:-translate-y-0.5"
        }
      `}
    >
      {/* Icon container */}
      <span
        className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ background: isActive ? "rgba(255,255,255,.12)" : cfg.palette.bg }}
      >
        {image?.src ? (
          <Image
            src={image.src}
            alt={image.alt ?? name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <Icon
            className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110"
            style={{ color: isActive ? "#fff" : cfg.palette.iconColor }}
            strokeWidth={1.8}
          />
        )}
      </span>

      {/* Label */}
      <span
        className={`
          whitespace-nowrap text-[11px] font-bold leading-tight
          ${isActive ? "text-white" : "text-[#3a4252]"}
        `}
      >
        {name}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#c47b8a]"
        />
      )}
    </Link>
  )
}

// ─── "View all" end-cap card ─────────────────────────────────────────────────

function ViewAllCard({ href, locale }: { href: string; locale: Locale }) {
  const copy = COPY[locale]

  return (
    <Link
      href={href}
      className="
        group flex shrink-0 flex-col justify-between rounded-2xl border border-dashed
        border-black/10 bg-gradient-to-br from-[#fdf8f5] to-[#f8f0f2]
        px-4 py-3 transition-all duration-200
        hover:border-[#c47b8a]/40 hover:bg-[#fdf5f7] hover:-translate-y-0.5 hover:shadow-[0_3px_12px_rgba(196,123,138,.12)]
      "
    >
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e8ec] transition-transform duration-200 group-hover:scale-110"
      >
        <ArrowRight className="h-4 w-4 text-[#c47b8a]" strokeWidth={2} />
      </span>
      <div>
        <span className="block whitespace-nowrap text-[11px] font-bold text-[#1f2430]">
          {copy.all}
        </span>
        <span className="block whitespace-nowrap text-[10px] text-[#8896a8]">
          {copy.allSub}
        </span>
      </div>
    </Link>
  )
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function CategoryBar({
  items,
  locale,
  activeSlug,
}: CategoryBarProps) {
  if (!items.length) return null

  const capped = items.slice(0, 8)

  return (
    <section
      aria-label={locale === "th" ? "หมวดหมู่สินค้า" : "Product categories"}
      className="border-y border-black/[0.05] bg-[#fbfeff]"
    >
      {/* Scroll container */}
      <div
        className="
          mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          sm:justify-center sm:overflow-visible sm:flex-wrap
        "
        role="list"
      >
        {capped.map((item) => (
          <div key={item.id} role="listitem">
            <CategoryPill
              name={item.name}
              slug={item.slug}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              image={item.image}
              isActive={item.slug === activeSlug}
            />
          </div>
        ))}

        {/* Divider */}
        <div
          aria-hidden
          className="mx-1 self-stretch border-r border-black/[0.06]"
        />

        {/* View all */}
        <div role="listitem">
          <ViewAllCard
            href={withLocalePath("/categories", locale)}
            locale={locale}
          />
        </div>
      </div>
    </section>
  )
}
