import { Anuphan } from "next/font/google"

export const homeFont = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
})
// Root typography tokens resolve on <html>, so the font variable must live there too.
export const rootHtmlClassName = homeFont.variable
export const rootBodyClassName = [homeFont.className, "font-body", "antialiased"].join(" ")
