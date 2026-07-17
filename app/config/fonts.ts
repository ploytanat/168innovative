import { Bai_Jamjuree, IBM_Plex_Mono, IBM_Plex_Sans_Thai } from "next/font/google"

// Body copy — covers both Thai and Latin.
const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
})

// Headings — technical/engineering feel, covers Thai natively.
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin", "thai"],
  weight: ["500", "600", "700"],
  variable: "--font-bai-jamjuree",
  display: "swap",
})

// Spec-sheet accents (product codes, measurements, tags) — Latin/numeric only,
// no Thai glyphs on Google Fonts. Never apply to strings containing Thai text.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const rootBodyClassName = [
  ibmPlexSansThai.variable,
  baiJamjuree.variable,
  ibmPlexMono.variable,
  "font-body",
  "antialiased",
].join(" ")
