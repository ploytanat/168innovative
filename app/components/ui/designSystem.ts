export const PAGE_BG = [
  "radial-gradient(circle at 88% -2%, rgba(110,142,196,0.36) 0%, transparent 24%)",
  "radial-gradient(circle at 12% 18%, rgba(241,197,151,0.28) 0%, transparent 20%)",
  "radial-gradient(circle at 78% 34%, rgba(170,197,225,0.22) 0%, transparent 18%)",
  "radial-gradient(circle at 18% 66%, rgba(222,184,203,0.22) 0%, transparent 20%)",
  "radial-gradient(circle at 52% 48%, rgba(255,255,255,0.56) 0%, transparent 30%)",
  "linear-gradient(180deg, #edf2f5 0%, #f4f1eb 26%, #eef3f8 58%, #f9fbfc 100%)",
].join(", ")

export const SECTION_BACKGROUNDS = {
  hero: [
    "radial-gradient(circle at 86% 4%, rgba(103,137,191,0.34) 0%, transparent 24%)",
    "radial-gradient(circle at 14% 74%, rgba(226,173,188,0.24) 0%, transparent 24%)",
    "radial-gradient(circle at 18% 24%, rgba(243,204,163,0.22) 0%, transparent 18%)",
    "radial-gradient(circle at 48% 50%, rgba(255,255,255,0.54) 0%, transparent 28%)",
    "linear-gradient(145deg, #eaf0f5 0%, #f5efe8 44%, #eef4fa 100%)",
  ].join(", "),
  cool: [
    "radial-gradient(circle at 90% 12%, rgba(125,160,214,0.30) 0%, transparent 24%)",
    "radial-gradient(circle at 8% 22%, rgba(197,213,231,0.30) 0%, transparent 22%)",
    "radial-gradient(circle at 24% 86%, rgba(235,211,189,0.18) 0%, transparent 18%)",
    "linear-gradient(160deg, #eef3f8 0%, #e8f0f8 42%, #f8fbfd 100%)",
  ].join(", "),
  warm: [
    "radial-gradient(circle at 18% 18%, rgba(244,202,162,0.26) 0%, transparent 18%)",
    "radial-gradient(circle at 84% 18%, rgba(172,197,227,0.22) 0%, transparent 18%)",
    "radial-gradient(circle at 72% 78%, rgba(229,190,204,0.18) 0%, transparent 20%)",
    "linear-gradient(160deg, #f6f0ea 0%, #eef3f7 42%, #fbfcfd 100%)",
  ].join(", "),
  neutral: [
    "radial-gradient(circle at 16% 14%, rgba(255,255,255,0.54) 0%, transparent 18%)",
    "radial-gradient(circle at 84% 24%, rgba(180,200,223,0.18) 0%, transparent 20%)",
    "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0))",
  ].join(", "),
  footer: [
    "radial-gradient(circle at 82% 14%, rgba(109,142,192,0.26) 0%, transparent 22%)",
    "radial-gradient(circle at 12% 24%, rgba(240,205,172,0.18) 0%, transparent 18%)",
    "radial-gradient(circle at 26% 88%, rgba(224,188,200,0.16) 0%, transparent 20%)",
    "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
    "linear-gradient(160deg, #eef2f6 0%, #f7f3ee 100%)",
  ].join(", "),
} as const

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
  "radial-gradient(circle at 82% 16%,rgba(125,160,214,0.24) 0%,transparent 26%), radial-gradient(circle at 18% 78%,rgba(243,204,163,0.18) 0%,transparent 22%), linear-gradient(145deg,rgba(255,255,255,0.72),rgba(234,241,249,0.44))"

export const SOFT_IMAGE_BG_ALT =
  "radial-gradient(circle at 78% 18%,rgba(193,210,229,0.24) 0%,transparent 24%), radial-gradient(circle at 20% 70%,rgba(229,190,204,0.16) 0%,transparent 22%), linear-gradient(145deg,rgba(255,255,255,0.76),rgba(238,242,247,0.56))"
