# Typography audit — 8 October 2026

## Scope

Reviewed the public application source: both locale layouts, font loading, shared typography and global CSS, navigation, footer, homepage sections, packaging brief, about/contact pages, category/product pages, image-dialog controls, shortlist/comparison, article lists/details/CMS blocks, pagination, loading states, and the custom not-found component. There is no separate admin UI under `app` in this workspace.

## Findings and changes

| Finding | Resolution |
| --- | --- |
| Catalogue pages had their own enlarged scale while the rest of the site retained smaller type. | One root scale now governs all public pages; removed the catalogue-only token overrides. |
| Secondary text and controls were often 14px. | Metadata, secondary text, navigation and compact actions now use 1rem (16px at default settings). |
| Mobile card headings were reduced to body size. | Card names stay 1.25rem (20px), with wrapping rather than a smaller mobile type size. |
| A second IBM Plex Mono font was downloaded despite no active need for it. | Only Anuphan loads, with Thai/Latin coverage and weights 400/500/600/700. Numeric alignment uses tabular figures. |
| Form values could inherit inconsistent weights. | Input/select/textarea values use regular weight; labels/actions use medium; headings use semibold. |
| CMS spans could introduce foreign fonts or shrink text inside headings. | CMS font families are normalized to Anuphan; inline size spans inherit their enclosing text role; styled headings retain the heading scale. |
| Product typography declarations were split between two stylesheets. | Removed literal product font sizes from globals.css; typography.css owns text sizing. |
| Custom 404 had roughly 11px branding, small body copy, unloaded weight 300, huge decorative numbers and globally hidden body overflow. | Replaced with a simple localized, scrollable view using the shared scale, readable contrast and ordinary navigation actions. |
| Muted text/captions were too pale for comfortable reading on light surfaces. | Shared muted text and rich-content captions use #526176. |

## Final scale

All sizes use rem; pixel equivalents assume the browser's default 16px root. Browser zoom is not disabled.

| Role | Size | Line height / weight |
| --- | --- | --- |
| Metadata, footer, breadcrumbs, compact controls | 16px | 1.6–1.75 / 400–500 |
| Body, descriptions, form values, product specifications | 18px | 1.6 for inputs; 1.8 for body; 1.85 for articles / 400 |
| Product/category card names | 20px, including mobile | 1.65 / 600 |
| Subheadings and prominent spec values | 24px | 1.5 / 600 |
| Section headings | 28–34px fluid | 1.45 / 600 |
| Page and product-model headings | 36–48px fluid | 1.45 / 600 |
| Decorative 404 number | 64–96px fluid | 1.2 / 600 |

Long prose is limited to 70ch; card names and footer contact text can wrap. Navigation keeps a compact 16px scale instead of inheriting the larger body size. Tables and specification values use tabular numerals with the same font family.

## Verification

- Application TypeScript and application-wide ESLint passed.
- Production build passed and generated 239 static pages.
- Sixteen representative live routes returned HTTP 200 with one h1, one main, correct `lang`, Anuphan body class and a zoom-enabled viewport: Thai/English home, about, category index, Spout category, SM55-A detail, article index, mascara OEM article and contact.
- Compiled styles contain the 16/18/20px tokens and Anuphan; IBM Plex Mono is absent.
- All four distinct emitted WOFF2 assets returned HTTP 200 (35,096; 18,952; 23,736; 8,560 bytes).
- The localized custom not-found component uses the same stylesheet. Unmatched top-level URLs still use Next.js's built-in fallback; category-level not-found responses are streamed, so an HTTP/source check alone does not establish their final visible layout.

## Limits

No connected browser surface was available. This is a source, build, HTTP and compiled-asset audit, not a visual sign-off. Actual wrapping/clipping at 320/375/768/1440px, Thai vowel/tone placement, native select rendering, open navigation/dialog states and 200% zoom still require browser review. No production speed or visual-accessibility score is claimed.
