// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'

//import { getHomeSEO } from './lib/api/seo'
import { getCompany } from './lib/api/company'

const inter = Inter({ subsets: ['latin'] })

// export async function generateMetadata(): Promise<Metadata> {
 // const seo = getHomeSEO('th')
 // return {
 //     title: seo.title,
 //     description: seo.description,
 //     keywords: seo.keywords,
 //     formatDetection: {
 //       telephone: false,
 //     },
 //   }
 // }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const company = await getCompany('th')
  return (
    <html lang="th">
      <body className={inter.className}>
        <Navigation logo={company.logo} />
        <main className="pt-16 bg-custom-gradient">
          {children}
          <Footer company={company} locale='th' />
        </main>
        <BackToTop />
      </body>
    </html>
  )
}
