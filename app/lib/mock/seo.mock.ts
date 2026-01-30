import { SEOContent } from '../types/content'

export const seoMock = {
  home: {
    title: {
      th: '168 Innovative | นำเข้าจุก ฝา และบรรจุภัณฑ์พลาสติก ราคาโรงงาน',
      en: '168 Innovative | Leading Plastic Packaging & Spout Importer'
    },
    description: {
      th: 'ผู้นำเข้าบรรจุภัณฑ์พลาสติกสำหรับเครื่องสำอางและอาหาร พร้อมบริการ OEM/ODM ครบวงจร มั่นใจในคุณภาพระดับพรีเมียม',
      en: 'High-quality plastic packaging solutions for cosmetics and food. Factory prices with professional OEM/ODM services.'
    },
    keywords: [
      'จุกพลาสติก',
      'Spout',
      'ฝาขวด',
      'บรรจุภัณฑ์เครื่องสำอาง',
      '168 Innovative',
      'OEM packaging'
    ]
  },

  products: {
    title: {
      th: 'สินค้าทั้งหมด | บรรจุภัณฑ์พลาสติกคุณภาพสูง 168 Innovative',
      en: 'All Products | High-Quality Plastic Packaging 168 Innovative'
    },
    description: {
      th: 'เลือกชมจุกพลาสติก หลอดมาสคาร่า และบรรจุภัณฑ์พลาสติกหลากหลายรูปแบบสำหรับแบรนด์ของคุณ',
      en: 'Browse our collection of plastic spouts, mascara tubes, and various packaging solutions for your brand.'
    },
    keywords: [
      'สินค้า 168 Innovative',
      'จุก HL160D',
      'หลอดมาสคาร่า OEM'
    ]
  }
} satisfies Record<string, SEOContent>
