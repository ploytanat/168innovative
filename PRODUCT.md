# Product

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
