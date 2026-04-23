import { Kanit } from "next/font/google"

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
})

export const rootBodyClassName = [
  kanit.variable,
  "font-body",
  "antialiased",
].join(" ")
