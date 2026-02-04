import { Product } from '../types/content'

export const productsMock: Product[] = [
  {
    id: 'p1',
    slug: 'spout-hl160d-16mm',
    categoryId: 'cat-01', 
    name: {
      th: 'จุกพลาสติก HL160D (16mm)',
      en: 'Plastic Spout HL160D (16mm)',
    },
    description: {
      th: 'จุกพลาสติกคุณภาพสูง สำหรับถุงบรรจุของเหลว',
      en: 'High-quality plastic spout for liquid packaging bags.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'จุกพลาสติก HL160D',
        en: 'Plastic Spout HL160D',
      },
    },
  },

  {
    id: 'p2',
    slug: 'spout-hl200-20mm',
    categoryId: 'cat-01', 
    name: {
      th: 'จุกพลาสติก HL200 (20mm)',
      en: 'Plastic Spout HL200 (20mm)',
    },
    description: {
      th: 'จุก Spout ขนาด 20 มม. เหมาะสำหรับซอสและเครื่องดื่ม',
      en: '20mm spout suitable for sauces and beverages.',
    },
    image: {
      src: '/products/จุกซองครีม.png',
      alt: {
        th: 'จุกพลาสติก HL200',
        en: 'Plastic Spout HL200',
      },
    },
  },
  {
    id: 'p3',
    slug: 'spout-hl220-22mm',
    categoryId: 'cat-01',
    name: {
      th: 'จุกพลาสติก HL220 (22mm)',
      en: 'Plastic Spout HL220 (22mm)',
    },
    description: {
      th: 'จุก Spout ขนาดใหญ่ เหมาะกับผลิตภัณฑ์เข้มข้น',
      en: 'Large spout suitable for thick liquid products.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'จุกพลาสติก HL220',
        en: 'Plastic Spout HL220',
      },
    },
  },

  {
    id: 'p4',
    slug: 'spout-screw-cap-16mm',
    categoryId: 'cat-01',
    name: {
      th: 'จุกเกลียวพลาสติก 16mm',
      en: 'Plastic Screw Spout 16mm',
    },
    description: {
      th: 'จุกเกลียวเปิด–ปิดง่าย สำหรับซองบรรจุภัณฑ์',
      en: 'Easy open-close screw spout for packaging pouches.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'จุกเกลียวพลาสติก 16mm',
        en: 'Plastic Screw Spout 16mm',
      },
    },
  },

  {
    id: 'p5',
    slug: 'spout-screw-cap-20mm',
    categoryId: 'cat-01',
    name: {
      th: 'จุกเกลียวพลาสติก 20mm',
      en: 'Plastic Screw Spout 20mm',
    },
    description: {
      th: 'จุกเกลียวขนาด 20 มม. สำหรับเครื่องดื่ม',
      en: '20mm screw spout for beverage packaging.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'จุกเกลียวพลาสติก 20mm',
        en: 'Plastic Screw Spout 20mm',
      },
    },
  },

  {
    id: 'p6',
    slug: 'spout-flat-cap',
    categoryId: 'cat-01',
    name: {
      th: 'จุก Spout ฝาแบน',
      en: 'Flat Cap Spout',
    },
    description: {
      th: 'จุกฝาแบน ดีไซน์เรียบ เหมาะกับสินค้า OEM',
      en: 'Flat cap spout with clean design for OEM products.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'จุก Spout ฝาแบน',
        en: 'Flat Cap Spout',
      },
    },
  },

  // ===== Cosmetic Packaging =====

  {
    id: 'p7',
    slug: 'cosmetic-jar-50g',
    categoryId: 'cat-02',
    name: {
      th: 'กระปุกครีม 50 กรัม',
      en: 'Cosmetic Jar 50g',
    },
    description: {
      th: 'กระปุกพลาสติกสำหรับบรรจุครีมและสกินแคร์',
      en: 'Plastic jar for creams and skincare products.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'กระปุกครีม 50 กรัม',
        en: 'Cosmetic Jar 50g',
      },
    },
  },

  {
    id: 'p8',
    slug: 'cosmetic-jar-100g',
    categoryId: 'cat-02',
    name: {
      th: 'กระปุกครีม 100 กรัม',
      en: 'Cosmetic Jar 100g',
    },
    description: {
      th: 'กระปุกขนาดใหญ่ เหมาะกับครีมบำรุง',
      en: 'Large jar suitable for skincare creams.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'กระปุกครีม 100 กรัม',
        en: 'Cosmetic Jar 100g',
      },
    },
  },

  {
    id: 'p9',
    slug: 'airless-bottle-30ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวด Airless 30 ml',
      en: 'Airless Bottle 30 ml',
    },
    description: {
      th: 'ขวด Airless ช่วยป้องกันอากาศเข้า',
      en: 'Airless bottle prevents air contamination.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'ขวด Airless 30 ml',
        en: 'Airless Bottle 30 ml',
      },
    },
  },

  {
    id: 'p10',
    slug: 'airless-bottle-50ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวด Airless 50 ml',
      en: 'Airless Bottle 50 ml',
    },
    description: {
      th: 'เหมาะสำหรับเซรั่มและครีมบำรุง',
      en: 'Suitable for serums and skincare creams.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'ขวด Airless 50 ml',
        en: 'Airless Bottle 50 ml',
      },
    },
  },

  {
    id: 'p11',
    slug: 'pump-bottle-100ml',
    categoryId: 'cat-07',
    name: {
      th: 'ขวดปั๊ม 100 ml',
      en: 'Pump Bottle 100 ml',
    },
    description: {
      th: 'ขวดปั๊มใช้งานง่าย เหมาะกับโลชั่น',
      en: 'Pump bottle suitable for lotions.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'ขวดปั๊ม 100 ml',
        en: 'Pump Bottle 100 ml',
      },
    },
  },

  {
    id: 'p12',
    slug: 'dropper-bottle-30ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวดดรอปเปอร์ 30 ml',
      en: 'Dropper Bottle 30 ml',
    },
    description: {
      th: 'ขวดดรอปเปอร์สำหรับเซรั่มและน้ำมัน',
      en: 'Dropper bottle for serums and oils.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'ขวดดรอปเปอร์ 30 ml',
        en: 'Dropper Bottle 30 ml',
      },
    },
  },
]
