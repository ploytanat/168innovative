import {
  Inter,
  Noto_Sans_Thai,
  Plus_Jakarta_Sans,
} from "next/font/google"

const headingLatin = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading-latin",
  display: "swap",
})

const bodyLatin = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-latin",
  display: "swap",
})

const thaiSans = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-thai",
  display: "swap",
})

export const rootBodyClassName = [
  headingLatin.variable,
  bodyLatin.variable,
  thaiSans.variable,
  "font-body",
  "antialiased",
].join(" ")
