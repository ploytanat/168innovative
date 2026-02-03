// lib/mock/seo.mock.ts
import { SEOContent } from '../types/content'

export const seoMock = {
  home: {
    title: {
      th: '168 Innovative | นำเข้าบรรจุภัณฑ์พลาสติก',
      en: '168 Innovative | Plastic Packaging Supplier',
    },
    description: {
      th: 'ผู้นำเข้าบรรจุภัณฑ์พลาสติกสำหรับเครื่องสำอางและอาหาร',
      en: 'Leading plastic packaging importer for cosmetic and food industries.',
    },
    keywords: ['168 Innovative', 'บรรจุภัณฑ์พลาสติก', 'OEM packaging'],
  },

  about: {
    title: {
      th: 'เกี่ยวกับเรา | 168 Innovative',
      en: 'About Us | 168 Innovative',
    },
    description: {
      th: '168 Innovative ผู้เชี่ยวชาญด้านบรรจุภัณฑ์พลาสติกและบริการ OEM',
      en: '168 Innovative is a trusted plastic packaging and OEM partner.',
    },
    keywords: ['เกี่ยวกับ 168 Innovative', 'บริษัทบรรจุภัณฑ์', 'OEM'],
  },

  products: {
    title: {
      th: 'สินค้าทั้งหมด | 168 Innovative',
      en: 'All Products | 168 Innovative',
    },
    description: {
      th: 'รวมสินค้าบรรจุภัณฑ์พลาสติกคุณภาพสูง',
      en: 'Browse our high-quality plastic packaging products.',
    },
    keywords: ['สินค้า 168 Innovative', 'บรรจุภัณฑ์พลาสติก'],
  },
} satisfies Record<string, SEOContent>
