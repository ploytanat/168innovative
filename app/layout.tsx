// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'
import { getCompany } from './lib/api/company'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>

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

        <main className="pt-16 bg-custom-gradient min-h-screen">
          {children}
        </main>

        {company && <Footer company={company} />}

        <BackToTop />
      </body>
    </html>
  )
}