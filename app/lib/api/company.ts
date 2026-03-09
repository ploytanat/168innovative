import { unstable_cache } from "next/cache"

import { Locale } from "../types/content"
import { CompanyView } from "../types/view"

const BASE = process.env.WP_API_URL

if (!BASE) {
  throw new Error("WP_API_URL is not defined")
}

type RawCompanyData = {
  acf: Record<string, any>
  mediaMap: Record<number, string>
} | null

const getCompanyData = unstable_cache(
  async (): Promise<RawCompanyData> => {
    const res = await fetch(`${BASE}/wp-json/wp/v2/company?per_page=1`, {
      next: { revalidate: 3600, tags: ["company"] },
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
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
      const mediaRes = await fetch(
        `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`,
        { next: { revalidate: 3600, tags: ["company"] } }
      )

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json()
        mediaData.forEach((media: any) => {
          mediaMap[media.id] = media.source_url || media.guid?.rendered || ""
        })
      }
    }

    return { acf, mediaMap }
  },
  ["company-data-v2"],
  { revalidate: 3600, tags: ["company"] }
)

function getMediaUrl(mediaMap: Record<number, string>, id: unknown) {
  return typeof id === "number" ? mediaMap[id] ?? null : null
}

export async function getCompany(locale: Locale): Promise<CompanyView | null> {
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

        return {
          type: social.type,
          url: social.url,
          icon: iconSrc
            ? { src: iconSrc, alt: social.type }
            : undefined,
        }
      })

    const logoSrc = getMediaUrl(mediaMap, acf.logo)
    const lineQrSrc = getMediaUrl(mediaMap, acf.line_qr)
    const contactImageSrc = getMediaUrl(mediaMap, acf.contact_image)

    return {
      name: locale === "th" ? acf.name_th : acf.name_en,
      address: locale === "th" ? acf.address_th : acf.address_en,
      logo: logoSrc
        ? {
            src: logoSrc,
            alt: locale === "th" ? acf.name_th : acf.name_en,
          }
        : {
            src: "/fallback-logo.png",
            alt: "Company Logo",
          },
      phones: [
        {
          number: acf.phone_1_number,
          label: locale === "th" ? acf.phone_1_label_th : acf.phone_1_label_en,
        },
        {
          number: acf.phone_2_number,
          label: locale === "th" ? acf.phone_2_label_th : acf.phone_2_label_en,
        },
        {
          number: acf.phone_3_number,
          label: locale === "th" ? acf.phone_3_label_th : acf.phone_3_label_en,
        },
      ].filter((phone) => phone.number),
      email: [acf.email_1, acf.email_2, acf.email_3].filter(Boolean),
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
            alt: locale === "th" ? acf.name_th : acf.name_en,
          }
        : undefined,
      contactGallery,
    }
  } catch (error) {
    console.error("Error fetching company data:", error)
    return null
  }
}
