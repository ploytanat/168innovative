import { HomeContent } from '../types/content'

export const homeMock: HomeContent = {
  hero: {
    title: {
      th: '168 Innovative',
      en: '168 Innovative'
    },
    description: {
      th: 'ผู้นำด้านบรรจุภัณฑ์พลาสติกและแพ็กเกจจิ้ง สำหรับเครื่องสำอางและอุตสาหกรรม',
      en: 'Leading plastic packaging solutions for cosmetics and industrial businesses'
    },
    image: {
      src: '/mock/home/hero.png',
      alt: {
        th: 'บรรจุภัณฑ์เครื่องสำอางและพลาสติก',
        en: 'Cosmetic and plastic packaging'
      }
    },
    ctaPrimary: {
      label: {
        th: 'ดูสินค้า',
        en: 'View Products'
      },
      href: '/products'
    },
    ctaSecondary: {
      label: {
        th: 'ติดต่อเรา',
        en: 'Contact Us'
      },
      href: '/contact'
    }
  },

  why: [
    {
      title: {
        th: 'ประสบการณ์ด้านบรรจุภัณฑ์',
        en: 'Packaging Expertise'
      },
      description: {
        th: 'มีประสบการณ์ด้านบรรจุภัณฑ์และแพ็กเกจจิ้งมากกว่า 10 ปี',
        en: 'Over 10 years of experience in packaging and plastic solutions'
      }
    },
    {
      title: {
        th: 'สินค้าคุณภาพ',
        en: 'High Quality Products'
      },
      description: {
        th: 'คัดสรรวัสดุและกระบวนการผลิตที่ได้มาตรฐาน',
        en: 'Carefully selected materials and standardized manufacturing processes'
      }
    },
    {
      title: {
        th: 'รองรับธุรกิจหลากหลาย',
        en: 'Multi-Industry Support'
      },
      description: {
        th: 'รองรับกลุ่มเครื่องสำอาง อาหาร และอุตสาหกรรมทั่วไป',
        en: 'Supporting cosmetics, food, and general industrial businesses'
      }
    }
  ],

  seo: {
    title: {
      th: '168 Innovative | บรรจุภัณฑ์พลาสติกและแพ็กเกจจิ้ง',
      en: '168 Innovative | Plastic Packaging Solutions'
    },
    description: {
      th: '168 Innovative ผู้เชี่ยวชาญด้านบรรจุภัณฑ์พลาสติก เครื่องสำอาง และอุตสาหกรรม',
      en: '168 Innovative is a specialist in plastic packaging for cosmetics and industrial use'
    },
    keywords: [
      'บรรจุภัณฑ์พลาสติก',
      'ขวดเครื่องสำอาง',
      'แพ็กเกจจิ้ง',
      'plastic packaging',
      'cosmetic packaging'
    ]
  }
}
