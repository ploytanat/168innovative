import {
  Cormorant_Garamond,
  Manrope,
  Noto_Serif_Thai,
  Sarabun,
} from "next/font/google"

const headingEn = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading-en",
  display: "swap",
})

const headingTh = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["400", "700"],
  variable: "--font-heading-th",
  display: "swap",
})

const bodyEn = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body-en",
  display: "swap",
})

const bodyTh = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "600"],
  variable: "--font-body-th",
  display: "swap",
})

export const rootBodyClassName = [
  headingEn.variable,
  headingTh.variable,
  bodyEn.variable,
  bodyTh.variable,
  "font-body",
  "antialiased",
].join(" ")
