export const PAGE_BG = [
  "radial-gradient(ellipse 55% 70% at 95% 5%,  #9fb3cc 0%, transparent 65%)",
  "radial-gradient(ellipse 40% 55% at 5%  45%,  #b8c4d8 0%, transparent 60%)",
  "radial-gradient(ellipse 30% 40% at 8%  72%,  #e0c0d4 0%, #d4b8cc 30%, transparent 65%)",
  "radial-gradient(ellipse 60% 50% at 45% 50%,  #e8edf3 0%, transparent 70%)",
  "#dde4ec",
].join(", ")

export const COLORS = {
  dark: "#1a2232",
  mid: "#3a4a5c",
  soft: "#5a6a7c",
  hint: "#8a9aac",
  brandNavy: "#24457c",
  brandMuted: "#597197",
} as const

export const CTA_GRADIENT = "linear-gradient(135deg, #3a7bd5, #2ab8b0)"
export const CTA_SHADOW = "0 4px 16px rgba(58,123,213,0.25)"
export const SECTION_BORDER = "rgba(255,255,255,0.55)"
export const CARD_DIVIDER = "rgba(30,40,60,0.10)"

export const GLASS = {
  primary: {
    background: "rgba(255,255,255,0.58)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.80)",
    boxShadow: "0 8px 32px rgba(30,40,60,0.10), inset 0 1px 0 rgba(255,255,255,0.90)",
  },
  secondary: {
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.82)",
    boxShadow: "0 4px 20px rgba(30,40,60,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
  },
  stats: {
    background: "rgba(255,255,255,0.42)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 4px 16px rgba(30,40,60,0.06), inset 0 1px 0 rgba(255,255,255,0.80)",
  },
  card: {
    background: "rgba(255,255,255,0.52)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.72)",
    boxShadow: "0 4px 16px rgba(30,40,60,0.07), inset 0 1px 0 rgba(255,255,255,0.88)",
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
  boxShadow: "0 4px 16px rgba(30,40,60,0.07), inset 0 1px 0 rgba(255,255,255,0.88)",
} as const

export const NAV_ACTIVE_PILL_STYLE = {
  background:
    "linear-gradient(135deg, rgba(225,244,235,0.96), rgba(236,248,242,0.97) 42%, rgba(232,240,252,0.96))",
  border: "1px solid rgba(165,196,202,0.82)",
  borderRadius: 9999,
  boxShadow: "0 10px 22px rgba(132,170,178,0.16), inset 0 1px 0 rgba(255,255,255,0.95)",
  color: "#2f3f58",
  fontWeight: 600,
} as const

export const NAV_SHELL_STYLE = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.70)",
  boxShadow: "0 2px 16px rgba(30,40,60,0.07), inset 0 -1px 0 rgba(255,255,255,0.50)",
} as const

export const SOFT_IMAGE_BG =
  "radial-gradient(circle at 82% 16%,rgba(159,179,204,0.24) 0%,transparent 26%), linear-gradient(145deg,rgba(255,255,255,0.60),rgba(232,240,250,0.40))"

export const SOFT_IMAGE_BG_ALT =
  "radial-gradient(circle at 82% 16%,rgba(184,196,216,0.24) 0%,transparent 24%), linear-gradient(145deg,rgba(255,255,255,0.68),rgba(232,240,250,0.50))"
