// ─── Types ────────────────────────────────────────────────────────────────────

export type HeroTheme       = 'rose' | 'sky' | 'violet' | 'emerald'
export type HeroBadgeVariant = 'hot' | 'new' | 'promo' | 'featured'

export interface ThemeConfig {
  /** Primary accent color — used for dot, stat values, check icons */
  dot: string
  /** CSS gradient for the image-panel background */
  imgBg: string
  /** Two ambient orb colors, used as rgba strings */
  orbA: string
  orbB: string
  /** CSS gradient for the primary CTA button */
  accent: string
  /** CSS gradient for the highlighted title-line mark */
  mark: string
  /** rgba shadow color — used in box-shadow and drop-shadow */
  shadow: string
  badge: {
    bg:     string
    border: string
    text:   string
  }
}

// ─── Theme map ────────────────────────────────────────────────────────────────
//
// `satisfies` catches typos in property names at the definition site
// while keeping the inferred literal types for each value.

export const HERO_THEMES = {
  rose: {
    dot:    '#ee0979',
    imgBg:  'linear-gradient(145deg,#fff0f5 0%,#ffc9d8 50%,#ffa0bc 100%)',
    orbA:   'rgba(255,100,140,0.45)',
    orbB:   'rgba(255,190,210,0.35)',
    accent: 'linear-gradient(135deg,#ff6b8a 0%,#ee0979 100%)',
    mark:   'linear-gradient(135deg,#ff6b8a 0%,#ee0979 100%)',
    shadow: 'rgba(238,9,121,0.25)',
    badge:  { bg: 'rgba(238,9,121,0.08)', border: 'rgba(238,9,121,0.22)', text: '#be0060' },
  },
  sky: {
    dot:    '#0ea5e9',
    imgBg:  'linear-gradient(145deg,#eff8ff 0%,#bae6fd 50%,#60c5f5 100%)',
    orbA:   'rgba(14,165,233,0.40)',
    orbB:   'rgba(147,197,253,0.35)',
    accent: 'linear-gradient(135deg,#38bdf8 0%,#2563eb 100%)',
    mark:   'linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)',
    shadow: 'rgba(37,99,235,0.22)',
    badge:  { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.22)', text: '#0369a1' },
  },
  violet: {
    dot:    '#8b5cf6',
    imgBg:  'linear-gradient(145deg,#faf5ff 0%,#e9d5ff 50%,#c4b5fd 100%)',
    orbA:   'rgba(139,92,246,0.40)',
    orbB:   'rgba(216,180,254,0.35)',
    accent: 'linear-gradient(135deg,#a78bfa 0%,#ec4899 100%)',
    mark:   'linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)',
    shadow: 'rgba(139,92,246,0.25)',
    badge:  { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.22)', text: '#6d28d9' },
  },
  emerald: {
    dot:    '#10b981',
    imgBg:  'linear-gradient(145deg,#f0fdf4 0%,#bbf7d0 50%,#6ee7b7 100%)',
    orbA:   'rgba(52,211,153,0.40)',
    orbB:   'rgba(110,231,183,0.35)',
    accent: 'linear-gradient(135deg,#34d399 0%,#0d9488 100%)',
    mark:   'linear-gradient(135deg,#10b981 0%,#0d9488 100%)',
    shadow: 'rgba(13,148,136,0.22)',
    badge:  { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.22)', text: '#065f46' },
  },
} as const satisfies Record<HeroTheme, ThemeConfig>