import type { SideBannerView } from '@/app/lib/types/view'

type Locale = 'th' | 'en'

const SIDE_BANNERS: Record<Locale, SideBannerView[]> = {
  th: [
    {
      id: 'banner-oem',
      href: '/contact',
      image: { src: '/images/home/banner2.jpeg', alt: 'บริการรับผลิต OEM' },
      tag: 'OEM / ODM',
      tagColor: '#1565c0',
      title: 'รับผลิตบรรจุภัณฑ์ตามแบบ',
      subtitle: 'MOQ ต่ำ • ส่งตรงจากโรงงาน',
      overlayGradient: 'linear-gradient(180deg,transparent 25%,rgba(13,27,58,.72))',
    },
    {
      id: 'banner-catalog',
      href: '/categories',
      image: { src: '/images/home/banner3.png', alt: 'แคตตาล็อกสินค้า' },
      tag: 'สินค้าใหม่',
      tagColor: '#c62828',
      title: 'แคตตาล็อก 200+ รุ่น',
      subtitle: 'อัปเดตทุกเดือน',
      overlayGradient: 'linear-gradient(180deg,transparent 25%,rgba(20,10,40,.70))',
    },
  ],
  en: [
    {
      id: 'banner-oem',
      href: '/contact',
      image: { src: '/images/home/banner2.jpeg', alt: 'OEM Manufacturing Service' },
      tag: 'OEM / ODM',
      tagColor: '#1565c0',
      title: 'Custom Packaging Manufacturing',
      subtitle: 'Low MOQ • Direct from factory',
      overlayGradient: 'linear-gradient(180deg,transparent 25%,rgba(13,27,58,.72))',
    },
    {
      id: 'banner-catalog',
      href: '/categories',
      image: { src: '/images/home/banner3.png', alt: 'Product Catalog' },
      tag: 'New',
      tagColor: '#c62828',
      title: '200+ Models Product Catalog',
      subtitle: 'Updated monthly',
      overlayGradient: 'linear-gradient(180deg,transparent 25%,rgba(20,10,40,.70))',
    },
  ],
}

export function getSideBanners(locale: Locale): SideBannerView[] {
  return SIDE_BANNERS[locale]
}
