import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { rootBodyClassName } from "@/app/config/fonts"

interface RootDocumentProps {
  lang: "th" | "en"
  children: ReactNode
}

export default function RootDocument({
  lang,
  children,
}: RootDocumentProps) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://wb.168innovative.co.th" />
        <link rel="dns-prefetch" href="https://wb.168innovative.co.th" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800,900&display=swap"
        />
      </head>
      <body className={rootBodyClassName}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
