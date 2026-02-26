// app/page.tsx

import type { Metadata } from "next"

import { getCategories } from "./lib/api/categories"
import { getHeroSlides } from "./lib/api/hero"
import { getProducts } from "./lib/api/products"
import { getWhy } from "./lib/api/why"
import { getCompany } from "./lib/api/company"

import HeroCarousel from "./components/sections/HeroCarousel"
import CategorySection from "./components/sections/CategorySection"
import ProductMarquee from "./components/sections/ProductMarquee"
import WhyChooseUs from "./components/sections/WhyChooseUs"
import ContactSection from "./components/sections/ContactSection"

/* ─────────────────────────────
   Metadata (SEO)
───────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "168 Innovative | ผู้นำเข้าและจำหน่ายบรรจุภัณฑ์เครื่องสำอางและผลิตภัณฑ์พลาสติกครบวงจร",
    description:
      "168 Innovative ประกอบกิจการนำเข้าและจัดจำหน่ายบรรจุภัณฑ์เครื่องสำอาง ผลิตภัณฑ์พลาสติกทุกชนิด ขวดปั๊ม กระปุกครีม เกรดพรีเมียม ราคาส่งจากโรงงาน พร้อมบริการครบวงจร",
    keywords: [
      "168 Innovative",
      "บรรจุภัณฑ์",
      "ผลิตภัณฑ์พลาสติก",
      "นำเข้าบรรจุภัณฑ์",
      "บรรจุภัณฑ์เครื่องสำอาง",
      "ขวดปั๊ม",
      "กระปุกครีม",
      "ขวดสเปรย์",
      "หลอดโฟม",
      "ขายส่งบรรจุภัณฑ์",
      "บรรจุภัณฑ์ราคาส่ง",
      "โรงงานผลิตบรรจุภัณฑ์",
      "OEM",
      "168 Innovative"
    ],
    alternates: {
      canonical: "https://168innovative.co.th",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: "168 Innovative | ผู้นำเข้าและจำหน่ายบรรจุภัณฑ์และผลิตภัณฑ์พลาสติก",
      description:
        "ศูนย์รวมบรรจุภัณฑ์และผลิตภัณฑ์พลาสติกทุกชนิด นำเข้าและจัดจำหน่ายโดยตรงจากโรงงาน คุณภาพดี ราคามิตรภาพ",
      url: "https://168innovative.co.th",
      siteName: "168 Innovative",
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: "th_TH",
      type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title: "168 Innovative | บรรจุภัณฑ์เครื่องสำอางครบวงจร",
      description: "ผู้นำเข้าและจำหน่ายบรรจุภัณฑ์พลาสติก เกรดพรีเมียม ราคาส่งจากโรงงาน",
      images: ['/og-image.jpg'],
    },
  }
}

/* ─────────────────────────────
   Home Page
───────────────────────────── */

export default async function HomePage() {
  const locale = "th"

  const [heroSlides, products, categories, whys, company] =
    await Promise.all([
      getHeroSlides(locale),
      getProducts(locale), // ✅ ดึง 8 รายการ (ไม่ pagination)
      getCategories(locale),
      getWhy(locale),
      getCompany(locale),
    ])

  return (
    <main>
      {/* Hero */}
      {heroSlides?.length > 0 && (
        <HeroCarousel hero={{ slides: heroSlides }} />
      )}

      {/* Product Marquee (8 items) */}
      {products?.length > 0 && (
        <ProductMarquee items={products} locale={locale} />
      )}

      {/* Categories */}
      {categories?.length > 0 && (
        <CategorySection items={categories} locale={locale} />
      )}

      {/* Why Choose Us */}
      {whys?.length > 0 && (
        <WhyChooseUs items={whys} locale={locale} />
      )}

      {/* Contact / Company */}
      {company && (
        <ContactSection locale={locale} data={company} />
      )}
    </main>
  )
}