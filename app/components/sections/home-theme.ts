// Homepage design tokens — cloned from the "Organic Store" template:
// cream / mint / pastel palette, flat e-commerce surfaces.
// Scoped to the homepage sections; the rest of the site still uses
// designSystem.ts. Typeface stays IBM Plex Sans Thai (site-wide preference).

export const HOME = {
  // Ink
  ink: "#333333",
  inkMid: "#555555",
  inkSoft: "#888888",

  // Surfaces
  line: "#ececec",
  surface: "#ffffff",
  cream: "#fdfcf5",
  mist: "#f9f9f9",

  // Mint (hero + add-to-cart)
  mint: "#e0f2f1",
  mintSoft: "#e8f5e9",
  mintInk: "#2e7d32",

  // Pastel promo cells
  pink: "#fce4ec",
  yellow: "#fffde7",

  // Misc
  star: "#fbc02d",
  dark: "#333333",
} as const

// Section rhythm — template uses ~60px section padding.
export const SECTION_PAD = "py-14 sm:py-[60px]"
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5"

// Heading helpers — template titles are uppercase + bold. The `uppercase`
// is a no-op for Thai but gives Latin the template look; the tracking
// override neutralises the global -0.035em (which clips Thai marks).
export const DISPLAY_HEADING = "uppercase leading-[1.12] tracking-[0.005em]"
export const SECTION_HEADING = "uppercase leading-[1.2] tracking-[0.012em]"
