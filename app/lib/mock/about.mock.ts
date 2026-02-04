// lib/mock/about.mock.ts
import { AboutContent } from "../types/content"

export const aboutMock: AboutContent = {
  hero: {
    title: {
      th: 'Plastic Packaging Components for Manufacturers & OEM Brands',
      en: 'Plastic Packaging Components for Manufacturers & OEM Brands',
    },
    description: {
      th: '168 Innovative Company Limited เป็นผู้ผลิตชิ้นส่วนบรรจุภัณฑ์พลาสติกสำหรับผู้ผลิตและแบรนด์ OEM โดยมุ่งเน้นคุณภาพ มาตรฐาน และความเข้าใจลูกค้า',
      en: '168 Innovative Company Limited specializes in plastic packaging components for manufacturers and OEM brands, focusing on quality, standards, and customer understanding.',
    },
    image: {
      src: '/about/factory.png',
      alt: {
        th: 'โรงงานผลิตบรรจุภัณฑ์พลาสติก',
        en: 'Plastic packaging manufacturing factory',
      },
    },
  },

  whoAreWe: {
    title: {
      th: 'Who We Are',
      en: 'Who We Are',
    },
    description: {
      th: 'เรามีประสบการณ์ในการผลิตชิ้นส่วนบรรจุภัณฑ์พลาสติก รองรับการผลิตทั้งขนาดเล็กและขนาดใหญ่ พร้อมทีมงานที่เข้าใจความต้องการของลูกค้า OEM อย่างแท้จริง',
      en: 'We have extensive experience in manufacturing plastic packaging components, supporting both small and large-scale production with a team that truly understands OEM needs.',
    },
    image: {
      src: '/about/warehouse.png',
      alt: {
        th: 'คลังสินค้าและพื้นที่จัดเก็บบรรจุภัณฑ์',
        en: 'Warehouse and packaging storage area',
      },
    },
  },
}
