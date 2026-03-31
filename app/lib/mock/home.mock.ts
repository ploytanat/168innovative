// lib/mock/home.mock.ts
import { HomeContent } from '../types/content'

export const homeMock: HomeContent = {
  hero: {
    slides: [
      {
        id: 1,
        theme: 'rose',
        badge: {
          text: { th: 'ขายดีอันดับ 1', en: 'Best Seller' },
          variant: 'hot',
        },
        title: {
          th: 'ขวดบรรจุภัณฑ์\nลิปสติก & ลิปกลอส',
          en: 'Lipstick & Lip Gloss\nPackaging Bottles',
        },
        description: {
          th: 'บรรจุภัณฑ์คุณภาพสูง หลากหลายรูปทรงและขนาด รองรับงาน OEM/ODM พร้อมส่งทั่วประเทศ',
          en: 'Premium quality packaging in various shapes and sizes. OEM/ODM supported with nationwide delivery.',
        },
        image: {
          src: '/products/lipstickBottle/Product20250926084947.png',
          alt: { th: 'ขวดลิปสติกพรีเมียม', en: 'Premium lipstick bottle' },
        },
        ctaPrimary: {
          href: '/categories',
          label: { th: 'ดูสินค้าทั้งหมด', en: 'Browse All Products' },
        },
        ctaSecondary: {
          href: '/contact',
          label: { th: 'ขอใบเสนอราคา', en: 'Request a Quote' },
        },
        highlight: {
          value: '200+',
          label: { th: 'แบบให้เลือก', en: 'Models' },
        },
      },
      {
        id: 2,
        theme: 'sky',
        badge: {
          text: { th: 'สินค้าใหม่ล่าสุด', en: 'New Arrival' },
          variant: 'new',
        },
        title: {
          th: 'จุก & ฝาครอบ\nสำหรับซองครีม',
          en: 'Spout Caps\nfor Cream Pouches',
        },
        description: {
          th: 'จุกและฝาครอบซองครีมคุณภาพพรีเมียม กันรั่วซึม 100% เหมาะสำหรับผลิตภัณฑ์ดูแลผิวทุกประเภท',
          en: '100% leak-proof premium spout caps for cream pouches, suitable for all skincare products.',
        },
        image: {
          src: '/products/spout/hl160d-b.png',
          alt: { th: 'จุกซองครีม', en: 'Cream pouch spout' },
        },
        ctaPrimary: {
          href: '/categories',
          label: { th: 'ดูสินค้าทั้งหมด', en: 'Browse All Products' },
        },
        ctaSecondary: {
          href: '/contact',
          label: { th: 'ขอตัวอย่างฟรี', en: 'Request Free Sample' },
        },
        highlight: {
          value: '50+',
          label: { th: 'ดีไซน์', en: 'Designs' },
        },
      },
      {
        id: 3,
        theme: 'violet',
        badge: {
          text: { th: 'แนะนำพิเศษ', en: 'Staff Pick' },
          variant: 'featured',
        },
        title: {
          th: 'ขวดมาสคารา\nแบบพรีเมียม',
          en: 'Premium\nMascara Bottles',
        },
        description: {
          th: 'ขวดมาสคาราคุณภาพสูง พร้อมแปรงในตัว ออกแบบได้ตามต้องการ รองรับ Private Label ทุกแบรนด์',
          en: 'High-quality mascara bottles with built-in brushes, fully customizable for private label brands.',
        },
        image: {
          src: '/products/mascara/Product20250829084232.png',
          alt: { th: 'ขวดมาสคาราพรีเมียม', en: 'Premium mascara bottle' },
        },
        ctaPrimary: {
          href: '/categories',
          label: { th: 'ดูสินค้าทั้งหมด', en: 'Browse All Products' },
        },
        ctaSecondary: {
          href: '/contact',
          label: { th: 'ปรึกษาผู้เชี่ยวชาญ', en: 'Talk to Expert' },
        },
        highlight: {
          value: '12+',
          label: { th: 'ขนาดแปรง', en: 'Brush Types' },
        },
      },
      {
        id: 4,
        theme: 'emerald',
        badge: {
          text: { th: 'บริการครบวงจร', en: 'Full Service' },
          variant: 'promo',
        },
        title: {
          th: 'รับผลิต OEM\nครบวงจร',
          en: 'One-Stop\nOEM Service',
        },
        description: {
          th: 'ออกแบบ ผลิต และจัดส่งบรรจุภัณฑ์ครบวงจร ตั้งแต่ต้นจนจบ รองรับทุกอุตสาหกรรมเครื่องสำอาง',
          en: 'End-to-end packaging design, manufacturing, and delivery for the entire cosmetics industry.',
        },
        image: {
          src: '/images/home/banner4.png',
          alt: { th: 'บริการ OEM ครบวงจร', en: 'Full OEM Service' },
        },
        ctaPrimary: {
          href: '/contact',
          label: { th: 'เริ่มโปรเจกต์', en: 'Start a Project' },
        },
        ctaSecondary: {
          href: '/categories',
          label: { th: 'ดูผลงาน', en: 'View Portfolio' },
        },
        highlight: {
          value: '300+',
          label: { th: 'โปรเจกต์ OEM', en: 'OEM Projects' },
        },
      },
    ],
  },
}
