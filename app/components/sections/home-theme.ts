// Shared design tokens for the homepage redesign ("168 Studio").
// Calm, editorial, product-forward — one accent, solid surfaces, restrained shadows.
// Scoped to the homepage sections; the rest of the site still uses designSystem.ts.

export const HOME = {
  // Ink
  ink: "#1a1c20",
  inkMid: "#565961",
  inkSoft: "#8b8e96",

  // Hairlines & surfaces
  line: "#e6e3db",
  lineSoft: "#efece4",
  surface: "#ffffff",
  paper: "#f6f4ef",
  paperDeep: "#eeeae1",

  // Single accent — deep brand blue
  accent: "#2b5092",
  accentDeep: "#1e3d73",
  accentTint: "#e9eef6",
  accentInk: "#1b3a6b",

  // Dark closing section
  darkBg: "#181a1e",
  darkPanel: "#202329",
  onDark: "#f3f2ee",
  onDarkMid: "#b9bcc4",
  onDarkSoft: "#80838c",
  darkLine: "rgba(255,255,255,0.10)",
} as const

// Consistent section rhythm.
export const SECTION_PAD = "py-16 sm:py-20 lg:py-28"
export const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"

// Heading helpers — neutralise the global -0.035em tracking / 1.1 leading,
// which clips Thai vowel and tone marks.
export const DISPLAY_HEADING = "font-heading tracking-[-0.012em] leading-[1.12]"
export const SECTION_HEADING = "font-heading tracking-[-0.008em] leading-[1.16]"

// Soft card shadow, used on hover only.
export const CARD_SHADOW = "0 18px 40px -16px rgba(20,22,28,0.22)"
