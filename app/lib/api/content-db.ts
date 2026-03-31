import { pickLocalizedText } from './acf'
import type { Locale } from '../types/content'
import type {
  DBAboutSection,
  DBCompanyContactMethod,
  DBCompanyGalleryImage,
  DBCompanyProfile,
  DBHeroSlide,
  DBHeroSlideChip,
  DBHeroSlideStat,
  DBWhyItem,
} from '../db/types'
import type { AboutView, CompanyView, HeroSlideView, WhyItemView } from '../types/view'

function toImage(
  src: string | null | undefined,
  alt: string
) {
  if (!src) return undefined

  return {
    src,
    alt,
  }
}

export function mapDbHeroSlide(
  slide: DBHeroSlide,
  stats: DBHeroSlideStat[],
  chips: DBHeroSlideChip[],
  locale: Locale
): HeroSlideView {
  const title = pickLocalizedText(locale, slide.title_th, slide.title_en, slide.title_th)

  return {
    id: slide.id,
    theme: slide.theme,
    badge: {
      text: pickLocalizedText(
        locale,
        slide.badge_text_th,
        slide.badge_text_en,
        slide.badge_text_th
      ),
      variant: slide.badge_variant,
    },
    title,
    description:
      pickLocalizedText(locale, slide.description_th, slide.description_en) ?? '',
    image: {
      src: slide.image_url,
      alt: pickLocalizedText(
        locale,
        slide.image_alt_th,
        slide.image_alt_en,
        title
      ),
    },
    ctaPrimary: {
      href: slide.cta_primary_href,
      label: pickLocalizedText(
        locale,
        slide.cta_primary_label_th,
        slide.cta_primary_label_en,
        slide.cta_primary_label_th
      ),
    },
    ctaSecondary:
      slide.cta_secondary_href &&
      pickLocalizedText(
        locale,
        slide.cta_secondary_label_th,
        slide.cta_secondary_label_en
      )
        ? {
            href: slide.cta_secondary_href,
            label: pickLocalizedText(
              locale,
              slide.cta_secondary_label_th,
              slide.cta_secondary_label_en
            ),
          }
        : undefined,
    highlight: slide.highlight_value
      ? {
          value: slide.highlight_value,
          label: pickLocalizedText(
            locale,
            slide.highlight_label_th,
            slide.highlight_label_en,
            slide.highlight_value
          ),
        }
      : undefined,
    stats: stats
      .filter((item) => item.slide_id === slide.id)
      .map((item) => ({
        value: item.metric_value,
        label: pickLocalizedText(locale, item.label_th, item.label_en, item.metric_value),
      })),
    visualTitle:
      pickLocalizedText(locale, slide.visual_title_th, slide.visual_title_en) || undefined,
    visualSubtitle:
      pickLocalizedText(locale, slide.visual_subtitle_th, slide.visual_subtitle_en) || undefined,
    visualChips: chips
      .filter((item) => item.slide_id === slide.id)
      .map((item) =>
        pickLocalizedText(locale, item.label_th, item.label_en)
      )
      .filter(Boolean),
  }
}

export function mapDbCompany(
  company: DBCompanyProfile,
  contacts: DBCompanyContactMethod[],
  gallery: DBCompanyGalleryImage[],
  locale: Locale
): CompanyView {
  const companyName = pickLocalizedText(
    locale,
    company.display_name_th,
    company.display_name_en,
    company.legal_name_th
  )

  return {
    logo:
      toImage(
        company.logo_url,
        pickLocalizedText(locale, company.logo_alt_th, company.logo_alt_en, companyName)
      ) ?? {
        src: '/logo.png',
        alt: companyName,
      },
    name: companyName,
    address: pickLocalizedText(locale, company.address_th, company.address_en) ?? '',
    phones: contacts
      .filter((item) => item.contact_type === 'phone' && item.value)
      .map((item) => ({
        number: item.value!,
        label:
          pickLocalizedText(locale, item.label_th, item.label_en) ||
          pickLocalizedText(
            locale,
            item.person_name_th,
            item.person_name_en,
            item.value!
          ),
      })),
    email: contacts
      .filter((item) => item.contact_type === 'email' && item.value)
      .map((item) => item.value as string),
    socials: contacts
      .filter((item) =>
        ['facebook', 'line', 'instagram', 'shopee'].includes(item.contact_type) &&
        (item.url || item.value)
      )
      .map((item) => ({
        type: item.contact_type,
        url: item.url || item.value || '#',
        icon: item.icon_url
          ? {
              src: item.icon_url,
              alt: item.icon_alt || item.contact_type,
            }
          : undefined,
      })),
    lineQrCode: toImage(
      company.line_qr_url,
      pickLocalizedText(locale, company.line_qr_alt_th, company.line_qr_alt_en, 'LINE QR')
    ),
    contactImage: toImage(
      company.contact_image_url,
      pickLocalizedText(
        locale,
        company.contact_image_alt_th,
        company.contact_image_alt_en,
        companyName
      )
    ),
    contactGallery: gallery.map((item) => ({
      src: item.image_url,
      alt: pickLocalizedText(locale, item.alt_th, item.alt_en, companyName),
    })),
  }
}

export function mapDbAbout(
  sections: DBAboutSection[],
  locale: Locale
): Omit<AboutView, 'why'> | null {
  const heroSection =
    sections.find((section) => section.section_key === 'hero') ?? sections[0]
  const whoSection =
    sections.find((section) => section.section_key === 'who-we-are') ??
    sections.find((section) => section.section_key === 'who_are_we') ??
    sections.find((section) => section.section_key === 'about') ??
    sections[1]

  if (!heroSection || !whoSection) return null

  return {
    hero: {
      title: pickLocalizedText(
        locale,
        heroSection.title_th,
        heroSection.title_en,
        heroSection.section_key
      ),
      description:
        pickLocalizedText(
          locale,
          heroSection.description_th,
          heroSection.description_en
        ) ?? '',
      image1: toImage(
        heroSection.image_primary_url,
        pickLocalizedText(
          locale,
          heroSection.image_primary_alt_th,
          heroSection.image_primary_alt_en,
          heroSection.title_th
        )
      ),
      image2: toImage(
        heroSection.image_secondary_url,
        pickLocalizedText(
          locale,
          heroSection.image_secondary_alt_th,
          heroSection.image_secondary_alt_en,
          heroSection.title_th
        )
      ),
    },
    whoAreWe: {
      title: pickLocalizedText(
        locale,
        whoSection.title_th,
        whoSection.title_en,
        whoSection.section_key
      ),
      description:
        pickLocalizedText(
          locale,
          whoSection.description_th,
          whoSection.description_en
        ) ?? '',
      image: toImage(
        whoSection.image_primary_url,
        pickLocalizedText(
          locale,
          whoSection.image_primary_alt_th,
          whoSection.image_primary_alt_en,
          whoSection.title_th
        )
      ),
    },
    seoTitle: pickLocalizedText(
      locale,
      heroSection.title_th,
      heroSection.title_en
    ) || undefined,
    seoDescription:
      pickLocalizedText(
        locale,
        heroSection.description_th,
        heroSection.description_en
      ) || undefined,
  }
}

export function mapDbWhyItem(item: DBWhyItem, locale: Locale): WhyItemView {
  const title = pickLocalizedText(locale, item.title_th, item.title_en, item.title_th)

  return {
    title,
    description:
      pickLocalizedText(locale, item.description_th, item.description_en) ?? '',
    image: toImage(
      item.image_url,
      pickLocalizedText(locale, item.image_alt_th, item.image_alt_en, title)
    ),
  }
}
