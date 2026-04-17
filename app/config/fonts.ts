import {
  Kanit,
  Sarabun,
  Bricolage_Grotesque,
} from "next/font/google"

// English display font — distinctive organic-geometric, feels like premium packaging studio branding
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

// Thai heading font — strong, bold, great for numbers and short labels
const headingFont = Kanit({
  subsets: ["latin", "thai"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
})

const bodyFont = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
})

export const rootBodyClassName = [
  displayFont.variable,
  headingFont.variable,
  bodyFont.variable,
  "font-body",
  "antialiased",
].join(" ")
