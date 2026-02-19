// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'
import { getCompany } from './lib/api/company'

const inter = Inter({ subsets: ['latin'] })

// --- จัดการ Metadata ให้ดึงชื่อจาก WordPress ---
export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany('th')
  return {
    title: {
      default: company?.name || 'My Company',
      template: `%s | ${company?.name || 'My Company'}`
    },
    description: company?.address || 'รายละเอียดบริษัท',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = 'th'; 

  // ดึงข้อมูลบริษัท
  const company = await getCompany(locale)

  // เตรียม Logo สำรองหากในระบบไม่มีข้อมูล
  const displayLogo = company?.logo || { 
    src: '/fallback-logo.png', 
    alt: company?.name || 'Logo' 
  };

  return (
    <html lang={locale}>
      <body className={inter.className}>
        {/* ส่งค่าไปให้ Navigation */}
        <Navigation locale={locale} logo={displayLogo} />

        {/* คำแนะนำ: หาก bg-custom-gradient เป็นสีอ่อน 
           อย่าลืมเช็คสีตัวอักษรในส่วนของ Navigation ด้วยนะครับ 
        */}
        <main className="pt-16 bg-custom-gradient min-h-screen">
          {children}
        </main>

        {company && <Footer company={company}  />}

        <BackToTop />
      </body>
    </html>
  )
}