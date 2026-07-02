# Design

Homepage visual system for 168 INNOVATIVE. Source of truth for tokens lives in
[`app/components/sections/home-theme.ts`](app/components/sections/home-theme.ts)
and [`app/globals.css`](app/globals.css); this document mirrors and explains
them.

## Palette

Green / black / white only. No warm-neutral cream body, no pastel splash.

### Neutrals

| Token | Hex | Role |
|---|---|---|
| `surface` | `#ffffff` | Dominant section background. |
| `mist` | `#f9f9f9` | Card / image tile fill (mostly hidden by `object-cover`). |
| `cream` | `#f4f5f0` | Near-neutral off-white for legacy card slots (Contact, UspBar). Reads white on-screen. |
| `line` | `#ececec` | 1px borders and section rules. |
| `ink` | `#333333` | Body text. Contrast 12.6:1 on white. |
| `inkMid` | `#555555` | Muted body text. |
| `inkSoft` | `#888888` | De-emphasized labels. |
| `dark` | `#1a1a1a` | ContactSection background (near-black, not `#000000`). |

### Leaves

| Token | Hex | Role |
|---|---|---|
| `leaf` | `#7cb342` | Bright leaf. Solid CTA background, round arrow buttons, highlighted words, dots. Not safe for small text on white (~3:1). |
| `mintInk` | `#4a7a1e` | Deep leaf. Text-on-white for accent (eyebrows, active links), outlined-button border and hover state for `leaf`. ~5.5:1 on white. |
| `mint` | `#e6f0d9` | Pale leaf tint. Icon backgrounds, category tile fills, FAQ Plus icon hover. |
| `mintSoft` | `#f2f7ea` | Whisper leaf. Soft button fill (`.home-btn-soft`), reserved for card/soft accents. |

## Typography

Single body/heading family plus one display face for Latin.

- **Body & heading**: IBM Plex Sans Thai — via `next/font/google` in `app/config/fonts.ts` as `--font-ibm`. Covers Thai + Latin. Max weight 700 (family has no 800/900).
- **Display**: Cabinet Grotesk — via Fontshare CDN, loaded in `app/components/layout/RootDocument.tsx`. Latin only; Thai gracefully falls back to IBM. Apply with the `.font-display` utility.

**Rules**

- Never tighten letter-spacing past `-0.02em` on display headings — Thai vowel/tone marks clip. `globals.css` sets `-0.035em` globally on `h1`–`h6`; override at the section level for Thai display (see `SECTION_HEADING` / `DISPLAY_HEADING` constants).
- Use `text-wrap: balance` on `h1` / `h2` and `word-break: keep-all` when the heading contains Thai to prevent mid-word breaks (e.g. "บรรจุ/ภัณฑ์").
- **No repeated section eyebrows.** Tiny uppercase tracked kickers (`ABOUT`, `PROCESS`, `WHY US`) stacked above every h2 are AI editorial scaffolding — Impeccable bans it explicitly. Sections carry themselves through the h2 and the section content; if a section truly needs framing, use a structural move (a lead sentence in a different scale, an artifact + short caption, or imagery), not a per-section kicker. At most one deliberate brand-system kicker per page.
- Field labels in forms (`อีเมล`, `Phone`) and column headers in nav/footer are structural labels, not section kickers — those may stay as `text-[11px] font-bold uppercase tracking-[0.22em]`.

## Layout & Spacing

- Base unit: 4px. Common spacings: **4, 8, 12, 16, 24, 32, 48, 64**. Nothing else without a reason.
- `SECTION_PAD = "py-12 sm:py-16"` — 48px mobile, 64px desktop. Hard ceiling; do not push past 64px vertical.
- `CONTAINER = "mx-auto w-full max-w-[1200px] px-5"` — 20px side padding on mobile, centered `1200px` max.

## Borders, Radii, Shadows

- **Border**: `1px solid` only. Never 2px+ as decoration. Colour: `line` for neutral, `mintInk` for accent.
- **Radius**: `rounded` (4px) for buttons and inputs; `rounded-lg` (8px) for cards and image tiles; `rounded-none` (0) for full-bleed panels. **`rounded-full` is banned** except for two signature elements: PortfolioGrid tile arrow button and FaqSection Plus icon.
- **Shadow**: single utility, `--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08)`. No multi-layer elevation, no soft-wide drop shadows.

## Sections (homepage rhythm)

All white with thin rule dividers; the ContactSection closes on dark.

1. **HomeHero** — white, copy on the left, product image on the right. `leaf` CTA + outlined `mintInk` CTA.
2. **CategoryStrip** — white, 5 category thumbs (mobile scroll → sm+ 5-col grid).
3. **IntroBand** — white with 1px rules top and bottom. Desktop: giant "MADE FOR YOU" display type in `leaf` at 35% opacity with the featured banner image absolutely overlaid. Mobile: featured image on its own (poster overlay hidden — too dense at narrow widths).
4. **CategorySection** — white with a top rule, 9 category tiles on `mint` fills.
5. **PortfolioGrid** — white, 2-col mobile / 3-col sm+. Square tiles with an 8% `leaf` multiply wash over each product photo to unify mixed studio backgrounds; wash fades on hover. Signature 32px (mobile) / 36px (sm+) `leaf` round arrow anchored bottom-right of the image.
6. **PromoGrid** — white, "Why work with 168" list. Icon palette rotates `leaf` solid → pale `mint` tint → white with 1px `line` border.
7. **FaqSection** — white with a top rule, sticky heading on lg+, `<details>` accordion with a `leaf`-filled round Plus icon that rotates 45° on open.
8. **ContactSection** — `dark` background, LINE OA card, and the contact form.

## Motion

- Transitions: `ease-out` curves at 200-600ms. Nothing spring / bounce.
- Hover reveals (PortfolioGrid wash fade, arrow slide, tile scale) all key on `.group:hover`.
- The `prefers-reduced-motion: reduce` media query in `globals.css` already disables the marquee and floating utilities. Preserve this when adding new animations — every reveal needs a static fallback.
