import type { Locale } from "@/app/lib/types/content"
import type { CategoryView, ProductView } from "@/app/lib/types/view"

type ProductSupportCopy = {
  eyebrow: string
  title: string
  paragraphs: string[]
  bulletsTitle: string
  bullets: string[]
}

function getTopSpecs(product: ProductView, limit = 3) {
  return product.specs
    .filter((spec) => spec.value.trim().length > 0)
    .slice(0, limit)
    .map((spec) => `${spec.label}: ${spec.value}`)
}

export function buildProductSupportCopy(
  product: ProductView,
  category: CategoryView,
  locale: Locale
): ProductSupportCopy {
  const topSpecs = getTopSpecs(product)

  if (locale === "en") {
    return {
      eyebrow: "Product Guide",
      title: `How to Evaluate ${product.name}`,
      paragraphs: [
        `${product.name} sits in the ${category.name} category and is presented as a focused product page for buyers comparing packaging formats, dimensions, and production fit.`,
        topSpecs.length > 0
          ? `Key specs on this page include ${topSpecs.join(", ")}. These details help teams shortlist the right item faster before requesting samples or quotations.`
          : `This page is structured to support early product evaluation, quotation requests, and comparison against other items in the same category.`,
      ],
      bulletsTitle: "Why this page matters",
      bullets: [
        `Links back to the ${category.name} category for broader product comparison.`,
        "Includes structured product data, specifications, and contact intent for quotation workflow.",
        "Supports internal linking between product, category, and related content pages.",
      ],
    }
  }

  return {
    eyebrow: "คู่มือสินค้า",
    title: `แนวทางเลือก ${product.name}`,
    paragraphs: [
      `${product.name} อยู่ในหมวด ${category.name} และหน้านี้ถูกจัดวางเพื่อช่วยให้ทีมจัดซื้อหรือเจ้าของแบรนด์เปรียบเทียบสินค้าในเชิงขนาด การใช้งาน และความเหมาะสมกับงานบรรจุภัณฑ์ได้ชัดขึ้น`,
      topSpecs.length > 0
        ? `ข้อมูลสำคัญที่ใช้ตัดสินใจในหน้านี้ เช่น ${topSpecs.join(", ")} ช่วยให้คัดตัวเลือกเบื้องต้นได้เร็วขึ้นก่อนขอตัวอย่างหรือสอบถามราคา`
        : `หน้านี้รองรับการประเมินสินค้าเบื้องต้น การขอใบเสนอราคา และการเปรียบเทียบกับสินค้าตัวอื่นในหมวดเดียวกัน`,
    ],
    bulletsTitle: "จุดที่หน้านี้ช่วยในการตัดสินใจ",
    bullets: [
      `เชื่อมกลับไปยังหมวด ${category.name} เพื่อดูสินค้าที่ใกล้เคียงกัน`,
      "มีข้อมูลสเปก โครงสร้างหน้าแบบสินค้า และช่องทางติดต่อเพื่อรองรับการขอราคา",
      "ช่วยส่ง internal links ระหว่างหน้า product, category และ content ที่เกี่ยวข้อง",
    ],
  }
}
