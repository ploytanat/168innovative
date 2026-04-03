// Static client / partner logo data
// ─────────────────────────────────────────────────────────────────────────────
// To add real logos:
//   1. Drop the image in /public/clients/  (e.g. mistine.png)
//   2. Set  logo: "/clients/mistine.png"  on the entry below
//
// For WordPress-managed logos, see docs/wordpress-clients-setup.md

export type ClientItem = {
  id: string
  name: string
  /** Path relative to /public — e.g. "/clients/brand.png". Omit to show initials. */
  logo?: string
  /** Short industry tag shown below the name */
  tag?: string
}

export const CLIENT_ITEMS: ClientItem[] = [
  { id: "1",  name: "Mistine",           tag: "Beauty" },
  { id: "2",  name: "Oriental Princess", tag: "Skincare" },
  { id: "3",  name: "Smooth E",          tag: "Derma" },
  { id: "4",  name: "Karmart",           tag: "Cosmetics" },
  { id: "5",  name: "Srichand",          tag: "Makeup" },
  { id: "6",  name: "AR Cosmetic",       tag: "OEM" },
  { id: "7",  name: "BSC",               tag: "Cosmetics" },
  { id: "8",  name: "Snail White",       tag: "Skincare" },
  { id: "9",  name: "Sivanna Colors",    tag: "Makeup" },
  { id: "10", name: "Satin",             tag: "Skincare" },
  { id: "11", name: "BioAqua",           tag: "Beauty" },
  { id: "12", name: "Bifesta",           tag: "Cleansing" },
]

// Accent colors cycled per card (index % ACCENT_COLORS.length)
export const CLIENT_ACCENT_COLORS = [
  "#c47b8a",
  "#d4956a",
  "#6b94c7",
  "#5a8e6d",
  "#9b8ec4",
  "#c4a04a",
] as const
