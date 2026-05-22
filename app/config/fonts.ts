import { IBM_Plex_Sans_Thai } from "next/font/google"

// Single typeface for the whole site — IBM Plex Sans Thai covers both
// Thai and Latin, so headings and body all share one font.
const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
})

export const rootBodyClassName = [
  ibmPlexSansThai.variable,
  "font-body",
  "antialiased",
].join(" ")
