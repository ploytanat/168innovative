// app/en/layout.tsx ✅
import type { Metadata } from 'next'
import { getHome } from '../lib/api/home'

export async function generateMetadata(): Promise<Metadata> {
  const home = getHome('en')
  return {
    title: home.seo.title,
    description: home.seo.description,
    keywords: home.seo.keywords,
  }
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
