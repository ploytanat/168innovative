import { Article } from '../types/content'

export const articlesMock: Article[] = [
  {
    id: 'art-01',
    slug: 'what-is-spout-packaging',

    title: {
      th: 'จุกซองคืออะไร? เหมาะกับสินค้าแบบไหน',
      en: 'What Is Spout Packaging and When Should You Use It?',
    },

    excerpt: {
      th: 'อธิบายประเภทของจุกซอง ข้อดี และการเลือกใช้งานให้เหมาะกับสินค้า OEM',
      en: 'An overview of spout packaging types, benefits, and OEM use cases.',
    },

    content: {
      th: `
จุกซอง (Spout) เป็นส่วนประกอบสำคัญของบรรจุภัณฑ์แบบซอง...

เหมาะสำหรับสินค้า เช่น
- ซอส
- เครื่องดื่ม
- ครีม
      `,
      en: `
Spout packaging is a key component of flexible packaging...

Common use cases include:
- Sauces
- Beverages
- Cream products
      `,
    },

    category: 'packaging',
    publishedAt: '2025-01-15',
  },
]
