// Shared brand palette: navy sampled from the company logo.
export const HOME = {
  ink: "#263859",
  inkMid: "#52627a",
  inkSoft: "#69778b",
  line: "#e2e8f0",
  surface: "#ffffff",
  cream: "#f1f5f9",
  mist: "#f6f8fb",
  mint: "#e4ecf5",
  mintSoft: "#f0f4f9",
  mintInk: "#263859",
  leaf: "#263859",
  dark: "#1b2940",
  darkText: "#ffffff",
  darkMuted: "#b5b7bc",
  darkDim: "#8c8f96",
  darkLine: "rgba(255,255,255,0.14)",
  darkTile: "rgba(255,255,255,0.06)",
} as const

export const SECTION_PAD = "py-12 sm:py-16"
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5"

// `uppercase` is a no-op for Thai; tracking overrides globals.css -0.035em
// which clips Thai vowel/tone marks.
export const DISPLAY_HEADING = ""
export const SECTION_HEADING = ""
