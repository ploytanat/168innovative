# Responsive implementation and verification

Scope: public website, Thai and English. Homepage, category listing, product listing/detail, articles, about, contact, navigation and footer.

## Changes

- Mobile navigation scrolls within the dynamic viewport, including landscape. Collapsed menus are hidden/inert. Escape restores focus; Tab stays within the open navigation. Background scrolling/interactions are suspended, and restored when the menu closes or desktop navigation takes over.
- Header logo/controls fit narrow 320px layouts. Touch controls use 44px targets; product-search input uses 16px type to avoid automatic iOS zoom.
- Removed the product gallery's six-column span from a two-column parent. The zoom control is visible on touch. A native modal dialog manages focus and Escape, with safe-area and dynamic-height sizing.
- Homepage hero and contact content stack through tablet widths. Mobile CTAs stretch; floating contact controls form a compact horizontal pair with safe-area spacing.
- Grid/flex content can shrink and long titles, emails and breadcrumbs can wrap. Thai product specifications stack on small screens.
- Rich-text tables/code scroll within the content area; embedded media scales to the column. Maps are shorter on mobile. Footer leaves room for floating controls.
- Reduced motion applies site-wide; hover transforms are suppressed on touch.

## Completed checks

- `npx tsc --noEmit`: passed.
- `npm run lint`: 0 errors; 136 warnings in existing skill/tool scripts. Changed components checked separately.
- `git diff --check`: passed.
- HTTP smoke checks: 16 routes returned 200 with viewport metadata and shared navigation: `/`, `/about`, `/contact`, `/categories`, `/categories/spout`, `/categories/spout/spout-sm60`, `/articles`, `/articles/mascara-packaging-oem`, and their `/en` equivalents.
- During smoke checks, a generated `.next/dev/prerender-manifest.json` contained trailing data. Repaired the generated JSON and reran all 16 route checks successfully.

## Visual/device verification still required

No browser or native-app surfaces were connected in this session (`apps: [], browsers: []`). HTTP checks do not verify rendered dimensions, touch behavior, or visual quality. Do not treat this as completed device testing.

Recommended review sizes: 320, 360, 390, 430, 768, 820, 1024, 1280, 1440 and 1920px, plus mobile landscape. Verify no horizontal overflow, full Thai tone marks, 200% zoom, long product names, open mobile category menu, search/clear/sort/pagination, zoom dialog close/focus, FAQ, long article tables, and fixed controls near safe areas. Review Safari/iOS and Chrome/Android on real devices when available.
