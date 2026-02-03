// lib/mocks/company.ts
import { CompanyInfo } from "../types/content";

export const companyMock: CompanyInfo = {
  name: {
    th: '168 Innovative',
    en: '168 Innovative',
  },
  address: {
    th: '89/259 แขวงบางบอน เขตบางบอน กรุงเทพฯ 10150',
    en: '89/259 Bang Bon, Bangkok 10150',
  },
  // เพิ่มรายชื่อตามรูปภาพที่คุณส่งมา
  phones: [
    {
      number: '098-614-9646',
      label: { th: 'คุณจอย', en: 'Khun Joy' },
    },
    {
      number: '080-465-6669',
      label: { th: 'คุณเบิร์ด', en: 'Khun Bird' },
    },
    {
      number: '083-539-9266',
      label: { th: 'คุณหนึ่ง', en: 'Khun Nueng' },
    },
  ],
  email: [
    'sales.168innovative@gmail.com',
    '168.innovative@gmail.com'
  ],
  socials: [
    {
      type: 'line',
      url: 'https://line.me/ti/p/~168innovative',
      icon: {
        src: '/icons/line.png',
        alt: 'LINE Official',
      },
    },
    {
      type: 'facebook',
      url: 'https://facebook.com/168innovative',
      icon: {
        src: '/icons/facebook.svg',
        alt: 'Facebook',
      },
    },
    {
      type: 'shopee',
      url: 'https://shopee.co.th/shop/1240917079',
      icon: {
        src: '/icons/shopee.png',
        alt: 'Shopee',
      },
    },
  ],
  // เพิ่มส่วนนี้เพื่อเก็บรูป QR Code และรูปสินค้ากลุ่ม
  lineQrCode: {
    src: '/images/contact/line-qr.png',
    alt: { th: 'สแกนเพิ่มเพื่อนใน LINE', en: 'Scan to add LINE' }
  },
  contactImage: {
    src: '/images/contact/contact-hero.png', // รูปสินค้ากลุ่มใหญ่ในภาพของคุณ
    alt: { th: 'บรรจุภัณฑ์ 168 Innovative', en: '168 Innovative Packaging' }
  }
}