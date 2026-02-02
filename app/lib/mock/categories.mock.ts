import { Category } from '../types/content'

export const categoriesMock: Category[] = [
  {
    id: 'cat-01',
    slug: 'spout',
    name: {
      th: 'จุกและฝา Spout',
      en: 'Spout & Cap'
    },
    image: {
    src: '/images/category/spout2.png',
    alt:{
      th:'',
      en:''
    } 
  }
  },
  {
    id: 'cat-02',
    slug: 'cosmetic-bottle',
    name: {
      th: 'ขวดเครื่องสำอาง',
      en: 'Cosmetic Bottle'
    }
  },
  {
    id: 'cat-03',
    slug: 'lipstick-packaging',
    name: {
      th: 'แพ็กเกจลิปสติก',
      en: 'Lipstick Packaging'
    },
    image: {
    src: '/images/category/lipstick_bottle.png',
    alt:{
      th:'แพ็กเกจลิปสติก',
      en:'Lipstick Packaging'
    } 
  }
  },
  {
    id: 'cat-04',
    slug: 'mascara-packaging',
    name: {
      th: 'แพ็กเกจมาสคาร่า',
      en: 'Mascara Packaging'
    }
  },
  {
    id: 'cat-05',
    slug: 'powder-compact',
    name: {
      th: 'ตลับแป้ง',
      en: 'Powder Compact'
    }
  },
  {
    id: 'cat-06',
    slug: 'soap-bag',
    name: {
      th: 'ถุงสบู่ / ถุงบรรจุภัณฑ์',
      en: 'Soap & Packaging Bag'
    }
  },
  {
    id: 'cat-07',
    slug: 'pump-cap',
    name: {
      th: 'ฝาปั๊มและหัวปั๊ม',
      en: 'Pump & Dispenser'
    }
  },
  {
    id: 'cat-08',
    slug: 'accessories',
    name: {
      th: 'อุปกรณ์เสริมบรรจุภัณฑ์',
      en: 'Packaging Accessories'
    }
  }
]
