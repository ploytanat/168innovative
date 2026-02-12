// lib/mock/about.mock.ts
import { AboutContent } from "../types/content"

export const aboutMock: AboutContent = {
  hero: {
    title: {
      th: 'ผู้นำเข้าและจัดจำหน่ายบรรจุภัณฑ์พลาสติกสำหรับแบรนด์ OEM',
      en: 'Importer and Distributor of Plastic Packaging for OEM Brands',
    },
    description: {
      th: '168 Innovative Company Limited เป็นผู้นำเข้าและจัดจำหน่ายชิ้นส่วนบรรจุภัณฑ์พลาสติกสำหรับผู้ผลิตและแบรนด์ OEM โดยมุ่งเน้นคุณภาพ มาตรฐาน และความน่าเชื่อถือในการจัดส่ง',
      en: '168 Innovative Company Limited is an importer and distributor of plastic packaging components for manufacturers and OEM brands, focusing on quality, standards, and reliable supply.',
    },
    image: {
      src: '/about/factory.png',
      alt: {
        th: 'กระบวนการคัดเลือกและตรวจสอบคุณภาพบรรจุภัณฑ์',
        en: 'Packaging inspection and quality control process',
      },
    },
  },

  whoAreWe: {
    title: {
      th: 'Who We Are',
      en: 'Who We Are',
    },
    description: {
      th: 'เรามีความเชี่ยวชาญในการคัดสรรและนำเข้าชิ้นส่วนบรรจุภัณฑ์พลาสติกคุณภาพสูง พร้อมบริหารจัดการซัพพลายเชนและสต็อกสินค้า เพื่อรองรับความต้องการของแบรนด์ OEM อย่างต่อเนื่องและมั่นคง',
      en: 'We specialize in sourcing and importing high-quality plastic packaging components, managing supply chains and inventory to consistently support OEM brands with stability and reliability.',
    },
    image: {
      src: '/about/warehouse.png',
      alt: {
        th: 'คลังสินค้าและระบบจัดการสต็อกบรรจุภัณฑ์',
        en: 'Warehouse and packaging inventory management system',
      },
    },
  },
}
