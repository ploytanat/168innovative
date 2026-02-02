import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { getHome } from './lib/api/home';
import { getCompany } from './lib/api/company';

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const home = getHome('th')
  return {
    title: home.seo.title,
    description: home.seo.description,
    keywords: home.seo.keywords,
  }
}



export default function RootLayout({ children }: { children: React.ReactNode }) {

  const company = getCompany('th')
  return (
    <html >
      <body className={inter.className}>
        <Navigation />
        <div className="bg-gradient-to-r from-[#bcd6e083] via-[#F5E3E6] to-[#FCF6E5]">
       {children}
       <Footer  company={company}/>
        </div>
 
        
      </body>
    </html>
  )
}
