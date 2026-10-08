export const PAGE_BG = "linear-gradient(145deg, #f8fafc, #eef4f8 60%, #ffffff)"
export const SECTION_BACKGROUNDS = {
  hero: "linear-gradient(125deg, #f8fafc, #eaf1f7)",
  cool: "#eef4f8", warm: "#f7f9fb", neutral: "#ffffff", footer: "#edf2f7",
} as const

export const COLORS = {
  dark: "#1a2232",
  mid: "#3a4a5c",
  soft: "#5a6a7c",
  hint: "#65758a",
  brandNavy: "#263859",
  brandMuted: "#597197",
} as const

export const CTA_GRADIENT = "#263859"
export const CTA_SHADOW = "none"
export const SECTION_BORDER = "rgba(255,255,255,0.55)"
export const CARD_DIVIDER = "rgba(30,40,60,0.10)"

export const GLASS = {
  primary: {
    background: "rgba(255,255,255,0.58)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.80)",
    boxShadow: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.82)",
    boxShadow: "none",
  },
  stats: {
    background: "rgba(255,255,255,0.42)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "none",
  },
  card: {
    background: "rgba(255,255,255,0.52)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.72)",
    boxShadow: "none",
  },
} as const

export const PAGE_BG_STYLE = { background: PAGE_BG } as const

export const EYEBROW_PILL_STYLE = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.75)",
  color: COLORS.mid,
} as const

export const BADGE_STYLE = {
  background: "rgba(30,40,60,0.07)",
  border: "1px solid rgba(30,40,60,0.12)",
  color: COLORS.mid,
} as const

export const CTA_BUTTON_STYLE = {
  background: CTA_GRADIENT,
  color: "#ffffff",
  boxShadow: CTA_SHADOW,
} as const

export const GHOST_BUTTON_STYLE = {
  background: "rgba(255,255,255,0.52)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.72)",
  color: COLORS.dark,
  boxShadow: "none",
} as const

export const NAV_ACTIVE_PILL_STYLE = {
  background: "#e8eef5", border: "1px solid #dce5ef", borderRadius: 8,
  color: "#263859", fontWeight: 600,
} as const

export const NAV_SHELL_STYLE = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.70)",
  boxShadow: "none",
} as const

export const SOFT_IMAGE_BG = "#f0f4f8"
export const SOFT_IMAGE_BG_ALT = "#f4f6f9"
