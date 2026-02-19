// app/about/page.tsx

import AboutHero from "../components/sections/AboutHero"
import WhyChooseUs from "../components/sections/WhyChooseUs"
import { getAbout } from "../lib/api/about"
import { getWhy } from "../lib/api/why"

export default async function AboutPage() {
  const locale = 'th'

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
