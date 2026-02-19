// app/about/page.tsx

import { getWhy } from "@/app/lib/api/why"
import AboutHero from "@/app/components/sections/AboutHero"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { getAbout } from "@/app/lib/api/about"


export default async function AboutPage() {
  const locale = 'en'

  const [about, why] = await Promise.all([
    getAbout(locale),
    getWhy(locale),
  ])

  if (!about) return null

  return (
    <main className="space-y-24 bg-[#eeee]">
      <div className="container mx-auto">
        <AboutHero
          hero={about.hero}
          whoAreWe={about.whoAreWe}
        />

        <WhyChooseUs items={why} locale={locale} />
      </div>
    </main>
  )
}
