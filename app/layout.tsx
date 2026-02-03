// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'

import { getHome } from './lib/api/home'
import { getCompany } from './lib/api/company'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const home = getHome('th')
  return {
    title: home.seo.title,
    description: home.seo.description,
    keywords: home.seo.keywords,
    formatDetection: {
      telephone: false,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const company = getCompany('th')

  return (
    <html lang="th">
      <body className={inter.className}>
        {/* Fixed Navbar */}
        <Navigation />

        {/* ✅ ชดเชยความสูง Navbar (h-16 = 64px) */}
        <main className="pt-16 bg-custom-gradient">
          {children}
          <Footer company={company} />
        </main>

        <BackToTop />
      </body>
    </html>
  )
}
