# Design

## Curated Facebook updates (October 8, 2026)

The homepage has an Updates from 168 section below products. Native WordPress Posts in separate Thai/English categories supply up to three image-led cards, using the shared Anuphan scale, navy links and a pale blue section. Empty/error states show the existing company Facebook page link. This is editorial selection, not automatic Facebook synchronization. Server-side requests are cached for 60 seconds, time-limited and streamed separately; no Facebook SDK or iframe loads. Setup and content-entry instructions: `docs/facebook-updates.md`.

## System typography audit (October 8, 2026 — current)

Anuphan is now the only loaded family, including numeric/spec text; IBM Plex Mono has been removed. The shared scale is 16px secondary text/compact controls, 18px body/form values/specifications, 20px card names including mobile, 24px subheadings, 28–34px section headings and 36–48px page headings (rem-based). Catalogue-only scale overrides are removed. CMS typography inherits the same family and semantic heading/body sizes. The custom not-found view now uses the shared scale and no longer locks body scrolling. See `docs/typography-audit.md` for scope, checks and remaining browser-verification limits. This supersedes the historical 14px metadata/16px body and Mono guidance below.

## Packaging brief colours (October 8, 2026)

The packaging brief section now uses a pale blue background, white form fields, a stronger blue photo panel and navy text/actions. This replaces the previous dark teal gradient. Selected radio options use a navy border and pale blue fill; form placeholders, supporting text and keyboard focus indicators are adjusted for the light surfaces. Both locales share these styles.

## Catalog density and navigation (October 8, 2026)

Follow-up: category and product detail pages use an enlarged scoped type scale: body/spec text 18px, secondary controls 16px, product card names 20px (including mobile), specification values/subheadings 24px, and page/model titles 36–48px.

Category introductions use tighter spacing and product cards show up to two actual catalogue specifications. Product descriptions start expanded; detail summaries include a specifications heading and concise quotation/sample enquiry guidance. Navy, Anuphan, product photography and existing comparison controls remain the shared identity.

Both languages reuse the full category dataset for pagination/search instead of fetching the page separately, omit detail-only content from client listing props, fetch related products concurrently, enable default product-link prefetch and provide category/detail loading boundaries. Related products exclude the current slug as well as its ID. TypeScript and scoped ESLint passed; all four Spout category/detail routes returned 200 with one h1 and expected content. Browser visual and interaction checks remain unavailable because no browser surface is connected; local HTTP timings are not a production performance benchmark.

## Content reduction (current)

Removed redundant hero signature, image heading/caption and floating slogan badge; shortened the hero introduction. Category/product/benefit/FAQ section descriptions that merely repeated their headings are removed. Shared PageIntro and RichTextSection no longer render decorative eyebrow labels. Category listing cards retain photos and names; article previews retain titles/dates while the featured article retains its excerpt. Packaging Studio now starts collapsed in a native details disclosure, with its form, preview, brief and actions intact. Removed its redundant selection/helpfulness labels. Product specifications, accessibility labels, contact information and functional FAQ answers are preserved.

TypeScript and application ESLint pass. Eight affected Thai/English routes return 200; HTML verifies the Studio starts collapsed and decorative hero labels are absent. Visual/browser interaction QA remains unverified.

## Typography consolidation (current)

`app/typography.css` is the single public-site type scale. Anuphan covers Thai and Latin; mono is reserved for explicit numeric/code content. Sizes: metadata 0.875rem (14px), body/controls 1rem (16px), card titles 1.125rem (18px; 16px on small cards below 640px), subheadings 1.25rem (20px), section headings 26-32px fluid, page/hero headings 32-44px fluid. Body line height is 1.8; headings 1.45; article body 1.85. Headings use 600, controls 500, body 400. No Thai letter-spacing compression.

Legacy font-size/weight/line-height/tracking declarations were removed from globals.css and public JSX utility classes; role selectors and the `type-meta` class now control repeated content. Product names, category names, navigation, buttons, FAQs, contact information and footer text share consistent roles. Limited important rules normalize CMS inline typography within rich content only. Layout, backgrounds and imagery are preserved during this typography pass.

Verification: 16 Thai/English route smoke checks passed; compiled CSS contains the new type tokens. Browser rendering, Thai wrapping at 200% zoom and real-device visual review remain unverified because no browser surface is connected.

## Site-wide identity (current, October 2026)

The user requested a whole-site redesign based on the logo. Navy `#263859` is now the shared primary/action color; white, clear gray and subtle blue/aqua are supporting surfaces. This supersedes earlier green/violet accent guidance. Anuphan is the single Thai/Latin body and heading family site-wide, with IBM Plex Mono retained only for numeric/spec uses. Shared designSystem and HOME tokens now match; old warm multicolor backgrounds and wide glass shadows are removed from these tokens.

Public category pages use larger four-column desktop image grids and quieter category information. Product listings gain a consistent search toolbar; detail pages use neutral photo panels and navy quote actions. Article lists use one featured composition plus open preview rows; article details use a full-width title and compact metadata strip. Contact, breadcrumbs, navigation and footer use the same surfaces and colors. Existing responsive behavior, content APIs, links, schema and localized paths are retained. Each public route has one outer main landmark.

Validation: TypeScript and application ESLint passed; 16 representative Thai/English routes returned 200 with Anuphan, viewport metadata, one main and headings. Visual browser and real-device QA are still unverified because there is no connected browser surface in this session.

## About page refresh

Both About routes use `AboutOverview`: concise localized positioning, large existing CMS photography, three short service descriptions, an expandable original company description, and real company identity/address/phone/email from the company API. Anuphan matches the homepage. White/aqua surfaces replace the former long hero and generic benefit grid. No founding year, certification, customer count or factory ownership claim is added. Existing SEO metadata and organization schema remain. Responsive layouts collapse at 767px. TypeScript, scoped ESLint and HTTP checks for both routes passed; a single main/h1, expandable story and contact links were verified in HTML. Visual browser verification remains unavailable in this session.

## Current palette refinement

User approved reducing violet: white and clear gray dominate, aqua is the secondary surface color, and Studio/contact use blue-charcoal. Violet remains for primary actions, active navigation and small interactive details. This supersedes the larger lavender/plum surfaces described in earlier iterations. Glass treatments and interactions remain.

## Packaging Studio (October 2026)

A functional, bilingual packaging brief builder sits between categories and the product gallery. It uses live category names/images, project-type radio controls, optional positive numeric quantity, and a read-only brief that users can copy or open in their own email application. Clipboard failure exposes manual selection instructions. No enquiry is automatically submitted; MOQ, pricing and lead time are explicitly subject to team confirmation. A hero anchor provides discovery. A plum/teal workspace, light product stage, and a short selection transition provide visual distinction; mobile stacks controls, preview and brief. Reduced motion disables the transition. Product cards expose up to two available CMS specifications.

Validation: TypeScript and scoped ESLint pass. Both home routes return 200 with eight live category options, studio entry links and correctly encoded four-line email briefs. Interactive/browser verification remains pending because no browser surface is connected.

## Navigation and category refinement (October 2026)

Category frames now use one translucent white surface with thin inset spacing; the four rotating pastel fills are removed. Violet remains on arrows and hover. Shared navigation retains the familiar logo-left, labeled-menu, quote-right structure, with a frosted white header, active-item pill, violet quote action, and category thumbnails in the desktop dropdown. Mobile navigation retains its scrollable accordion and localized menu control. Outside-click dismissal and Escape focus restoration are supported for the product dropdown.

## Color studio revision (current)

All homepage sections now share the color studio direction: frosted product tiles on a blue/lilac gallery; a mint/lilac service section with an asymmetric introduction and a two-column benefits layout; native details-based FAQ panels on a light lilac surface; a plum/teal contact section with a translucent contact panel; and a light colored footer scoped to `/` and `/en`. Telephone, email, social, localized contact links, QR imagery, and native keyboard-operable FAQ behavior are retained. Lower-section styles have mobile layouts, opaque backdrop-filter fallbacks, visible focus, and reduced-motion support.

The user requested unrestricted color and glassmorphism after the showroom refresh. This revision takes precedence over the historical notes below. The homepage now combines lavender, aqua and apricot light behind frosted product, service and action surfaces. The homepage navigation uses translucent white and a violet CTA; other routes retain their navigation treatment. Category surfaces rotate lilac, mint, peach and blue. Anuphan and the existing responsive grid remain. Glass surfaces use white edge highlights, dark copy, CSS backdrop blur, and opaque fallbacks. Reduced motion disables hover movement. Product imagery remains CMS-driven, with a multiply blend in the hero to integrate its white studio background.

## Homepage refresh ? September 2026

The current homepage refresh supersedes the homepage-specific descriptions below.

- Direction: a packaging showroom for founders comparing products on desktop and mobile. White surfaces, charcoal copy, leaf-green actions, and a pale green-neutral category surface (`#f5f7f3`). Product photography stays in its original colors.
- Both `/` and `/en` use a scoped Anuphan family (400?700), with a 32?50px hero and comfortable Thai line height. Other routes retain their existing typography.
- Hero: copy left, larger original CMS product photograph right; stacked copy then image on mobile. The old watermark, parallax, and glass buttons are removed. Localized headline and introduction are now curated in `HomeHero.tsx`; the image remains CMS-driven. Catalog and consultation links point to their matching localized routes.
- A compact service strip follows the hero: OEM/ODM, nationwide delivery, and response time. These reuse existing service statements.
- Categories: left-aligned introduction and view-all link, 4 columns desktop, 3 tablet, 2 mobile. Natural-color photographs, restrained image zoom, and visible title/arrow links.
- Product photos no longer receive a green overlay or desaturation; arrows use solid white. Existing FAQ and contact flows remain.
- Styles are scoped under `.home-showroom` or `.showroom-*` in `app/globals.css`. Reduced motion and visible keyboard focus are included.


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

1. **HomeHero** — white. Product shot (`aspect-3/2`, inset `p-[7%]`) on the left, copy (headline, description, CTAs) stacking below on mobile / sitting to the right at `lg`+. `leaf` glass CTA + outlined glass CTA. A "168 INNOVATIVE" wordmark sits behind the photo, strictly confined to the image column (`overflow-hidden` on that column only) so it can never reach the copy column's text on any breakpoint — this followed several earlier rounds (text sized to the image's box → full-section watermark, both of which eventually muddied adjacent copy) that landed on column-confinement as the fix. Sized in container-query width units (`cqw`, relative to the column via `@container`, not the viewport) so the one-line text reliably sits just past the photo's inset content box and peeks out in the `p-[7%]` margin on both sides — centering the text without this would just hide it dead behind the opaque photo, since the shot has no transparent margin of its own. If this treatment changes again, keep it column-confined and keep verifying it actually renders (measure text width against the photo's content-box width) rather than trusting opacity/z-index alone.
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

## Product shortlist and comparison

Product cards on the homepage and catalog, and individual product pages, have a quiet Save to compare action. A navy bottom-left dock appears only after saving. The native modal supports selecting 2-3 products, comparing the union of catalogue specifications, removing products, copying the full shortlist with canonical localized URLs, and opening an enquiry email draft. No message is sent automatically. Missing spec values remain explicit. Storage is browser-local (up to 20 items), with cross-tab updates and an in-memory fallback; saved labels/specs are snapshots from the language used when saving. Mobile uses a compact dock and horizontally scrollable table. Typography uses existing tokens; menu background inert handling includes the dock.

Validation: TypeScript, application ESLint and three model tests passed. Six Thai/English homepage, catalogue and product-detail routes returned HTTP 200 and included both controls. Interactive browser, clipboard, persistence and visual device checks remain unverified because no browser surface is connected.


## Shortlist visual polish

Saved rows and comparison headers include product photography. Selected rows use a quiet blue surface; saved buttons turn navy while unsaved actions remain unboxed. Floating dock and native dialog use restrained glass surfaces, with reduced motion/transparency alternatives. Responsive thumbnail sizing retains readable names and touch controls. TypeScript, component lint and three route HTTP/encoding checks passed; visual browser QA remains unavailable.


## Shortlist interaction feedback

Save confirmation icon and dock count use brief state-driven motion. Three preview slots show comparison selection; a differences-only filter helps scan the comparison. Reduced-motion settings disable all new animations. TypeScript, product-component ESLint and three HTTP routes pass; interactive browser QA remains unverified.


## Product detail density

Thai and English product detail layouts now prioritize a larger single image surface, top-aligned summary, tighter specifications, grouped quotation/save actions and compact service labels. Removed the ornamental slug strip; reduced related-product spacing. Desktop image surface stays sticky, with single-column tablet/mobile layouts. TypeScript, route lint and both detail HTTP/encoding checks passed. Browser visual QA remains unverified.


## Reading-first product details

Shared bilingual ProductSummary presents a restrained title, semantic left-aligned specification list and grouped enquiry/save controls. Verbose product description and buying guidance are native disclosures. Removed generic trust badges from the reading flow. Both detail routes, TypeScript and scoped lint pass; visual browser QA remains unverified.


## Product showroom composition

Supersedes prior detail density tweaks: split desktop layout uses a full product image, model-led heading with complete product name, prominent material/diameter facts from actual catalogue fields, and localized application text. One aqua enquiry area contains the navy primary action and save control. Mobile explicitly orders identity, image, facts, enquiry. Repetitive generated buying-guide copy is removed; the original description stays available in a disclosure. Consolidated obsolete detail CSS. TypeScript, scoped lint and Thai/English detail HTTP checks pass. No browser is connected, so visual and interaction QA are not claimed.


## Navigation redesign

Replaced segmented desktop navigation with open links and active underlines, balanced logo sizing, compact language switch and navy quotation action. Click-operated catalogue panel has an introductory link and full image-backed category list in a three-column grid. Mobile uses a separate accordion with all categories and full-width quote action. Desktop breakpoint is 1200px. Preserved scroll lock, inert background and mobile focus wrapping; Escape closes panels, outside clicks dismiss desktop categories, and ArrowDown opens/focuses the catalogue. Language changes retain query/hash. TypeScript, scoped ESLint and five route structure/UTF-8 checks pass. No connected browser; visual, keyboard and touch interaction checks remain unverified.
