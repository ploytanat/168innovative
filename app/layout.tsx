import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { getHome } from './lib/api/home';
import { getCompany } from './lib/api/company';
import BackToTop from './components/ui/BackToTop';

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



export default function RootLayout({ children }: { children: React.ReactNode }) {

  const company = getCompany('th')
  return (
    <html lang="th">
      <body className={inter.className}>
        <Navigation />
        <div className="bg-custom-gradient">
       {children}
       <BackToTop />
       <Footer  company={company}/>
        </div>
 
        
      </body>
    </html>
  )
}
