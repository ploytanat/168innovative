// lib/mock/home.mock.ts
import { HomeContent } from '../types/content'

export const homeMock: HomeContent = {
  hero: {
    slides: [
      {
        id: 1,
        title: {
          th: '168 Innovative',
          en: '168 Innovative',
        },
        subtitle: {
          th: 'ผู้เชี่ยวชาญด้านบรรจุภัณฑ์',
          en: 'Experts in Packaging Solutions',
        },
        description: {
          th: 'ผู้นำด้านบรรจุภัณฑ์พลาสติกและแพ็กเกจจิ้ง สำหรับเครื่องสำอางและอุตสาหกรรม',
          en: 'Leading plastic packaging solutions for cosmetics and industry',
        },
        image: {
          src: '/images/home/banner4.png',
          alt: {
            th: 'บรรจุภัณฑ์เครื่องสำอาง',
            en: 'Cosmetic packaging',
          },
        },
        ctaPrimary: {
          href: '/categories',
          label: {
            th: 'ดูสินค้า',
            en: 'View Products',
          },
        },
      },
      {
        id: 2,
        title: {
          th: 'Premium OEM Service',
          en: 'Premium OEM Service',
        },
        subtitle: {
          th: 'บริการครบวงจร',
          en: 'One-Stop Solutions',
        },
        description: {
          th: 'บริการรับผลิตและออกแบบบรรจุภัณฑ์ครบวงจร',
          en: 'Complete OEM packaging and manufacturing services',
        },
        image: {
          src: '/images/home/banner2.jpeg',
          alt: {
            th: 'บริการ OEM',
            en: 'OEM Service',
          },
        },
        ctaPrimary: {
          href: '/contact',
          label: {
            th: 'ติดต่อเรา',
            en: 'Contact Us',
          },
        },
      },
    ],
  },

  why: [
    {
      title: { th: 'ประสบการณ์กว่า 10 ปี', en: '10+ Years Experience' },
      description: {
        th: 'มีประสบการณ์ด้านบรรจุภัณฑ์ยาวนาน',
        en: 'Long-standing experience in packaging solutions',
      },
    },
  ],

  seo: {
    title: {
      th: '168 Innovative | บรรจุภัณฑ์พลาสติก',
      en: '168 Innovative | Plastic Packaging',
    },
    description: {
      th: 'ผู้เชี่ยวชาญด้านบรรจุภัณฑ์พลาสติก',
      en: 'Experts in plastic packaging solutions',
    },
    keywords: ['packaging', 'plastic', 'cosmetic'],
  },
}
