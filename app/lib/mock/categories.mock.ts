// mock/categories.mock.ts
import { Category } from '../types/content'

export const categoriesMock: Category[] = [
  {
    id: 'cat-01',
    slug: 'spout',
    name: { th: 'จุกซอง', en: 'Spout Caps' },
    description: {
      th: 'จุกซองสำหรับซองบรรจุครีม เจล และของเหลว รองรับการใช้งานกับเครื่องบรรจุหลากหลายประเภท',
      en: 'Spout caps for cream, gel, and liquid pouches. Compatible with various filling machines.'
    },
    image: { src: '/category/spout.png', alt: { th: 'จุกซองและฝา', en: 'Spout & Cap' } },
    seoTitle: { th: 'จำหน่ายจุกซองและฝาบรรจุภัณฑ์คุณภาพสูง', en: 'High-Quality Spout Caps & Packaging Solutions' },
    seoDescription: {
      th: 'ผู้เชี่ยวชาญด้านจุกซองและอุปกรณ์แพคเกจจิ้งสำหรับเครื่องสำอางและอาหาร สินค้ามาตรฐานอุตสาหกรรม',
      en: 'Expert in spout caps and packaging accessories for cosmetics and food. Industrial grade materials.'
    }
  },
  {
    id: 'cat-02',
    slug: 'plastic-pump-bottle-cap',
    name: { th: 'ฝาปั๊มขวด', en: 'Pump Bottle Cap' },
    description: {
      th: 'ฝาปั๊มสำหรับขวดบรรจุของเหลวและครีม เหมาะสำหรับเครื่องสำอางและผลิตภัณฑ์ดูแลส่วนบุคคล',
      en: 'Pump bottle caps for liquid and cream products. Suitable for cosmetics and personal care.'
    },
    image: { src: '/category/pump_bottle.png', alt: { th: 'ฝาปั๊มขวด', en: 'Pump Bottle Cap' } },
    seoTitle: { th: 'แหล่งรวมฝาปั๊มและอุปกรณ์หัวกดทุกรูปแบบ', en: 'Premium Pump Dispensers and Bottle Caps' },
    seoDescription: {
      th: 'เลือกชมฝาปั๊มหลากหลายขนาดและดีไซน์ที่เหมาะกับขวดสกินแคร์ ไม่รั่วซึม รองรับงานอุตสาหกรรม',
      en: 'Explore various pump cap sizes and designs perfect for your skincare bottles. Leak-proof quality.'
    }
  },
  {
    id: 'cat-03',
    slug: 'lipstick-packaging',
    name: { th: 'แพ็กเกจลิปสติก', en: 'Lipstick Packaging' },
    description: {
      th: 'บรรจุภัณฑ์แท่งลิปสติกสำหรับเครื่องสำอาง ออกแบบสำหรับลิปสติกและผลิตภัณฑ์ประเภทแท่ง',
      en: 'Lipstick bottles designed for cosmetic stick products. Ideal for commercial production.'
    },
    image: { src: '/category/lipstick_bottle.png', alt: { th: 'แพ็กเกจลิปสติก', en: 'Lipstick Packaging' } },
    seoTitle: { th: 'บรรจุภัณฑ์ลิปสติกและแท่งเครื่องสำอางนวัตกรรมใหม่', en: 'Innovative Lipstick Packaging' },
    seoDescription: {
      th: 'ดีไซน์แท่งลิปสติกที่สะท้อนเอกลักษณ์แบรนด์ มีหลายวัสดุทั้งพลาสติกพรีเมียมและโลหะ',
      en: 'Lipstick designs that reflect your brand identity with premium materials and custom finishes.'
    }
  },
  {
    id: 'cat-04',
    slug: 'mascara-packaging',
    name: { th: 'บรรจุภัณฑ์มาสคาร่า', en: 'Mascara Packaging' },
    description: {
      th: 'บรรจุภัณฑ์มาสคาร่าออกแบบสำหรับแปรงและของเหลวเข้มข้น เหมาะสำหรับการผลิตเชิงพาณิชย์',
      en: 'Mascara packaging designed for liquid products and brushes. Suitable for commercial manufacturing.'
    },
    image: { src: '/category/mascara.png', alt: { th: 'แพ็กเกจมาสคาร่า', en: 'Mascara Packaging' } },
    seoTitle: { th: 'จำหน่ายหลอดมาสคาร่าและแปรงปัดคุณภาพพรีเมียม', en: 'Premium Mascara Tubes and Brushes' },
    seoDescription: {
      th: 'หลอดมาสคาร่าดีไซน์ทันสมัย มาพร้อมแปรงที่ช่วยเพิ่มวอลลุ่ม รองรับงานสั่งผลิตแบรนด์เครื่องสำอาง',
      en: 'Modern mascara tube designs with high-quality brushes. Supporting private label manufacturing.'
    }
  },
  {
    id: 'cat-05',
    slug: 'powder-compact',
    name: { th: 'ตลับแป้ง', en: 'Compact Powder Case' },
    description: {
      th: 'ตลับแป้งสำหรับเครื่องสำอางชนิดผง ออกแบบสำหรับแป้งอัดแข็งและแป้งฝุ่นคุณภาพสูง',
      en: 'Compact cases for powder-based cosmetic products. Designed for pressed and loose powder.'
    },
    image: { src: '/category/powder_compact.png', alt: { th: 'ตลับแป้ง', en: 'Powder Compact' } },
    seoTitle: { th: 'ตลับแป้งพัฟและบรรจุภัณฑ์เครื่องสำอางชนิดผง', en: 'Compact Powder Cases for Beauty Brands' },
    seoDescription: {
      th: 'ตลับแป้งหลากหลายดีไซน์ ทนทาน สวยงาม เหมาะสำหรับแบรนด์ที่ต้องการความพรีเมียมและนวัตกรรม',
      en: 'Diverse compact case designs, durable and stylish. Perfect for innovative beauty brands.'
    }
  },
  {
    id: 'cat-06',
    slug: 'soap-bag',
    name: { th: 'ถุงสบู่ / ถุงบรรจุภัณฑ์', en: 'Soap Packaging Bag' },
    description: {
      th: 'ซองบรรจุสบู่เหลวและผลิตภัณฑ์รีฟิล เหมาะสำหรับสบู่เหลวและผลิตภัณฑ์ดูแลผิว',
      en: 'Soap packaging bags for liquid soap and refill products. Ideal for personal care brands.'
    },
    image: { src: '/category/soap_bag.png', alt: { th: 'ถุงสบู่', en: 'Soap Bag' } },
    seoTitle: { th: 'ผลิตและจำหน่ายถุงบรรจุภัณฑ์สำหรับสบู่และของเหลว', en: 'Soap and Pouch Packaging Solutions' },
    seoDescription: {
      th: 'ซองบรรจุภัณฑ์คุณภาพสูง ป้องกันการรั่วซึมได้ดีเยี่ยม รองรับงานพิมพ์ลายและขนาดที่หลากหลาย',
      en: 'High-quality pouch packaging with excellent leak protection. Customizable sizes and printing.'
    }
  },
  {
    id: 'cat-07',
    slug: 'pump-cap-extra',
    name: { th: 'ฝาปั๊มขวดสกินแคร์', en: 'Skincare Pump Cap' },
    description: {
      th: 'ฝาปั๊มคุณภาพสูงสำหรับผลิตภัณฑ์สกินแคร์ รองรับการใช้งานในเชิงอุตสาหกรรมสม่ำเสมอ',
      en: 'High-quality pump caps for skincare products. Designed for consistent industrial use.'
    },
    image: { src: '/category/pump_bottle.png', alt: { th: 'ฝาปั๊มสกินแคร์', en: 'Skincare Pump' } },
    seoTitle: { th: 'ฝาหัวปั๊มและหัวสเปรย์สำหรับขวดบรรจุภัณฑ์', en: 'Professional Pump and Spray Caps' },
    seoDescription: {
      th: 'อุปกรณ์หัวปั๊มที่ให้แรงกดคงที่ เหมาะสำหรับขวดเซรั่มและครีมบำรุงผิวทุกรูปแบบ',
      en: 'Pump dispensers with consistent pressure. Suitable for serum and cream bottles.'
    }
  },
  {
    id: 'cat-08',
    slug: 'ball-chain',
    name: { th: 'โซ่ลูกปัดและอุปกรณ์เสริม', en: 'Ball Chain Accessories' },
    description: {
      th: 'โซ่ลูกปัดสำหรับอุปกรณ์เสริมบรรจุภัณฑ์ เหมาะสำหรับสินค้าโปรโมชั่นและงานดีไซน์พิเศษ',
      en: 'Ball chain accessories for packaging. Suitable for promotional products and custom designs.'
    },
    image: { src: '/category/ball_chain.png', alt: { th: 'โซ่ลูกปัด', en: 'Ball Chain' } },
    seoTitle: { th: 'อุปกรณ์ตกแต่งบรรจุภัณฑ์และโซ่ลูกปัดอเนกประสงค์', en: 'Packaging Accessories and Ball Chains' },
    seoDescription: {
      th: 'โซ่ลูกปัดวัสดุพรีเมียม มีหลายสีให้เลือก เหมาะสำหรับการเพิ่มมูลค่าให้กับบรรจุภัณฑ์ของคุณ',
      en: 'Premium ball chains available in various colors. Add value to your product packaging.'
    }
  }
]