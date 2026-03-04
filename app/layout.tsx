import type { Metadata, Viewport } from "next"
import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import Navigation from "./components/layout/Navigation"
import Footer from "./components/layout/Footer"
import BackToTop from "./components/ui/BackToTop"

import { getCompany } from "./lib/api/company"

import {
  Cormorant_Garamond,
  Manrope,
  Noto_Serif_Thai,
  Sarabun,
} from "next/font/google"

/* ================= Fonts ================= */

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

/* ================= Viewport ================= */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/* ================= Metadata ================= */

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany("th")

  const baseUrl = "https://168innovative.co.th"

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: "168 Innovative Co., Ltd.",
      template: "%s | 168 Innovative",
    },

    description:
      "168 Innovative ผู้นำเข้าและจำหน่ายบรรจุภัณฑ์เครื่องสำอาง ขวดปั๊ม กระปุกครีม ขวดสเปรย์ และผลิตภัณฑ์พลาสติกครบวงจร",

    keywords: [
      "168 Innovative",
      "168 Innovative Co Ltd",
      "บริษัท 168 อินโนเวทีฟ",
      "บรรจุภัณฑ์เครื่องสำอาง",
      "ขวดปั๊ม",
      "กระปุกครีม",
      "ขวดสเปรย์",
      "บรรจุภัณฑ์พลาสติก",
      "ขายส่งบรรจุภัณฑ์",
      "โรงงานบรรจุภัณฑ์",
    ],

    alternates: {
      canonical: baseUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: baseUrl,
      title: "168 Innovative Co., Ltd.",
      description:
        "ศูนย์รวมบรรจุภัณฑ์เครื่องสำอางและผลิตภัณฑ์พลาสติก นำเข้าโดยตรงจากโรงงาน",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },

    icons: {
      icon: "/favicon.png",
    },
  }
}

/* ================= Layout ================= */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = "th"
  const company = await getCompany(locale)

  const displayLogo = company?.logo || {
    src: "/fallback-logo.png",
    alt: "168 Innovative",
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "168 Innovative Co., Ltd.",
    url: "https://168innovative.co.th",
    logo: displayLogo.src,
    image: displayLogo.src,
    telephone: company?.phones?.[0]?.number,
    address: {
      "@type": "PostalAddress",
      streetAddress: "89/269 ซอย เทียนทะเล 20",
      addressLocality: "บางขุนเทียน",
      addressRegion: "กรุงเทพมหานคร",
      postalCode: "10150",
      addressCountry: "TH",
    },
    sameAs: [
      "https://www.facebook.com/168innovative",
    ],
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://wb.168innovative.co.th" />
        <link rel="dns-prefetch" href="https://wb.168innovative.co.th" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </head>

      <body
        className={[
          headingEn.variable,
          headingTh.variable,
          bodyEn.variable,
          bodyTh.variable,
          "font-body",
          "antialiased",
        ].join(" ")}
      >
        <Navigation locale={locale} logo={displayLogo} />

        <main className="min-h-screen">{children}</main>

        {company && <Footer company={company} />}

        <BackToTop />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}