import {
  Kanit,
  Sarabun,
} from "next/font/google"

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
  headingFont.variable,
  bodyFont.variable,
  "font-body",
  "antialiased",
].join(" ")
