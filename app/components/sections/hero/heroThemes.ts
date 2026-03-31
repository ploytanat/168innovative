export type HeroTheme = 'rose' | 'sky' | 'violet' | 'emerald'
export type HeroBadgeVariant = 'hot' | 'new' | 'promo' | 'featured'

export interface ThemeConfig {
  pageGradient: string
  blobA: string
  blobB: string
  tagBg: string
  tagText: string
  accent: string
  accentSolid: string
  softAccent: string
  cardHead: string
  iconBg: string
  iconText: string
  shadow: string
}

export const HERO_THEMES: Record<HeroTheme, ThemeConfig> = {
  rose: {
    pageGradient: 'linear-gradient(180deg, #faf8f5 0%, #fef7f7 100%)',
    blobA: 'radial-gradient(circle, rgba(232,147,154,.42), transparent 65%)',
    blobB: 'radial-gradient(circle, rgba(158,142,196,.24), transparent 65%)',
    tagBg: '#fdeef0',
    tagText: '#c96870',
    accent: 'linear-gradient(135deg, #e8939a 0%, #c96870 100%)',
    accentSolid: '#c96870',
    softAccent: '#f5d0d4',
    cardHead: 'linear-gradient(135deg, #fdeef0, #f5d0d4)',
    iconBg: '#fdeef0',
    iconText: '#c96870',
    shadow: 'rgba(201,104,112,.22)',
  },
  sky: {
    pageGradient: 'linear-gradient(180deg, #f7fafc 0%, #f2f8ff 100%)',
    blobA: 'radial-gradient(circle, rgba(107,191,168,.34), transparent 65%)',
    blobB: 'radial-gradient(circle, rgba(106,170,224,.22), transparent 65%)',
    tagBg: '#e4f5f0',
    tagText: '#3a9e86',
    accent: 'linear-gradient(135deg, #6bbfa8 0%, #4f9f8b 100%)',
    accentSolid: '#6bbfa8',
    softAccent: '#cfe9e1',
    cardHead: 'linear-gradient(135deg, #e4f5f0, #c8eae0)',
    iconBg: '#e4f5f0',
    iconText: '#3a9e86',
    shadow: 'rgba(107,191,168,.22)',
  },
  violet: {
    pageGradient: 'linear-gradient(180deg, #faf9fd 0%, #f6f2ff 100%)',
    blobA: 'radial-gradient(circle, rgba(158,142,196,.38), transparent 65%)',
    blobB: 'radial-gradient(circle, rgba(106,170,224,.18), transparent 65%)',
    tagBg: '#ede8f8',
    tagText: '#7a5ab0',
    accent: 'linear-gradient(135deg, #9e8ec4 0%, #7a5ab0 100%)',
    accentSolid: '#9e8ec4',
    softAccent: '#ddd4f4',
    cardHead: 'linear-gradient(135deg, #ede8f8, #ddd4f4)',
    iconBg: '#ede8f8',
    iconText: '#7a5ab0',
    shadow: 'rgba(158,142,196,.24)',
  },
  emerald: {
    pageGradient: 'linear-gradient(180deg, #fffaf5 0%, #fff6ee 100%)',
    blobA: 'radial-gradient(circle, rgba(232,168,112,.38), transparent 65%)',
    blobB: 'radial-gradient(circle, rgba(232,147,154,.18), transparent 65%)',
    tagBg: '#fdf0e4',
    tagText: '#c07030',
    accent: 'linear-gradient(135deg, #e8a870 0%, #d98747 100%)',
    accentSolid: '#e8a870',
    softAccent: '#f8dfc4',
    cardHead: 'linear-gradient(135deg, #fdf0e4, #f8dfc4)',
    iconBg: '#fdf0e4',
    iconText: '#c07030',
    shadow: 'rgba(232,168,112,.22)',
  },
}

export const BADGE_ICONS: Record<HeroBadgeVariant, string> = {
  hot: '●',
  new: '◆',
  promo: '✦',
  featured: '◌',
}
