// app/about/page.tsx
import { Metadata } from 'next'
import AboutHero from '../components/sections/AboutHero'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import { getAbout } from '../lib/api/about'
import { getAboutSEO } from '../lib/api/seo'
import { getWhy } from '../lib/api/why'

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'th'
  const seo = getAboutSEO(locale)
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  }
}

export default async function AboutPage() {
  const locale = 'th'

  // ✅ fetch พร้อมกัน ไม่มี waterfall
  // ✅ getWhy เรียกที่นี่ที่เดียว ไม่ซ้ำใน getAbout อีกต่อไป
  const [about, why] = await Promise.all([
    getAbout(locale),
    getWhy(locale),
  ])

  if (!about) return null

  return (
    // ✅ ลบ container ซ้อน และแก้สี bg ที่พิมพ์ผิด (#eeee → #eeeeee)
    <main className="bg-[#eeeeee]">
      <AboutHero
        hero={about.hero}
        whoAreWe={about.whoAreWe}
      />
      <WhyChooseUs items={why} locale={locale} />
    </main>
  )
}