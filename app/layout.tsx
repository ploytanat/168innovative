// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
const inter = Inter({ subsets: ['latin'] })
const headingEn = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-en',
  display: 'swap',
})

const headingTh = Noto_Serif_Thai({
  subsets: ['thai'],
  weight: ['400'],
  variable: '--font-heading-th',
  display: 'swap',
})

const bodyEn = Manrope({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body-en',
  display: 'swap',
})

const bodyTh = Sarabun({
  subsets: ['thai'],
  weight: ['400', '500'],
  variable: '--font-body-th',
  display: 'swap',
})

/* ================= Metadata ================= */

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany('th')

  const companyName = company?.name || '168 Innovative'
  const description =
    company?.address || 'Packaging & Cosmetic Solutions'
  const baseUrl = 'https://168innovative.co.th'

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: companyName,
      template: `%s | ${companyName}`,
    },

    description,

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
      <body 
        className={`
          ${headingEn.variable}
          ${headingTh.variable}
          ${bodyEn.variable}
          ${bodyTh.variable}
        `}
      >

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: company?.name || '168 Innovative',
              url: 'https://168innovative.co.th',
              logo: displayLogo.src,
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                areaServed: 'TH',
                availableLanguage: ['Thai', 'English'],
              },
            }),
          }}
        />

        <Navigation locale={locale} logo={displayLogo} />

        <main className="   min-h-screen">
          {children}
        </main>

        {company && <Footer company={company} />}

        <BackToTop />
      </body>
    </html>
  )
}