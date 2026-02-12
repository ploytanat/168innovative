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
      src: '/products/spout/hl086l.png',
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
      src: '/products/spout/hl101st.png',
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
      src: '/products/spout/hl160d-b.png',
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
      src: '/products/spout/hl160f.png',
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
      src: '/products/spout/hl160w-b.png',
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
      src: '/products/spout/hl160w.png',
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
      src: '/products/spout/hl330w.png',
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

    {
    id: 'p13',
    slug: 'spout-hl180-18mm',
    categoryId: 'cat-01',
    name: {
      th: 'จุก Spout HL180 (18mm)',
      en: 'Plastic Spout HL180 (18mm)',
    },
    description: {
      th: 'จุก Spout ขนาด 18 มม. สำหรับซองบรรจุอาหารและเครื่องดื่ม ซีลแน่น ป้องกันการรั่วซึม',
      en: '18mm spout suitable for food and beverage pouches with secure sealing.',
    },
    image: {
      src: '/products/spout/hl330w.png',
      alt: {
        th: 'จุก Spout HL180',
        en: 'Plastic Spout HL180',
      },
    },
  },

  {
    id: 'p14',
    slug: 'spout-wide-mouth-25mm',
    categoryId: 'cat-01',
    name: {
      th: 'จุก Spout ปากกว้าง 25mm',
      en: 'Wide Mouth Spout 25mm',
    },
    description: {
      th: 'จุก Spout ปากกว้าง เหมาะสำหรับผลิตภัณฑ์เนื้อข้น เช่น ซอสและครีม',
      en: '25mm wide-mouth spout ideal for thicker products such as sauces and creams.',
    },
    image: {
      src: '/products/spout/hl400d.png',
      alt: {
        th: 'จุก Spout ปากกว้าง 25mm',
        en: 'Wide Mouth Spout 25mm',
      },
    },
  },

  {
    id: 'p15',
    slug: 'cosmetic-jar-30g',
    categoryId: 'cat-02',
    name: {
      th: 'กระปุกครีม 30 กรัม',
      en: 'Cosmetic Jar 30g',
    },
    description: {
      th: 'กระปุกขนาดเล็ก เหมาะสำหรับสกินแคร์ขนาดพกพา',
      en: 'Compact cosmetic jar ideal for travel-size skincare products.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'กระปุกครีม 30 กรัม',
        en: 'Cosmetic Jar 30g',
      },
    },
  },

  {
    id: 'p16',
    slug: 'cosmetic-jar-double-wall-50g',
    categoryId: 'cat-02',
    name: {
      th: 'กระปุกครีม 50 กรัม แบบสองชั้น',
      en: 'Double Wall Cosmetic Jar 50g',
    },
    description: {
      th: 'กระปุกสองชั้นดีไซน์พรีเมียม เหมาะสำหรับแบรนด์ระดับสูง',
      en: 'Premium double-wall jar suitable for high-end cosmetic brands.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'กระปุกครีมสองชั้น 50g',
        en: 'Double Wall Cosmetic Jar 50g',
      },
    },
  },

  {
    id: 'p17',
    slug: 'airless-bottle-15ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวด Airless 15 ml',
      en: 'Airless Bottle 15 ml',
    },
    description: {
      th: 'ขวด Airless ขนาดเล็ก เหมาะสำหรับเซรั่มตัวอย่าง',
      en: '15ml airless bottle suitable for serum samples.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'ขวด Airless 15 ml',
        en: 'Airless Bottle 15 ml',
      },
    },
  },

  {
    id: 'p18',
    slug: 'airless-bottle-100ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวด Airless 100 ml',
      en: 'Airless Bottle 100 ml',
    },
    description: {
      th: 'ขวด Airless ขนาดใหญ่ เหมาะสำหรับผลิตภัณฑ์ดูแลผิวระดับพรีเมียม',
      en: '100ml airless bottle ideal for premium skincare products.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'ขวด Airless 100 ml',
        en: 'Airless Bottle 100 ml',
      },
    },
  },

  {
    id: 'p19',
    slug: 'dropper-bottle-50ml',
    categoryId: 'cat-03',
    name: {
      th: 'ขวดดรอปเปอร์ 50 ml',
      en: 'Dropper Bottle 50 ml',
    },
    description: {
      th: 'ขวดดรอปเปอร์ขนาดใหญ่ สำหรับผลิตภัณฑ์บำรุงผิวเข้มข้น',
      en: '50ml dropper bottle for concentrated skincare products.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'ขวดดรอปเปอร์ 50 ml',
        en: 'Dropper Bottle 50 ml',
      },
    },
  },

  {
    id: 'p20',
    slug: 'pump-bottle-200ml',
    categoryId: 'cat-07',
    name: {
      th: 'ขวดปั๊ม 200 ml',
      en: 'Pump Bottle 200 ml',
    },
    description: {
      th: 'ขวดปั๊มขนาดใหญ่ เหมาะสำหรับโลชั่นและสบู่เหลว',
      en: '200ml pump bottle suitable for lotions and liquid soaps.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'ขวดปั๊ม 200 ml',
        en: 'Pump Bottle 200 ml',
      },
    },
  },

  {
    id: 'p21',
    slug: 'pump-bottle-300ml',
    categoryId: 'cat-07',
    name: {
      th: 'ขวดปั๊ม 300 ml',
      en: 'Pump Bottle 300 ml',
    },
    description: {
      th: 'ขวดปั๊มสำหรับผลิตภัณฑ์ดูแลร่างกาย ใช้งานสะดวก',
      en: '300ml pump bottle for body care products.',
    },
    image: {
      src: '/products/Product20250926090552.png',
      alt: {
        th: 'ขวดปั๊ม 300 ml',
        en: 'Pump Bottle 300 ml',
      },
    },
  },

  {
    id: 'p22',
    slug: 'serum-bottle-30ml-glass',
    categoryId: 'cat-03',
    name: {
      th: 'ขวดเซรั่มแก้ว 30 ml',
      en: 'Glass Serum Bottle 30 ml',
    },
    description: {
      th: 'ขวดแก้วสำหรับเซรั่ม ดีไซน์เรียบหรู รองรับงาน OEM',
      en: '30ml glass serum bottle with elegant design for OEM brands.',
    },
    image: {
      src: '/products/Product20250820145317.png',
      alt: {
        th: 'ขวดเซรั่มแก้ว 30 ml',
        en: 'Glass Serum Bottle 30 ml',
      },
    },
  },

]
