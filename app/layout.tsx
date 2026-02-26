import type { Metadata } from 'next'
import './globals.css'

import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'
import { getCompany } from './lib/api/company'

import {
  Cormorant_Garamond,
  Manrope,
  Noto_Serif_Thai,
  Sarabun,
} from 'next/font/google'

/* ================= Fonts ================= */

const headingEn = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading-en',
  display: 'swap',
})

const headingTh = Noto_Serif_Thai({
  subsets: ['thai'],
  weight: ['400', '700'],
  variable: '--font-heading-th',
  display: 'swap',
})

const bodyEn = Manrope({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body-en',
  display: 'swap',
})

const bodyTh = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '600'],
  variable: '--font-body-th',
  display: 'swap',
})

/* ================= Metadata ================= */

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany('th')

  const companyName = company?.name || '168 Innovative'
  const description = company?.address || 'Packaging & Cosmetic Solutions'
  const baseUrl = 'https://168innovative.co.th'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: companyName,
      template: `%s | ${companyName}`,
    },
    description,
    keywords: [
      'บรรจุภัณฑ์',
      'ผลิตภัณฑ์พลาสติก',
      'นำเข้าบรรจุภัณฑ์',
      'บรรจุภัณฑ์เครื่องสำอาง',
      'ขวดปั๊ม',
      'ขวดสเปรย์',
      'ขายส่งบรรจุภัณฑ์',
      'โรงงานผลิตบรรจุภัณฑ์',
      'OEM',
      '168 Innovative',
    ],
    openGraph: {
      type: 'website',
      url: baseUrl,
      title: companyName,
      description,
      images: [
        {
          url: company?.logo?.src || '/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
    icons: {
      icon: '/favicon.png',
    },
  }
}

/* ================= Layout ================= */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = 'th'
  const company = await getCompany(locale)

  const displayLogo = company?.logo || {
    src: '/fallback-logo.png',
    alt: company?.name || 'Logo',
  }

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to WordPress API and CDN */}
        <link rel="preconnect" href="https://wb.168innovative.co.th" />
        <link rel="dns-prefetch" href="https://wb.168innovative.co.th" />
        {/* Preload key fonts */}
        <link rel="preload" as="font" href="/fonts/heading.woff2" crossOrigin="anonymous" />
      </head>
      <body
        className={[
          headingEn.variable,
          headingTh.variable,
          bodyEn.variable,
          bodyTh.variable,
          'font-body',           // default font ทั้งหน้า
          'antialiased',         // text rendering ดีขึ้นชัดเจน
        ].join(' ')}
      >
        {/* LocalBusiness Schema (Global) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: company?.name || '168 Innovative',
              url: 'https://168innovative.co.th',
              logo: displayLogo.src,
              image: displayLogo.src,
              telephone: company?.phones?.[0]?.number,
              address: {
                '@type': 'PostalAddress',
                streetAddress: '89/269 ซอย เทียนทะเล 20',
                addressLocality: 'บางขุนเทียน',
                addressRegion: 'กรุงเทพมหานคร',
                postalCode: '10150',
                addressCountry: 'TH',
              },
            }),
          }}
        />

        <Navigation locale={locale} logo={displayLogo} />

        <main className="min-h-screen">
          {children}
        </main>

        {company && <Footer company={company} />}

        <BackToTop />
      </body>
    </html>
  )
}