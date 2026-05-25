// Homepage design tokens — "Organic Store" template clone
// (cream / mint / pastel). Typeface stays IBM Plex Sans Thai.

export const HOME = {
  ink: "#333333",
  inkMid: "#555555",
  inkSoft: "#888888",
  line: "#ececec",
  surface: "#ffffff",
  cream: "#fdfcf5",
  mist: "#f9f9f9",
  mint: "#e0f2f1",
  mintSoft: "#e8f5e9",
  mintInk: "#2e7d32",
  pink: "#fce4ec",
  yellow: "#fffde7",
  star: "#fbc02d",
  dark: "#333333",
} as const

export const SECTION_PAD = "py-14 sm:py-[60px]"
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5"

// `uppercase` is a no-op for Thai; tracking overrides globals.css -0.035em
// which clips Thai vowel/tone marks.
export const DISPLAY_HEADING = "uppercase leading-[1.12] tracking-[0.005em]"
export const SECTION_HEADING = "uppercase leading-[1.2] tracking-[0.012em]"
