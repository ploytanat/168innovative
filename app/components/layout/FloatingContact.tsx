import { MessageCircle, Phone } from "lucide-react"

import { HOME } from "@/app/components/sections/home-theme"
import type { Locale } from "@/app/lib/types/content"

const COPY = {
  th: { line: "แชทผ่าน LINE", call: "โทรหาเรา" },
  en: { line: "Chat on LINE", call: "Call us" },
} as const

export default function FloatingContact({
  locale,
  lineUrl,
  phone,
}: {
  locale: Locale
  lineUrl?: string
  phone?: string
}) {
  if (!lineUrl && !phone) return null

  const t = COPY[locale]

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {lineUrl && (
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.line}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-sm)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e]"
          style={{ background: HOME.leaf, color: HOME.ink }}
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2} />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone.replace(/-/g, "")}`}
          aria-label={t.call}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-sm)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7a1e]"
          style={{ background: HOME.surface, color: HOME.mintInk, border: `1px solid ${HOME.line}` }}
        >
          <Phone className="h-6 w-6" strokeWidth={2} />
        </a>
      )}
    </div>
  )
}
