# Design

Homepage visual system for 168 INNOVATIVE. Source of truth for tokens lives in
[`app/components/sections/home-theme.ts`](app/components/sections/home-theme.ts)
and [`app/globals.css`](app/globals.css); this document mirrors and explains
them.

## Palette

Green / black / white only, with one deliberate exception: PromoGrid's benefit
icons (see Sections below) each carry their own identity color instead of
green. No warm-neutral cream body, no pastel splash.

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

Three fonts, each with a distinct job. All via `next/font/google` in `app/config/fonts.ts`.

- **Body**: IBM Plex Sans Thai — `--font-ibm`. Covers Thai + Latin. Max weight 700 (family has no 800/900). Applied via `.font-body` / the global body rule. Used for all copy, buttons, form fields, FAQ answers, product card descriptions.
- **Heading**: Bai Jamjuree — `--font-bai-jamjuree`. Covers Thai + Latin natively (replaces the old Latin-only Cabinet Grotesk). Applied globally to `h1`–`h6` and via `.font-display` / `.font-heading`. Used for all major headings, product names, and phone/email in the contact zone.
- **Mono**: IBM Plex Mono — `--font-plex-mono`, applied via `.font-mono`. **Latin/numeric only — no Thai glyphs on Google Fonts.** Never apply to a string containing Thai text; it silently falls back to a system font and breaks mid-line. Reserved for spec-sheet flavor: product codes, measurements, tags. Not yet wired up anywhere live — the only described use cases (product codes, spec tags, "IN STOCK" badges) live on the pre-redesign product detail page (`app/(th)/categories/[slug]/[productSlug]/page.tsx`), which hasn't been migrated to this design system yet.

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
- **Radius**: `rounded` (4px) for buttons and inputs; `rounded-lg` (8px) for HomeHero image and general tiles; `rounded-xl` (12px) for CategorySection and PortfolioGrid image tiles (deliberately softer, hover-lift cards); `rounded-none` (0) for full-bleed panels. **`rounded-full` is banned** except for two signature elements: PortfolioGrid tile arrow button and FaqSection Plus icon.
- **Shadow**: single utility, `--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08)`. No multi-layer elevation, no soft-wide drop shadows. CategorySection/PortfolioGrid tiles reveal this shadow + a 6px lift on hover — still the one shadow value, just conditional.

## Sections (homepage rhythm)

All white with thin rule dividers except PromoGrid (`mist`) and ContactSection (`dark`).

1. **HomeHero** — white. Giant "168 INNOVATIVE" is a full-bleed ambient watermark (`whitespace-nowrap`, one line, `clamp(3.5rem,2rem+10vw,10rem)`, 14–16% opacity, vertically centered on the *section*, not the image) sitting behind both grid columns — deliberately decoupled from the product image's box. (Earlier version sized/positioned the text tightly behind just the image; that coupling broke repeatedly across breakpoints — image/text height mismatches, the image swallowing the text, etc. Making it a low-opacity full-width watermark means it can never visually compete with foreground content again, at any breakpoint.) Image is a plain `aspect-3/2 object-contain` box, no overlay tricks. Copy (headline, description, CTAs) stacks below on mobile / sits to the right at `lg`+. `leaf` glass CTA + outlined glass CTA.
2. **CategorySection** — white with a top rule, 8 category tiles (`rounded-xl`, hover lift + shadow) on `mint` fills, 2-col mobile / 4-col sm+.
3. **PortfolioGrid** — white, 2-col mobile / 3-col sm+. Square `rounded-xl` tiles with an 8% `leaf` multiply wash over each product photo to unify mixed studio backgrounds; wash fades on hover, tile lifts with `--shadow-sm`. Signature 32px (mobile) / 36px (sm+) round arrow anchored bottom-right, frosted-glass style (`.tile-arrow-glass`) so it doesn't fight the varied/often-muted product photo colors.
4. **PromoGrid** — `mist` background (off-white, breaks up the white-on-white run above/below), "Why work with 168" list, 1-col mobile / 2-col sm / 4-col lg (single row). Icon palette is the one deliberate multi-color exception: green (brand/value) → blue (quality/trust) → plum (OEM/custom) → amber (sourcing/speed), each as a pale tint bg + darker icon, same formula as `mint`/`mintInk` just with a different hue per tile.
5. **FaqSection** — white with a top rule, sticky heading on lg+, `<details>` accordion with a `leaf`-filled round Plus icon that rotates 45° on open.
6. **ContactSection** — `dark` background, LINE OA card, and the contact form.

## Motion

- Transitions: `ease-out` curves at 200-600ms. Nothing spring / bounce.
- Hover reveals (PortfolioGrid wash fade, arrow slide, tile scale) all key on `.group:hover`.
- Scroll entrance: CategorySection/PortfolioGrid share `portfolio-reveal` (rise + scale-in, IntersectionObserver-triggered, staggered). PromoGrid uses a distinct `icon-pop-reveal` (scale from 0.82) since icons aren't photo tiles. ContactSection's form card gets a single (non-staggered) `hero-reveal`. Each section's reveal is chosen to fit what it reveals — not one identical fade copy-pasted everywhere.
- HomeHero has a `framer-motion` scroll-linked parallax (the only scroll-linked, as opposed to IntersectionObserver-triggered, motion on the page): the giant "168 INNOVATIVE" display type drifts down while the product image drifts up + scales in slightly, as the hero scrolls past. Driven by `useScroll`/`useTransform` against the section ref; wrapped with `useReducedMotion()` to zero out the transforms when reduced motion is preferred. This is the site's one deliberate "wow" scroll moment — concentrated on first-view, not spread thin.
- The `prefers-reduced-motion: reduce` media query in `globals.css` already disables the marquee, floating utilities, and all `[class*="animate-[..."]` reveal families. Preserve this when adding new animations — every reveal needs a static fallback.
