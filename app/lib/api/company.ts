import { Locale } from '../types/content'
import { CompanyView } from '../types/view'

const BASE = process.env.WP_API_URL!

export async function getCompany(
  locale: Locale
): Promise<CompanyView | null> {
  try {
    // 1️⃣ Fetch ข้อมูล Company (เอามาแค่ 1 รายการ)
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/company?per_page=1`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) return null

    const data = await res.json()
    if (!data || !data[0]) return null

    const acf = data[0].acf

    // 2️⃣ รวบรวม ID ของรูปภาพทั้งหมดที่มีใน ACF
    const imageIds = [
      acf.logo,
      acf.social_1_icon,
      acf.social_2_icon,
      acf.social_3_icon,
      acf.line_qr,
      acf.contact_image,
      acf.contact_image_1,
      acf.contact_image_2,
      acf.contact_image_3,
      acf.contact_image_4,
    ].filter((id): id is number => typeof id === 'number' && id > 0)

    // 3️⃣ Batch Fetch ข้อมูล Media ทั้งหมดในครั้งเดียว
    const mediaMap: Record<number, string> = {}
    if (imageIds.length > 0) {
      // ใช้ Set เพื่อเอา ID ที่ซ้ำกันออกก่อนยิง API
      const uniqueIds = Array.from(new Set(imageIds))
      const mediaRes = await fetch(
        `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(',')}&per_page=100`,
        { next: { revalidate: 3600 } }
      )

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        mediaData.forEach((m: any) => {
          mediaMap[m.id] = m.source_url || m.guid?.rendered || null
        })
      }
    }

    // Helper Function สำหรับดึง URL จาก Map
    const getUrl = (id: any) => (typeof id === 'number' ? mediaMap[id] : null)

    // 4️⃣ จัดการ Gallery
    const contactGallery = [
      { id: acf.contact_image_1, th: acf.contact_image_1_alt_th, en: acf.contact_image_1_alt_en },
      { id: acf.contact_image_2, th: acf.contact_image_2_alt_th, en: acf.contact_image_2_alt_en },
      { id: acf.contact_image_3, th: acf.contact_image_3_alt_th, en: acf.contact_image_3_alt_en },
      { id: acf.contact_image_4, th: acf.contact_image_4_alt_th, en: acf.contact_image_4_alt_en },
    ]
      .filter((item) => item.id && getUrl(item.id)) // ต้องมีทั้ง ID และ URL จริงใน WordPress
      .map((item) => ({
        src: getUrl(item.id)!,
        alt: locale === 'th' ? item.th || '' : item.en || '',
      }))

    // 5️⃣ จัดการข้อมูล Socials
    const socials = [
      { type: acf.social_1_type, url: acf.social_1_url, iconId: acf.social_1_icon },
      { type: acf.social_2_type, url: acf.social_2_url, iconId: acf.social_2_icon },
      { type: acf.social_3_type, url: acf.social_3_url, iconId: acf.social_3_icon },
    ]
      .filter((s) => s.url)
      .map((s) => ({
        type: s.type,
        url: s.url,
        icon: getUrl(s.iconId)
          ? { src: getUrl(s.iconId)!, alt: s.type }
          : undefined,
      }))

    // 6️⃣ Return ข้อมูลตาม Interface CompanyView
    return {
      name: locale === 'th' ? acf.name_th : acf.name_en,
      address: locale === 'th' ? acf.address_th : acf.address_en,
      
      logo: getUrl(acf.logo)
        ? {
            src: getUrl(acf.logo)!,
            alt: locale === 'th' ? acf.name_th : acf.name_en,
          }
        : {
            src: '/fallback-logo.png',
            alt: 'Company Logo',
          },

      phones: [
        { number: acf.phone_1_number, label: locale === 'th' ? acf.phone_1_label_th : acf.phone_1_label_en },
        { number: acf.phone_2_number, label: locale === 'th' ? acf.phone_2_label_th : acf.phone_2_label_en },
        { number: acf.phone_3_number, label: locale === 'th' ? acf.phone_3_label_th : acf.phone_3_label_en },
      ].filter((p) => p.number),

      email: [acf.email_1, acf.email_2].filter(Boolean),
      
      socials,

      lineQrCode: getUrl(acf.line_qr)
        ? {
            src: getUrl(acf.line_qr)!,
            alt: locale === 'th' ? 'สแกนเพิ่มเพื่อนใน LINE' : 'Scan to add LINE',
          }
        : undefined,

      contactImage: getUrl(acf.contact_image)
        ? {
            src: getUrl(acf.contact_image)!,
            alt: locale === 'th' ? acf.name_th : acf.name_en,
          }
        : undefined,

      contactGallery,
    }
  } catch (error) {
    console.error('Error fetching company data:', error)
    return null
  }
}