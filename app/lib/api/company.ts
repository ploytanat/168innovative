import { unstable_cache } from "next/cache"

import { Locale, WPMediaItem } from "../types/content"
import { pickLocalizedText } from "./acf"
import { fetchWithDevCache } from "./dev-cache"
import { getMockCompany, isMockModeEnabled } from "../mock/runtime"
import { CompanyView } from "../types/view"

const BASE = process.env.WP_API_URL
const COMPANY_REVALIDATE_SECONDS = 60

if (!BASE) {
  throw new Error("WP_API_URL is not defined")
}

interface CompanyAcf {
  logo?: number
  name_th?: string
  name_en?: string
  address_th?: string
  address_en?: string
  phone_1_number?: string
  phone_1_label_th?: string
  phone_1_label_en?: string
  phone_2_number?: string
  phone_2_label_th?: string
  phone_2_label_en?: string
  phone_3_number?: string
  phone_3_label_th?: string
  phone_3_label_en?: string
  phone_4_number?: string
  phone_4_label_th?: string
  phone_4_label_en?: string
  email_1?: string
  email_2?: string
  email_3?: string
  social_1_type?: string
  social_1_url?: string
  social_1_icon?: number
  social_2_type?: string
  social_2_url?: string
  social_2_icon?: number
  social_3_type?: string
  social_3_url?: string
  social_3_icon?: number
  line_qr?: number
  contact_image?: number
  contact_image_1?: number
  contact_image_1_alt_th?: string
  contact_image_1_alt_en?: string
  contact_image_2?: number
  contact_image_2_alt_th?: string
  contact_image_2_alt_en?: string
  contact_image_3?: number
  contact_image_3_alt_th?: string
  contact_image_3_alt_en?: string
  contact_image_4?: number
  contact_image_4_alt_th?: string
  contact_image_4_alt_en?: string
}

type RawCompanyData = {
  acf: CompanyAcf
  mediaMap: Record<number, string>
} | null

const getCompanyData = unstable_cache(
  async (): Promise<RawCompanyData> => {
    const res = await fetchWithDevCache(
      `${BASE}/wp-json/wp/v2/company?per_page=1`,
      {
        next: { revalidate: COMPANY_REVALIDATE_SECONDS, tags: ["company"] },
      },
      COMPANY_REVALIDATE_SECONDS
    )

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as Array<{ acf?: CompanyAcf }>
    const acf = data?.[0]?.acf

    if (!acf) {
      return null
    }

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
    ].filter((id): id is number => typeof id === "number" && id > 0)

    const mediaMap: Record<number, string> = {}

    if (imageIds.length > 0) {
      const uniqueIds = Array.from(new Set(imageIds))
      const mediaRes = await fetchWithDevCache(
        `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`,
        {
          next: {
            revalidate: COMPANY_REVALIDATE_SECONDS,
            tags: ["company"],
          },
        },
        COMPANY_REVALIDATE_SECONDS
      )

      if (mediaRes.ok) {
        const mediaData = (await mediaRes.json()) as WPMediaItem[]
        mediaData.forEach((media) => {
          mediaMap[media.id] = media.source_url || media.guid?.rendered || ""
        })
      }
    }

    return { acf, mediaMap }
  },
  ["company-data-v3"],
  { revalidate: COMPANY_REVALIDATE_SECONDS, tags: ["company"] }
)

function getMediaUrl(mediaMap: Record<number, string>, id: unknown) {
  return typeof id === "number" ? mediaMap[id] ?? null : null
}

function getPhonePriority(label: string) {
  const normalized = label.trim().toLowerCase()

  if (
    normalized.includes("สำนักงานใหญ่") ||
    normalized.includes("ติดต่อสำนักงาน") ||
    normalized.includes("head office") ||
    normalized.includes("office")
  ) {
    return 0
  }

  return 1
}

export async function getCompany(locale: Locale): Promise<CompanyView | null> {
  if (isMockModeEnabled()) {
    return getMockCompany(locale)
  }

  try {
    const data = await getCompanyData()

    if (!data) {
      return null
    }

    const { acf, mediaMap } = data

    const contactGallery = [
      {
        id: acf.contact_image_1,
        th: acf.contact_image_1_alt_th,
        en: acf.contact_image_1_alt_en,
      },
      {
        id: acf.contact_image_2,
        th: acf.contact_image_2_alt_th,
        en: acf.contact_image_2_alt_en,
      },
      {
        id: acf.contact_image_3,
        th: acf.contact_image_3_alt_th,
        en: acf.contact_image_3_alt_en,
      },
      {
        id: acf.contact_image_4,
        th: acf.contact_image_4_alt_th,
        en: acf.contact_image_4_alt_en,
      },
    ]
      .map((item) => {
        const src = getMediaUrl(mediaMap, item.id)
        if (!src) return null

        return {
          src,
          alt: locale === "th" ? item.th || "" : item.en || "",
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const socials = [
      {
        type: acf.social_1_type,
        url: acf.social_1_url,
        iconId: acf.social_1_icon,
      },
      {
        type: acf.social_2_type,
        url: acf.social_2_url,
        iconId: acf.social_2_icon,
      },
      {
        type: acf.social_3_type,
        url: acf.social_3_url,
        iconId: acf.social_3_icon,
      },
    ]
      .filter((social) => social.url)
      .map((social) => {
        const iconSrc = getMediaUrl(mediaMap, social.iconId)
        const type = social.type ?? "social"
        const url = social.url ?? "#"

        return {
          type,
          url,
          icon: iconSrc
            ? { src: iconSrc, alt: type }
            : undefined,
        }
      })

    const logoSrc = getMediaUrl(mediaMap, acf.logo)
    const lineQrSrc = getMediaUrl(mediaMap, acf.line_qr)
    const contactImageSrc = getMediaUrl(mediaMap, acf.contact_image)
    const phones = [
      {
        number: acf.phone_1_number,
        label: pickLocalizedText(
          locale,
          acf.phone_1_label_th,
          acf.phone_1_label_en
        ),
      },
      {
        number: acf.phone_2_number,
        label: pickLocalizedText(
          locale,
          acf.phone_2_label_th,
          acf.phone_2_label_en
        ),
      },
      {
        number: acf.phone_3_number,
        label: pickLocalizedText(
          locale,
          acf.phone_3_label_th,
          acf.phone_3_label_en
        ),
      },
      {
        number: acf.phone_4_number,
        label: pickLocalizedText(
          locale,
          acf.phone_4_label_th,
          acf.phone_4_label_en
        ),
      },
    ].filter(
      (
        phone
      ): phone is {
        number: string
        label: string
      } => Boolean(phone.number)
    )
      .map((phone, index) => ({ ...phone, index }))
      .sort(
        (a, b) =>
          getPhonePriority(a.label) - getPhonePriority(b.label) ||
          a.index - b.index
      )
      .map((phone) => ({ number: phone.number, label: phone.label }))
    const email = [acf.email_1, acf.email_2, acf.email_3].filter(
      (item): item is string => Boolean(item)
    )

    return {
      name: pickLocalizedText(locale, acf.name_th, acf.name_en),
      address: pickLocalizedText(locale, acf.address_th, acf.address_en),
      logo: logoSrc
        ? {
            src: logoSrc,
            alt: pickLocalizedText(locale, acf.name_th, acf.name_en, "168 Innovative"),
          }
        : {
            src: "/fallback-logo.png",
            alt: "Company Logo",
          },
      phones,
      email,
      socials,
      lineQrCode: lineQrSrc
        ? {
            src: lineQrSrc,
            alt: locale === "th" ? "LINE QR code" : "Scan to add LINE",
          }
        : undefined,
      contactImage: contactImageSrc
        ? {
            src: contactImageSrc,
            alt: pickLocalizedText(locale, acf.name_th, acf.name_en, "168 Innovative"),
          }
        : undefined,
      contactGallery,
    }
  } catch (error) {
    console.error("Error fetching company data:", error)
    return null
  }
}
