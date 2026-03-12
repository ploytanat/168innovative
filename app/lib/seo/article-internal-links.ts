import type { Locale } from "@/app/lib/types/content"

export type ArticleLinkItem = {
  label: string
  href: string
}

export type ArticleLinkGroup = {
  title: string
  items: ArticleLinkItem[]
}

export type ArticleLinkContent = {
  sectionTitle: string
  sectionDescription: string
  groups: ArticleLinkGroup[]
}

function withLocale(href: string, locale: Locale) {
  return locale === "en" ? `/en${href}` : href
}

export function getArticleInternalLinks(
  slug: string,
  locale: Locale
): ArticleLinkContent | null {
  const contentBySlug: Record<string, ArticleLinkContent> = {
    "spout-oem-guide": {
      sectionTitle:
        locale === "en" ? "Explore Related Spout Products" : "ดูสินค้า Spout ที่เกี่ยวข้อง",
      sectionDescription:
        locale === "en"
          ? "Browse the core spout category and product pages linked to this guide."
          : "ดูหน้าหมวดและหน้าสินค้าหลักที่เกี่ยวข้องกับบทความนี้",
      groups: [
        {
          title: locale === "en" ? "Category" : "หมวดสินค้า",
          items: [
            {
              label: locale === "en" ? "Spout Category" : "หมวดจุก Spout",
              href: withLocale("/categories/spout", locale),
            },
          ],
        },
        {
          title: locale === "en" ? "Featured Products" : "สินค้าที่แนะนำ",
          items: [
            {
              label: "Plastic Spout HL086D 8.6mm",
              href: withLocale("/categories/spout/plastic-spout-hl086d-8-6mm", locale),
            },
            {
              label: "Plastic Spout HL160D 16mm",
              href: withLocale("/categories/spout/plastic-spout-hl160d-16mm", locale),
            },
            {
              label: "Plastic Spout HL220 22mm",
              href: withLocale("/categories/spout/plastic-spout-hl220-22mm", locale),
            },
          ],
        },
      ],
    },
    "pump-dispenser-oem-guide": {
      sectionTitle:
        locale === "en"
          ? "Explore Related Pump Cap Pages"
          : "ดูหน้าสินค้ากลุ่มฝาปั๊มที่เกี่ยวข้อง",
      sectionDescription:
        locale === "en"
          ? "Jump to the main category and representative pump-cap product pages."
          : "ไปยังหน้าหมวดหลักและหน้าสินค้าตัวแทนในกลุ่มฝาปั๊ม",
      groups: [
        {
          title: locale === "en" ? "Category" : "หมวดสินค้า",
          items: [
            {
              label: locale === "en" ? "Dispensing Press Cap" : "หมวดฝาปั๊มและหัวกด",
              href: withLocale("/categories/dispensing-press-cap", locale),
            },
          ],
        },
        {
          title: locale === "en" ? "Featured Products" : "สินค้าที่แนะนำ",
          items: [
            {
              label: "Q20-04",
              href: withLocale("/categories/dispensing-press-cap/q20-04", locale),
            },
          ],
        },
      ],
    },
    "mascara-packaging-oem": {
      sectionTitle:
        locale === "en"
          ? "Explore Related Mascara Packaging"
          : "ดูหน้าสินค้ามาสคาร่าที่เกี่ยวข้อง",
      sectionDescription:
        locale === "en"
          ? "Use these links to browse the mascara category and core product pages."
          : "ใช้ลิงก์เหล่านี้เพื่อเข้าหน้าหมวดและหน้าสินค้ากลุ่มมาสคาร่า",
      groups: [
        {
          title: locale === "en" ? "Category" : "หมวดสินค้า",
          items: [
            {
              label: locale === "en" ? "Mascara Packaging" : "หมวดมาสคาร่า",
              href: withLocale("/categories/mascara-packaging", locale),
            },
          ],
        },
        {
          title: locale === "en" ? "Featured Products" : "สินค้าที่แนะนำ",
          items: [
            {
              label: "Plastic Spout HL070DLJ 7mm",
              href: withLocale(
                "/categories/mascara-packaging/plastic-spout-hl070dlj-7mm",
                locale
              ),
            },
            {
              label: "Plastic Spout HL070J 7mm",
              href: withLocale(
                "/categories/mascara-packaging/plastic-spout-hl070j-7mm",
                locale
              ),
            },
          ],
        },
      ],
    },
  }

  return contentBySlug[slug] ?? null
}
