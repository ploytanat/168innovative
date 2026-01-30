import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { getHome } from './lib/api/home';
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
  return (
    <html >
      <body className={inter.className}>
        <Navigation />
        <div className='container mx-auto'>
       {children}
        </div>
 
        <Footer />
      </body>
    </html>
  )
}
