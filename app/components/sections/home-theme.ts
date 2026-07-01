// Homepage design tokens — "Organic Store" template clone
// (cream / mint / pastel). Typeface stays IBM Plex Sans Thai.

export const HOME = {
  ink: "#333333",
  inkMid: "#555555",
  inkSoft: "#888888",
  line: "#ececec",
  surface: "#ffffff",
  cream: "#f4f5f0",
  mist: "#f9f9f9",
  mint: "#dbe6ce",
  mintSoft: "#eef2e7",
  mintInk: "#14532d",
  // Editorial pastel splash — playful accents over the forest base
  peach: "#f2c8b6",
  peachSoft: "#f5ddd0",
  peachInk: "#a15e42",
  sky: "#c8dcee",
  skySoft: "#dbe9f5",
  skyInk: "#3a6587",
  butter: "#ebd275",
  butterSoft: "#f0e6b5",
  butterInk: "#7a5a13",
  pink: "#fce4ec",
  yellow: "#fffde7",
  star: "#fbc02d",
  dark: "#333333",
} as const

export const SECTION_PAD = "py-12 sm:py-16"
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5"

// `uppercase` is a no-op for Thai; tracking overrides globals.css -0.035em
// which clips Thai vowel/tone marks.
export const DISPLAY_HEADING = "uppercase leading-[1.12] tracking-[0.005em]"
export const SECTION_HEADING = "uppercase leading-[1.2] tracking-[0.012em]"
