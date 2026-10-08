import { Anuphan } from "next/font/google"

export const homeFont = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
})
export const rootBodyClassName = [homeFont.variable, "font-body", "antialiased"].join(" ")
