/**
 * Placeholder — renders a clean gradient stand-in when no image is available.
 * Use in any spot where <Image> would appear but src is missing.
 */

interface PlaceholderProps {
  /** Short label shown in center (product name, category name, etc.) */
  label?: string
  /** Tailwind class list — must include position, size/aspect, etc.
   *  Defaults to "w-full h-full" */
  className?: string
  /** Visual variant */
  variant?: "product" | "category" | "hero" | "person"
}

const VARIANT_STYLES: Record<
  NonNullable<PlaceholderProps["variant"]>,
  { bg: string; textColor: string }
> = {
  product:  { bg: "#F1F0EC", textColor: "#A8A49E" },
  category: { bg: "#ECEAE4", textColor: "#9A9892" },
  hero:     { bg: "#E8E6E0", textColor: "#9A9892" },
  person:   { bg: "#EEF0EA", textColor: "#A0A89A" },
}

export default function Placeholder({
  label,
  className = "w-full h-full",
  variant = "product",
}: PlaceholderProps) {
  const { bg, textColor } = VARIANT_STYLES[variant]
  const initials = label
    ? label
        .split(/[\s-_]/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : ""

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: bg }}
      aria-hidden
    >
      {initials && (
        <span
          className="select-none font-display text-[1.4em] font-bold uppercase leading-none"
          style={{ color: textColor, letterSpacing: "0.1em" }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
