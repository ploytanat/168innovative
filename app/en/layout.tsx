// app/en/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Navigation from '../components/layout/Navigation'
import Footer from '../components/layout/Footer'
import BackToTop from '../components/ui/BackToTop'

import { getHome } from '../lib/api/home'
import { getCompany } from '../lib/api/company'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const home = getHome('en')
  return {
    title: home.seo.title,
    description: home.seo.description,
    keywords: home.seo.keywords,
    formatDetection: {
      telephone: false,
    },
  }
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const company = getCompany('en')

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />

        {/* 👇 สำคัญที่สุด */}
        <main className="pt-16 bg-custom-gradient">
          {children}
          <Footer company={company} />
        </main>

        <BackToTop />
      </body>
    </html>
  )
}
