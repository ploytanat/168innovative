// lib/mock/about.mock.ts
import { AboutContent } from '../types/content'

export const aboutMock: AboutContent = {
  hero: {
    title: {
      th: 'ชิ้นส่วนบรรจุภัณฑ์พลาสติก สำหรับผู้ผลิตและแบรนด์ OEM',
      en: 'Plastic Packaging Components for Manufacturers & OEM Brands'
    },
    description: {
      th: '168 Innovative Company Limited เป็นผู้นำเข้าและจัดจำหน่ายชิ้นส่วนบรรจุภัณฑ์พลาสติก โดยเชี่ยวชาญด้านจุกซอง ฝาปิด และบรรจุภัณฑ์เครื่องสำอาง',
      en: '168 Innovative Company Limited is an importer and distributor of plastic packaging components, specializing in spout caps, closures, and cosmetic packaging.'
    },
    image: { src: '/images/about-hero.jpg', alt: { th: 'โรงงานผลิต', en: 'Production Line' } }
  },
  whoWeAre: {
    title: { th: 'เราเป็นใคร', en: 'Who We Are' },
    description: {
      th: 'ก่อตั้งขึ้นในปี 2021 ณ กรุงเทพมหานคร เรามุ่งมั่นที่จะนำเสนอสินค้าโดยตรงจากราคาโรงงานผู้ผลิต ช่วยให้ธุรกิจลดต้นทุนโดยไม่ลดคุณภาพ',
      en: 'Established in 2021 in Bangkok, we are committed to offering products at direct-from-manufacturer prices, helping businesses reduce costs without compromising quality.'
    },
    quote: {
      th: 'เรามุ่งเน้นที่การจัดหาผลิตภัณฑ์ การควบคุมคุณภาพ และการจัดหาที่เชื่อถือได้จากพันธมิตรผู้ผลิตที่เชื่อถือได้',
      en: 'We focus on product sourcing, quality control, and reliable supply from trusted manufacturing partners.'
    },
    image: { src: '/images/warehouse-about.jpg', alt: { th: 'คลังสินค้า', en: 'Our Warehouse' } }
  }
}