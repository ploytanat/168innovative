// Homepage design tokens — green / black / white only.
// Typeface stays IBM Plex Sans Thai.

export const HOME = {
  ink: "#333333",
  inkMid: "#555555",
  inkSoft: "#888888",
  line: "#ececec",
  surface: "#ffffff",
  cream: "#f4f5f0",
  mist: "#f9f9f9",
  mint: "#e6f0d9",     // pale leaf tint (was sage #dbe6ce)
  mintSoft: "#f2f7ea", // whisper leaf (was sage #eef2e7)
  mintInk: "#4a7a1e",  // deep leaf — legible on white (was forest #14532d)
  leaf: "#7cb342",     // bright leaf — signature accent (new)
  dark: "#1a1a1a",     // near-black (was #181a1e)
} as const

export const SECTION_PAD = "py-12 sm:py-16"
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5"

// `uppercase` is a no-op for Thai; tracking overrides globals.css -0.035em
// which clips Thai vowel/tone marks.
export const DISPLAY_HEADING = "uppercase leading-[1.12] tracking-[0.005em]"
export const SECTION_HEADING = "uppercase leading-[1.2] tracking-[0.012em]"
