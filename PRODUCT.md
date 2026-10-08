# Product

## Typography requirement (October 8, 2026 — current)

The user requested a detailed system-wide font/size review and explicitly rejected unusual fonts. Use Anuphan as the single Thai/Latin family throughout the authored UI. Secondary text and compact controls are 16px; body and specs 18px; card names 20px; subheadings 24px; headings use the shared fluid scale. Numeric alignment uses tabular figures in Anuphan, not a separate Mono family. This supersedes earlier typography references below. Browser visual review remains unverified; the source/build/HTTP audit is in `docs/typography-audit.md`.

## Site-wide identity (current, October 2026)

The user requested a whole-site redesign based on the logo. Navy `#263859` is now the shared primary/action color; white, clear gray and subtle blue/aqua are supporting surfaces. This supersedes earlier green/violet accent guidance. Anuphan is the single Thai/Latin body and heading family site-wide, with IBM Plex Mono retained only for numeric/spec uses. Shared designSystem and HOME tokens now match; old warm multicolor backgrounds and wide glass shadows are removed from these tokens.

Public category pages use larger four-column desktop image grids and quieter category information. Product listings gain a consistent search toolbar; detail pages use neutral photo panels and navy quote actions. Article lists use one featured composition plus open preview rows; article details use a full-width title and compact metadata strip. Contact, breadcrumbs, navigation and footer use the same surfaces and colors. Existing responsive behavior, content APIs, links, schema and localized paths are retained. Each public route has one outer main landmark.

Validation: TypeScript and application ESLint passed; 16 representative Thai/English routes returned 200 with Anuphan, viewport metadata, one main and headings. Visual browser and real-device QA are still unverified because there is no connected browser surface in this session.

## Current palette refinement

User approved reducing violet: white and clear gray dominate, aqua is the secondary surface color, and Studio/contact use blue-charcoal. Violet remains for primary actions, active navigation and small interactive details. This supersedes the larger lavender/plum surfaces described in earlier iterations. Glass treatments and interactions remain.

## Current homepage direction (user update, September 2026)

The user explicitly requested a modern, colorful homepage and expressed a preference for glassmorphism. This supersedes the historical homepage restrictions on multi-color palettes and glass panels below. Use lavender, aqua and peach lighting, frosted surfaces, dark readable text, and Anuphan typography. Existing non-homepage identity remains unchanged.

## Register

brand

## Users

Thai-based cosmetic brand founders, marketing managers, and procurement teams sourcing OEM/ODM packaging (bottles, caps, tubes, jars, mascara wands, ampoules). They arrive from Google search or LINE OA outreach and evaluate supplier fit on catalog range, MOQ, response speed, and willingness to customize. English-speaking small brand founders also browse for stock-ready parts. Decision context: comparing 168 to other Thai packaging OEMs, often in parallel tabs.

## Product Purpose

Public marketing site for 168 INNOVATIVE. Showcases the packaging catalog, communicates OEM/ODM capability, and drives leads into the sales team via LINE OA and the contact form. Success = qualified inquiries from brand teams choosing 168 as their packaging partner.

## Brand Personality

Fresh, reliable, approachable.

- **Fresh** — ECO SYSTEM–inspired leaf green with a white-dominant editorial layout, deliberately away from the exhausted forest-deep or navy-corporate B2B trope.
- **Reliable** — factory-direct copy is plain-spoken about MOQ, lead time, and process. No spec-shouting, no jargon walls.
- **Approachable** — Thai first, English second; LINE OA prominently offered; the 24-hour reply promise stated explicitly.

## Anti-references

- **Multi-pastel splash** (peach + sky + butter + cream layered on the same page). Tried and rejected — reads as juice-bar, not premium packaging.
- **Forest-deep monotone** (`#14532d`) as the only green. Tried and rejected — read as heavy and dated.
- **Cream / warm off-white body bgs** bleeding into the peach band. Tried and rejected — the whole page tipped toward yellow-orange.
- **Glassmorphism panels, gradient text, side-tab colored borders, Ken Burns on hero, sliding language toggle.** AI-slop patterns Impeccable already flagged; do not reintroduce.
- **Dense B2B spec sheets with jargon walls** (Alibaba / thomas-net template). This is a brand register, not a catalog spreadsheet.
- **Numbered scaffolding on every section** (01 / 02 / 03) and tracked-uppercase eyebrows above every heading — reflex scaffolding, not designed hierarchy.

## Design Principles

1. **Show packaging, not chrome.** The tile-frame colour should defer to the product photo. Hero and grid images carry the site's identity; UI is the passive frame.
2. **Sparse leaf, not painted leaf.** Green as accent (buttons, small round CTAs, single highlighted word), never as a full section wash. White dominates; sections separate with thin rules.
3. **Editorial rhythm over decorative rhythm.** Thin horizontal rules and negative space separate sections. No coloured bands stacked back-to-back, no repeating card grids for their own sake.
4. **Thai typography first-class.** All headings and body sized with clamps that pass through IBM Plex Sans Thai's break points; never tighten letter-spacing past `-0.02em` on display; use `text-wrap: balance` on `h1`/`h2` for Thai line balance.
5. **Two greens working together.** Bright leaf `#7cb342` for solid CTAs and highlights; deep leaf `#4a7a1e` for text-on-white and hover states. Anything darker collapses back to forest-deep, which the brand rejected.

## Accessibility & Inclusion

Minimum baseline — no formal WCAG target set. User has prioritized visual polish over compliance rigor. Impeccable should not gate designs on strict contrast rules, but should still flag genuinely broken cases (body text below ~3:1 on its background, hidden focus rings, motion that ignores `prefers-reduced-motion`). The `prefers-reduced-motion` alternative is already respected in `app/globals.css`; keep it in place when adding new animations.

## Product shortlist and comparison

Product cards on the homepage and catalog, and individual product pages, have a quiet Save to compare action. A navy bottom-left dock appears only after saving. The native modal supports selecting 2-3 products, comparing the union of catalogue specifications, removing products, copying the full shortlist with canonical localized URLs, and opening an enquiry email draft. No message is sent automatically. Missing spec values remain explicit. Storage is browser-local (up to 20 items), with cross-tab updates and an in-memory fallback; saved labels/specs are snapshots from the language used when saving. Mobile uses a compact dock and horizontally scrollable table. Typography uses existing tokens; menu background inert handling includes the dock.

Validation: TypeScript, application ESLint and three model tests passed. Six Thai/English homepage, catalogue and product-detail routes returned HTTP 200 and included both controls. Interactive browser, clipboard, persistence and visual device checks remain unverified because no browser surface is connected.
