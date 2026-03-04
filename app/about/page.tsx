// app/about/page.tsx

import { Metadata } from 'next'
import AboutHero from '../components/sections/AboutHero'
import WhyChooseUs from '../components/sections/WhyChooseUs'

import { getAbout } from '../lib/api/about'
import { getWhy } from '../lib/api/why'

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'th'
  const about = await getAbout(locale)

  const title =
    about?.seoTitle ||
    'เกี่ยวกับเรา | 168 Innovative'

  const description =
    about?.seoDescription ||
    'ทำความรู้จักกับ 168 Innovative ผู้นำเข้าและจำหน่ายบรรจุภัณฑ์เครื่องสำอางและผลิตภัณฑ์พลาสติกครบวงจร'

  return {
    title,
    description,

    keywords: [
      'เกี่ยวกับเรา',
      '168 Innovative',
      'บรรจุภัณฑ์เครื่องสำอาง',
      'โรงงานบรรจุภัณฑ์',
      'OEM packaging'
    ],

    alternates: {
      canonical: 'https://168innovative.co.th/about',
    },

    openGraph: {
      title,
      description,
      url: 'https://168innovative.co.th/about',
      siteName: '168 Innovative',
      locale: 'th_TH',
      type: 'website',
      images: [
        {
          url: '/og-about.jpg',
          width: 1200,
          height: 630,
          alt: 'About 168 Innovative',
        },
      ],
    },
  }
}

export default async function AboutPage() {
  const locale = 'th'

  // fetch พร้อมกัน
  const [about, why] = await Promise.all([
    getAbout(locale),
    getWhy(locale),
  ])

  if (!about) return null

  return (
    <main className="bg-[#eeeeee]">
      <AboutHero
        hero={about.hero}
        whoAreWe={about.whoAreWe}
      />

      <WhyChooseUs
        items={why}
        locale={locale}
      />
    </main>
  )
}