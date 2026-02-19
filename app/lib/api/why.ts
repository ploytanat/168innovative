// lib/api/why.ts
import { Locale } from "../types/content"
import { WhyItemView } from "../types/view"

const BASE = process.env.WP_API_URL!

// ฟังก์ชันสำหรับดึง Media URL จาก IDs หลายๆ ตัวพร้อมกัน
async function getMediaMap(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids)).filter(
    (id): id is number => typeof id === 'number' && id > 0
  )
  if (!uniqueIds.length) return {}

  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(',')}&per_page=100`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return {}
    const data = await res.json()
    const map: Record<number, string> = {}
    data.forEach((m: any) => {
      map[m.id] = m.source_url
    })
    return map
  } catch {
    return {}
  }
}

export async function getWhy(locale: Locale): Promise<WhyItemView[]> {
  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/why?per_page=20`, // ปรับจำนวนตามต้องการ
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return []
    const data = await res.json()

    // 1. รวบรวม ID รูปภาพทั้งหมดจากทุกรายการ
    const imageIds = data
      .map((wp: any) => wp.acf?.image)
      .filter((id: any): id is number => typeof id === 'number')

    // 2. ไปดึงข้อมูล URL ของ Media ทั้งหมดมาทีเดียว
    const mediaMap = await getMediaMap(imageIds)

    // 3. Map ข้อมูลกลับเป็นโครงสร้าง WhyItemView
    return data
      .sort((a: any, b: any) => (a.acf?.order ?? 0) - (b.acf?.order ?? 0))
      .map((wp: any) => {
        const acf = wp.acf
        const imageId = acf?.image
        const title = locale === "th" ? acf?.title_th : acf?.title_en || acf?.title_th
        
        return {
          title: title || "",
          description: locale === "th" ? acf?.description_th : acf?.description_en || acf?.description_th,
          image: imageId && mediaMap[imageId]
            ? {
                src: mediaMap[imageId],
                alt: title || "",
              }
            : undefined,
        }
      })
  } catch (error) {
    console.error("Error fetching Why Choose Us:", error)
    return []
  }
}