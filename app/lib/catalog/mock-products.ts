// ---------------------------------------------------------------------------
// Lipgloss Tube Catalog — sourced from 168Innovative product catalog PDF
// Images: replace /placeholder.jpg with actual product images when available
// ---------------------------------------------------------------------------

export type CatalogProduct = {
  sku: string
  /** SEO-friendly URL slug, e.g. "slim-round-lipgloss-tube-3ml" */
  slug: string
  name: string
  category: string
  /** Full SEO description used in <meta description> and product detail page */
  description: string
  specs: Record<string, string>
  images: string[]
  /** Search / SEO keywords */
  tags: string[]
}

export type CatalogProductFamily = {
  key: string
  label: string
  /** Which spec keys drive the variant selector buttons */
  optionKeys: string[]
  skus: string[]
}

export type CatalogProductFamilyWithProducts = CatalogProductFamily & {
  products: CatalogProduct[]
}

export type ProductDisplayGroup =
  | { type: 'standalone'; product: CatalogProduct }
  | { type: 'family'; family: CatalogProductFamilyWithProducts }

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const catalogProducts: CatalogProduct[] = [
  // ── Family: Slim Round (Ø13.6mm) ─────────────────────────────────────────
  {
    sku: 'LGT-101',
    slug: 'slim-round-lipgloss-tube-3ml',
    name: 'Slim Round Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Crystal-clear slim round lipgloss tube with 13.6 mm diameter and 119 mm height. Capacity 3 ml. Made from high-clarity AS resin. Suitable for lip gloss, lip serum, and cosmetic liquid filling. OEM/ODM manufacturing available with custom logo printing.',
    specs: {
      shape: 'round',
      capacity_ml: '3',
      width_mm: '13.6',
      height_mm: '119',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'slim tube', 'clear round tube', '3ml lipgloss',
      'cosmetic packaging', 'lip gloss packaging', 'OEM lipgloss tube',
    ],
  },
  {
    sku: 'LGT-102',
    slug: 'slim-round-lipgloss-tube-2-4ml',
    name: 'Slim Round Lipgloss Tube 2.4ml',
    category: 'Lip Gloss Tubes',
    description:
      'Crystal-clear slim round lipgloss tube with 13.6 mm diameter and 132.4 mm height. Compact 2.4 ml capacity in a tall, elegant profile. AS resin construction with high clarity. Ideal for premium lip gloss and serum packaging with OEM/ODM options.',
    specs: {
      shape: 'round',
      capacity_ml: '2.4',
      width_mm: '13.6',
      height_mm: '132.4',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'slim tube', 'tall lipgloss tube', '2.4ml lipgloss',
      'cosmetic packaging', 'lip gloss packaging',
    ],
  },

  // ── Family: Standard Round (Ø17mm) ───────────────────────────────────────
  {
    sku: 'LGT-201',
    slug: 'standard-round-lipgloss-tube-3ml',
    name: 'Standard Round Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Standard clear round lipgloss tube, 17 mm diameter × 103 mm height, 3 ml capacity. Versatile design suitable for a wide range of lip gloss formulations. High-clarity AS resin with screw cap. Popular choice for B2B cosmetic packaging with full OEM/ODM support.',
    specs: {
      shape: 'round',
      capacity_ml: '3',
      width_mm: '17',
      height_mm: '103',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'standard round tube', '3ml lipgloss', '17mm tube',
      'cosmetic packaging', 'lip gloss packaging', 'OEM lipgloss',
    ],
  },
  {
    sku: 'LGT-202',
    slug: 'standard-round-lipgloss-tube-4ml',
    name: 'Standard Round Lipgloss Tube 4ml',
    category: 'Lip Gloss Tubes',
    description:
      'Standard clear round lipgloss tube, 17 mm diameter × 103 mm height, 4 ml capacity. Same classic profile as the 3 ml variant with increased fill volume. High-clarity AS resin. Ideal for full-size retail lip gloss products with OEM branding.',
    specs: {
      shape: 'round',
      capacity_ml: '4',
      width_mm: '17',
      height_mm: '103',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'standard round tube', '4ml lipgloss', '17mm tube',
      'cosmetic packaging', 'lip gloss packaging',
    ],
  },
  {
    sku: 'LGT-203',
    slug: 'standard-round-lipgloss-tube-5ml',
    name: 'Standard Round Lipgloss Tube 5ml',
    category: 'Lip Gloss Tubes',
    description:
      'Standard clear round lipgloss tube, 17 mm diameter × 117.5 mm height, 5 ml capacity. Taller profile accommodates larger fill volume while retaining a slender, premium look. AS resin with high optical clarity. Supports full OEM/ODM customisation.',
    specs: {
      shape: 'round',
      capacity_ml: '5',
      width_mm: '17',
      height_mm: '117.5',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'standard round tube', '5ml lipgloss', '17mm tube',
      'cosmetic packaging', 'lip gloss packaging',
    ],
  },

  // ── Family: Mid-Wide Round (Ø18.9mm) ─────────────────────────────────────
  {
    sku: 'LGT-301',
    slug: 'mid-wide-round-lipgloss-tube-2ml',
    name: 'Mid-Wide Round Lipgloss Tube 2ml',
    category: 'Lip Gloss Tubes',
    description:
      'Clear round lipgloss tube with 18.9 mm diameter and 66.9 mm compact height. 2 ml capacity in a travel-friendly size. High-clarity PETG construction. Suitable for lip gloss, nail serum, and specialty cosmetic liquids. OEM/ODM with logo engraving available.',
    specs: {
      shape: 'round',
      capacity_ml: '2',
      width_mm: '18.9',
      height_mm: '66.9',
      material: 'PETG',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'compact lipgloss tube', '2ml lipgloss', 'travel size',
      'cosmetic packaging', 'PETG tube',
    ],
  },
  {
    sku: 'LGT-302',
    slug: 'mid-wide-round-lipgloss-tube-2-5ml',
    name: 'Mid-Wide Round Lipgloss Tube 2.5ml',
    category: 'Lip Gloss Tubes',
    description:
      'Clear round lipgloss tube, 18.9 mm diameter × 75.3 mm height, 2.5 ml capacity. Balanced proportions make it ideal for both retail and promotional cosmetic sets. PETG material with superior clarity and chemical resistance. Supports OEM/ODM packaging.',
    specs: {
      shape: 'round',
      capacity_ml: '2.5',
      width_mm: '18.9',
      height_mm: '75.3',
      material: 'PETG',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', '2.5ml lipgloss', 'round lipgloss tube',
      'cosmetic packaging', 'PETG tube', 'OEM cosmetic tube',
    ],
  },
  {
    sku: 'LGT-303',
    slug: 'mid-wide-round-lipgloss-tube-3ml',
    name: 'Mid-Wide Round Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Clear round lipgloss tube, 18.9 mm diameter × 84.7 mm height, 3 ml capacity. The largest in the mid-wide series — generous capacity with a comfortable grip diameter. PETG construction, optically clear. Full OEM/ODM customisation including cap colour and logo printing.',
    specs: {
      shape: 'round',
      capacity_ml: '3',
      width_mm: '18.9',
      height_mm: '84.7',
      material: 'PETG',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', '3ml lipgloss', 'round lipgloss tube',
      'cosmetic packaging', 'PETG tube',
    ],
  },

  // ── Family: Colored Round (Ø19–20mm) ─────────────────────────────────────
  {
    sku: 'LGT-401',
    slug: 'colored-round-lipgloss-tube-4-6ml',
    name: 'Colored Round Lipgloss Tube 4.6ml',
    category: 'Lip Gloss Tubes',
    description:
      'Elegant round lipgloss tube with metallic silver finish, 19 mm diameter × 119.4 mm height, 4.6 ml capacity. Anodised metallic cap adds premium shelf appeal. AS resin body with custom colour options available. Preferred by mid-to-high-end cosmetic brands for OEM lip gloss lines.',
    specs: {
      shape: 'round',
      capacity_ml: '4.6',
      width_mm: '19',
      height_mm: '119.4',
      material: 'AS Resin',
      finish: 'metallic',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'metallic lipgloss tube', '4.6ml lipgloss', 'silver tube',
      'premium cosmetic packaging', 'OEM lip gloss packaging',
    ],
  },
  {
    sku: 'LGT-402',
    slug: 'colored-round-lipgloss-tube-5-3ml',
    name: 'Colored Round Lipgloss Tube 5.3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Vibrant colored round lipgloss tube, 19.3 mm diameter × 119.4 mm height, 5.3 ml capacity. Available in a range of brand colours (teal, pink, coral, etc.) to match cosmetic collections. AS resin body with matching or contrasting wand cap. OEM/ODM with Pantone colour matching.',
    specs: {
      shape: 'round',
      capacity_ml: '5.3',
      width_mm: '19.3',
      height_mm: '119.4',
      material: 'AS Resin',
      finish: 'colored',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'colored lipgloss tube', '5.3ml lipgloss', 'teal tube',
      'custom colour lipgloss', 'OEM cosmetic packaging', 'brand colour tube',
    ],
  },
  {
    sku: 'LGT-403',
    slug: 'colored-round-lipgloss-tube-10ml',
    name: 'Colored Round Lipgloss Tube 10ml',
    category: 'Lip Gloss Tubes',
    description:
      'Large-capacity colored round lipgloss tube, 19.8 mm diameter × 116.2 mm height, 10 ml. Bold colored cap with matching barrel delivers standout shelf presence. Supports full OEM production runs with hot stamping, UV printing, and custom wand styles.',
    specs: {
      shape: 'round',
      capacity_ml: '10',
      width_mm: '19.8',
      height_mm: '116.2',
      material: 'AS Resin',
      finish: 'colored',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'colored lipgloss tube', '10ml lipgloss', 'large lipgloss',
      'OEM lipgloss packaging', 'full-size lip gloss',
    ],
  },

  // ── Family: Matte Black Square ────────────────────────────────────────────
  {
    sku: 'LGT-501',
    slug: 'matte-black-square-lipgloss-tube-8ml',
    name: 'Matte Black Square Lipgloss Tube 8ml',
    category: 'Lip Gloss Tubes',
    description:
      'Premium matte black square-profile lipgloss tube, 18.3 mm width × 109 mm height, 8 ml capacity. Sophisticated soft-touch matte finish elevates brand perception. AS resin with integrated brush applicator wand. Ideal for luxury cosmetic lines and high-end gift sets. OEM/ODM.',
    specs: {
      shape: 'square',
      capacity_ml: '8',
      width_mm: '18.3',
      height_mm: '109',
      material: 'AS Resin',
      finish: 'matte-black',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'square lipgloss tube', 'matte black tube', '8ml lipgloss',
      'luxury cosmetic packaging', 'OEM square tube', 'black lipgloss tube',
    ],
  },
  {
    sku: 'LGT-502',
    slug: 'matte-black-square-lipgloss-tube-9ml',
    name: 'Matte Black Square Lipgloss Tube 9ml',
    category: 'Lip Gloss Tubes',
    description:
      'Premium matte black square-profile lipgloss tube, 21 mm width × 83 mm height, 9 ml capacity. Wider square format with a confident, bold presence on-shelf. Soft-touch matte finish with flat cap. Suitable for lip gloss, lip oil, and pigmented lip treatment. Full OEM/ODM service.',
    specs: {
      shape: 'square',
      capacity_ml: '9',
      width_mm: '21',
      height_mm: '83',
      material: 'AS Resin',
      finish: 'matte-black',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'square lipgloss tube', 'matte black tube', '9ml lipgloss',
      'luxury cosmetic packaging', 'bold lipgloss tube',
    ],
  },

  // ── Family: Compact Wide Short (Ø19.3mm) ─────────────────────────────────
  {
    sku: 'LGT-601',
    slug: 'compact-wide-lipgloss-tube-59mm',
    name: 'Compact Wide Lipgloss Tube 59mm',
    category: 'Lip Gloss Tubes',
    description:
      'Compact wide round lipgloss tube in metallic pink, 19.3 mm diameter × 59.6 mm height, 1.83 ml capacity. Petite travel-size format with premium metallic finish. Perfect for lip gloss sample sets, promotional giveaways, and travel retail. OEM/ODM with custom metallic finishes.',
    specs: {
      shape: 'round',
      capacity_ml: '1.83',
      width_mm: '19.3',
      height_mm: '59.6',
      material: 'AS Resin',
      finish: 'metallic-pink',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'compact lipgloss', 'travel size lipgloss', '1.83ml tube',
      'metallic pink tube', 'mini lipgloss', 'promotional lipgloss packaging',
    ],
  },
  {
    sku: 'LGT-602',
    slug: 'compact-wide-lipgloss-tube-74mm',
    name: 'Compact Wide Lipgloss Tube 74mm',
    category: 'Lip Gloss Tubes',
    description:
      'Compact wide round lipgloss tube in metallic pink, 19.3 mm diameter × 74.2 mm height, 1.83 ml capacity. Slightly taller than the 59 mm variant, providing a more elegant handbag-friendly silhouette. Metallic pink anodised finish. Suitable for travel retail and gift sets with OEM options.',
    specs: {
      shape: 'round',
      capacity_ml: '1.83',
      width_mm: '19.3',
      height_mm: '74.2',
      material: 'AS Resin',
      finish: 'metallic-pink',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'lipgloss tube', 'compact lipgloss', 'travel lipgloss tube', '1.83ml tube',
      'metallic pink tube', 'handbag lipgloss', 'gift set lipgloss packaging',
    ],
  },

  // ── Standalone products ───────────────────────────────────────────────────
  {
    sku: 'LGT-701',
    slug: 'pink-square-lipgloss-tube-9ml',
    name: 'Pink Square Lipgloss Tube 9ml',
    category: 'Lip Gloss Tubes',
    description:
      'Charming pink square-profile lipgloss tube, 15.5 mm width × 99 mm height, 9 ml capacity. Pastel pink finish with matching wand cap appeals to beauty and skincare brands targeting younger demographics. AS resin construction. Custom colour matching and logo printing available.',
    specs: {
      shape: 'square',
      capacity_ml: '9',
      width_mm: '15.5',
      height_mm: '99',
      material: 'AS Resin',
      finish: 'colored',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'pink lipgloss tube', 'square lipgloss tube', '9ml lipgloss',
      'cute cosmetic packaging', 'OEM lipgloss tube', 'pastel tube',
    ],
  },
  {
    sku: 'LGT-702',
    slug: 'black-square-lipgloss-tube-7ml',
    name: 'Black Square Lipgloss Tube 7ml',
    category: 'Lip Gloss Tubes',
    description:
      'Tall black square-profile lipgloss tube, 22 mm width × 103.5 mm height, 7 ml capacity. Bold square cross-section with glossy black finish commands attention on-shelf. Wide mouth accommodates standard and doe-foot wand applicators. OEM/ODM with custom inner filling.',
    specs: {
      shape: 'square',
      capacity_ml: '7',
      width_mm: '22',
      height_mm: '103.5',
      material: 'AS Resin',
      finish: 'matte-black',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'black lipgloss tube', 'square lipgloss tube', '7ml lipgloss',
      'tall lipgloss tube', 'cosmetic packaging', 'OEM black tube',
    ],
  },
  {
    sku: 'LGT-703',
    slug: 'gold-accent-round-lipgloss-tube-5ml',
    name: 'Gold Accent Round Lipgloss Tube 5ml',
    category: 'Lip Gloss Tubes',
    description:
      'Premium round lipgloss tube with gold metallic accent collar, 12.5 mm diameter × 81 mm height, 5 ml capacity. Luxury gold band detail elevates brand positioning. Clear barrel showcases product colour. Ideal for high-end lip gloss, lip oil, and serum packaging with OEM service.',
    specs: {
      shape: 'round',
      capacity_ml: '5',
      width_mm: '12.5',
      height_mm: '81',
      material: 'AS Resin',
      finish: 'metallic',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'gold lipgloss tube', 'luxury lipgloss packaging', '5ml lipgloss',
      'gold accent tube', 'premium cosmetic packaging', 'OEM luxury tube',
    ],
  },
  {
    sku: 'LGT-704',
    slug: 'tall-slim-clear-lipgloss-tube-10ml',
    name: 'Tall Slim Clear Lipgloss Tube 10ml',
    category: 'Lip Gloss Tubes',
    description:
      'Tall slim round lipgloss tube with silver cap, 16 mm diameter × 127.5 mm height, 10 ml capacity. Elongated silhouette with premium silver overcap creates a distinctive retail presence. Crystal-clear barrel. Suitable for high-volume lip gloss filling. OEM/ODM with silver or custom cap finishes.',
    specs: {
      shape: 'round',
      capacity_ml: '10',
      width_mm: '16',
      height_mm: '127.5',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'tall lipgloss tube', 'slim lipgloss tube', '10ml lipgloss', 'silver cap tube',
      'premium cosmetic packaging', 'OEM lipgloss',
    ],
  },
  {
    sku: 'LGT-705',
    slug: 'wide-clear-round-lipgloss-tube-5ml',
    name: 'Wide Clear Round Lipgloss Tube 5ml',
    category: 'Lip Gloss Tubes',
    description:
      'Wide clear round lipgloss tube, 20.3 mm diameter × 91.6 mm height, 5 ml capacity. Generous diameter ensures comfortable grip and easy product dispensing. High-clarity PETG construction. Compatible with standard doe-foot and precision wand applicators. OEM production with custom cap colours.',
    specs: {
      shape: 'round',
      capacity_ml: '5',
      width_mm: '20.3',
      height_mm: '91.6',
      material: 'PETG',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'wide lipgloss tube', 'clear lipgloss tube', '5ml lipgloss', '20mm tube',
      'cosmetic packaging', 'PETG lipgloss tube',
    ],
  },
  {
    sku: 'LGT-706',
    slug: 'metallic-pink-slim-lipgloss-tube-3ml',
    name: 'Metallic Pink Slim Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Slim round lipgloss tube with a full metallic pink anodised finish, 13.7 mm diameter × 132.8 mm height, 3 ml. The tall elegant profile paired with a striking metallic colour creates a high-end look without premium tooling costs. Ideal for limited-edition cosmetic collections.',
    specs: {
      shape: 'round',
      capacity_ml: '3',
      width_mm: '13.7',
      height_mm: '132.8',
      material: 'AS Resin',
      finish: 'metallic-pink',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'metallic pink tube', 'slim lipgloss tube', '3ml lipgloss',
      'limited edition cosmetic', 'OEM cosmetic packaging', 'pink lipgloss',
    ],
  },
  {
    sku: 'LGT-707',
    slug: 'petite-square-lipgloss-tube-3-2ml',
    name: 'Petite Square Lipgloss Tube 3.2ml',
    category: 'Lip Gloss Tubes',
    description:
      'Petite pink square-profile lipgloss tube, 16.3 mm width × 106.8 mm height, 3.2 ml capacity. Slender square cross-section with soft pink finish is popular for K-beauty inspired cosmetic lines. AS resin construction. Available with custom brand colour and UV printed label.',
    specs: {
      shape: 'square',
      capacity_ml: '3.2',
      width_mm: '16.3',
      height_mm: '106.8',
      material: 'AS Resin',
      finish: 'colored',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'square lipgloss tube', 'petite lipgloss tube', '3.2ml lipgloss', 'pink square tube',
      'K-beauty packaging', 'OEM cosmetic tube', 'cute lipgloss packaging',
    ],
  },
  {
    sku: 'LGT-708',
    slug: 'slender-clear-round-lipgloss-tube-2ml',
    name: 'Slender Clear Round Lipgloss Tube 2ml',
    category: 'Lip Gloss Tubes',
    description:
      'Slender clear round lipgloss tube, 16.2 mm diameter × 111 mm height, 2 ml capacity. Crystal-clear cylindrical body with understated elegance. Suitable for minimalist beauty brands and premium serum applicators. PETG resin, OEM/ODM with white-label packaging service.',
    specs: {
      shape: 'round',
      capacity_ml: '2',
      width_mm: '16.2',
      height_mm: '111',
      material: 'PETG',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'clear lipgloss tube', 'slender tube', '2ml lipgloss', 'minimalist packaging',
      'PETG tube', 'cosmetic serum tube',
    ],
  },
  {
    sku: 'LGT-709',
    slug: 'octagonal-clear-lipgloss-tube-3ml',
    name: 'Octagonal Clear Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Unique octagonal-profile clear lipgloss tube, 20.2 mm across × 91 mm height, 3 ml capacity. Eight-sided faceted body provides excellent grip and a distinctive shelf silhouette. AS resin construction with high clarity. Stands out among competitors in boutique and department store settings.',
    specs: {
      shape: 'octagonal',
      capacity_ml: '3',
      width_mm: '20.2',
      height_mm: '91',
      material: 'AS Resin',
      finish: 'clear',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'octagonal lipgloss tube', 'unique lipgloss packaging', '3ml lipgloss',
      'faceted tube', 'boutique cosmetic packaging', 'OEM lipgloss tube',
    ],
  },
  {
    sku: 'LGT-710',
    slug: 'coral-round-lipgloss-tube-2ml',
    name: 'Coral Round Lipgloss Tube 2ml',
    category: 'Lip Gloss Tubes',
    description:
      'Vibrant coral-orange round lipgloss tube, 18.4 mm diameter × 86.5 mm height, 2 ml capacity. Two-tone design with translucent bottom showcasing product colour and solid coloured cap. Ideal for seasonal collections and trend-driven cosmetic launches. Custom Pantone colour matching available.',
    specs: {
      shape: 'round',
      capacity_ml: '2',
      width_mm: '18.4',
      height_mm: '86.5',
      material: 'AS Resin',
      finish: 'colored',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'colored lipgloss tube', 'coral tube', '2ml lipgloss', 'trendy cosmetic packaging',
      'OEM colour tube', 'seasonal cosmetic packaging',
    ],
  },
  {
    sku: 'LGT-711',
    slug: 'wide-round-lipgloss-tube-4ml',
    name: 'Wide Round Lipgloss Tube 4ml',
    category: 'Lip Gloss Tubes',
    description:
      'Wide-body round lipgloss tube with white frosted cap, 21.7 mm diameter × 70.3 mm height, 4 ml capacity. Squat proportions feel premium in hand and are easy to locate in a handbag. PETG with frosted or clear cap options. Suitable for lip gloss, lip treatment, and pigment-rich lip oil.',
    specs: {
      shape: 'round',
      capacity_ml: '4',
      width_mm: '21.7',
      height_mm: '70.3',
      material: 'PETG',
      finish: 'frosted',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'wide lipgloss tube', 'squat lipgloss tube', '4ml lipgloss', 'frosted cap tube',
      'cosmetic packaging', 'OEM lipgloss',
    ],
  },
  {
    sku: 'LGT-712',
    slug: 'gold-gradient-slim-lipgloss-tube-3ml',
    name: 'Gold Gradient Slim Lipgloss Tube 3ml',
    category: 'Lip Gloss Tubes',
    description:
      'Eye-catching slim lipgloss tube with a gold ombré gradient finish, 12.59 mm diameter × 116.5 mm height, 3 ml capacity. Full metallic gradient from gold to champagne creates a truly distinctive brand statement. AS resin, custom gradient colours available. Perfect for prestige and limited-edition cosmetic releases.',
    specs: {
      shape: 'round',
      capacity_ml: '3',
      width_mm: '12.59',
      height_mm: '116.5',
      material: 'AS Resin',
      finish: 'metallic',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'gold gradient tube', 'ombre lipgloss tube', '3ml lipgloss', 'luxury packaging',
      'prestige cosmetic tube', 'limited edition packaging',
    ],
  },
  {
    sku: 'LGT-713',
    slug: 'compact-frosted-round-lipgloss-tube-2-5ml',
    name: 'Compact Frosted Round Lipgloss Tube 2.5ml',
    category: 'Lip Gloss Tubes',
    description:
      'Compact frosted round lipgloss tube, 16.5 mm diameter × 74.8 mm height, 2.5 ml capacity. Soft frosted finish diffuses light for a premium matte look while retaining translucency. Travel-friendly size. Ideal for luxury samples, hotel amenity sets, and travel retail. OEM with custom frosted colours.',
    specs: {
      shape: 'round',
      capacity_ml: '2.5',
      width_mm: '16.5',
      height_mm: '74.8',
      material: 'AS Resin',
      finish: 'frosted',
    },
    images: ['/placeholder.jpg'],
    tags: [
      'frosted lipgloss tube', 'compact lipgloss', '2.5ml lipgloss', 'travel size tube',
      'hotel amenity packaging', 'luxury cosmetic tube',
    ],
  },

  // =========================================================================
  // TUBE STOPPERS (จุกซอง) — sourced from product spreadsheet
  // capacity_ml field stores inner_diameter value for filter compatibility
  // =========================================================================

  // ── Standalone: 1.3mm ────────────────────────────────────────────────────
  {
    sku: 'HL013W',
    slug: 'tube-stopper-1-3mm-wide',
    name: 'Tube Stopper 1.3mm Wide',
    category: 'Tube Stoppers',
    description: 'PE wide-flange tube stopper with 1.3 mm inner diameter. Designed for ultra-slim cosmetic tube and serum applicator packaging. Flexible PE construction ensures a reliable seal. OEM bulk supply available.',
    specs: { shape: 'stopper', capacity_ml: '1.3', inner_diameter_mm: '1.3', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '1.3mm stopper', 'PE stopper', 'cosmetic tube stopper'],
  },
  // ── Standalone: 1.8mm ────────────────────────────────────────────────────
  {
    sku: 'HL018L',
    slug: 'tube-stopper-1-8mm-long',
    name: 'Tube Stopper 1.8mm Long',
    category: 'Tube Stoppers',
    description: 'PE long-profile tube stopper with 1.8 mm inner diameter. Suitable for precision applicator tubes in eye care and serum packaging. PE material for chemical compatibility. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '1.8', inner_diameter_mm: '1.8', material: 'PE', variant_type: 'Long' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '1.8mm stopper', 'PE stopper', 'precision applicator'],
  },

  // ── Family: 5mm stoppers ──────────────────────────────────────────────────
  {
    sku: 'HL050D',
    slug: 'tube-stopper-5mm-standard',
    name: 'Tube Stopper 5mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 5 mm inner diameter. Compatible with lip gloss, mascara, nail polish, and serum tubes. Flexible PE ensures a tight, leak-proof fit. Available in bulk OEM quantities.',
    specs: { shape: 'stopper', capacity_ml: '5', inner_diameter_mm: '5', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '5mm stopper', 'PE stopper', 'lip gloss stopper', 'OEM stopper'],
  },
  {
    sku: 'HL050DZ',
    slug: 'tube-stopper-5mm-standard-plus',
    name: 'Tube Stopper 5mm Standard Plus',
    category: 'Tube Stoppers',
    description: 'Standard Plus PE tube stopper with 5 mm inner diameter. Extended profile variant for deeper seating in tube packaging. Compatible with cosmetic liquid and gel formulations. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '5', inner_diameter_mm: '5', material: 'PE', variant_type: 'Standard Plus' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '5mm stopper', 'PE stopper', 'deep stopper'],
  },
  {
    sku: 'HL050L',
    slug: 'tube-stopper-5mm-long',
    name: 'Tube Stopper 5mm Long',
    category: 'Tube Stoppers',
    description: 'Long-profile PE tube stopper with 5 mm inner diameter. Extended length provides additional holding depth for high-viscosity cosmetic formulations. PE material, chemical-resistant. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '5', inner_diameter_mm: '5', material: 'PE', variant_type: 'Long' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '5mm stopper', 'PE stopper', 'long stopper'],
  },

  // ── Family: 5.5mm stoppers ────────────────────────────────────────────────
  {
    sku: 'HL055W',
    slug: 'tube-stopper-5-5mm-wide',
    name: 'Tube Stopper 5.5mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 5.5 mm inner diameter. Wide flange provides a stable seat against the tube shoulder. Suitable for lip gloss and cosmetic gel packaging. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '5.5', inner_diameter_mm: '5.5', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '5.5mm stopper', 'wide flange stopper', 'PE stopper'],
  },
  {
    sku: 'HL055D',
    slug: 'tube-stopper-5-5mm-standard',
    name: 'Tube Stopper 5.5mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 5.5 mm inner diameter. Compact profile fits standard cosmetic tube necks. Compatible with lip gloss, mascara, and serum applications. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '5.5', inner_diameter_mm: '5.5', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '5.5mm stopper', 'PE stopper', 'cosmetic stopper'],
  },

  // ── Family: 6mm stoppers ──────────────────────────────────────────────────
  {
    sku: 'HL060D',
    slug: 'tube-stopper-6mm-standard',
    name: 'Tube Stopper 6mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 6 mm inner diameter. Widely used in lip gloss, nail polish, and cosmetic gel packaging. Flexible PE construction, excellent chemical resistance. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '6', inner_diameter_mm: '6', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '6mm stopper', 'PE stopper', 'lip gloss stopper'],
  },
  {
    sku: 'HL060L',
    slug: 'tube-stopper-6mm-long',
    name: 'Tube Stopper 6mm Long',
    category: 'Tube Stoppers',
    description: 'Long-profile PE tube stopper with 6 mm inner diameter. Extended body for deep-seating applications in tall or wide-bore cosmetic tubes. PE material, OEM bulk quantities available.',
    specs: { shape: 'stopper', capacity_ml: '6', inner_diameter_mm: '6', material: 'PE', variant_type: 'Long' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '6mm stopper', 'long stopper', 'PE stopper'],
  },

  // ── Family: 7mm stoppers ──────────────────────────────────────────────────
  {
    sku: 'HL070D',
    slug: 'tube-stopper-7mm-standard',
    name: 'Tube Stopper 7mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE/PP tube stopper with 7 mm inner diameter. Dual-material PE/PP blend for improved rigidity and chemical resistance. Suitable for cosmetic tube packaging. OEM bulk supply available.',
    specs: { shape: 'stopper', capacity_ml: '7', inner_diameter_mm: '7', material: 'PE/PP', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '7mm stopper', 'PE/PP stopper', 'cosmetic stopper'],
  },
  {
    sku: 'HL070DL',
    slug: 'tube-stopper-7mm-long',
    name: 'Tube Stopper 7mm Long',
    category: 'Tube Stoppers',
    description: 'Long PE/PP tube stopper with 7 mm inner diameter, compatible with both tube and lipstick packaging. Extended length suits deeper tube necks. PE/PP construction for rigidity. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '7', inner_diameter_mm: '7', material: 'PE/PP', variant_type: 'Long' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '7mm stopper', 'lipstick stopper', 'PE/PP stopper'],
  },
  {
    sku: 'HL070DT',
    slug: 'tube-stopper-7mm-tapered',
    name: 'Tube Stopper 7mm Tapered',
    category: 'Tube Stoppers',
    description: 'Tapered PE/PP tube stopper with 7 mm inner diameter. Tapered body design allows self-aligning insertion. Compatible with tube and lipstick packaging formats. OEM bulk quantities.',
    specs: { shape: 'stopper', capacity_ml: '7', inner_diameter_mm: '7', material: 'PE/PP', variant_type: 'Tapered' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '7mm stopper', 'tapered stopper', 'lipstick stopper'],
  },

  // ── Standalone: 7.8mm ────────────────────────────────────────────────────
  {
    sku: 'HL078LF',
    slug: 'tube-stopper-7-8mm-long-flat',
    name: 'Tube Stopper 7.8mm Long Flat',
    category: 'Tube Stoppers',
    description: 'Long flat-head PE/PP tube stopper with 7.8 mm inner diameter. Flat top profile provides a flush finish with the tube mouth. Dual PE/PP material. Suitable for mascara and precision applicator tubes. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '7.8', inner_diameter_mm: '7.8', material: 'PE/PP', variant_type: 'Long Flat' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '7.8mm stopper', 'flat stopper', 'mascara stopper'],
  },

  // ── Standalone: 8mm ──────────────────────────────────────────────────────
  {
    sku: 'HL080D',
    slug: 'tube-stopper-8mm-standard',
    name: 'Tube Stopper 8mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 8 mm inner diameter. General-purpose stopper for cosmetic tube packaging including lip gloss, serums, and nail treatments. PE material, chemical-resistant, OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '8', inner_diameter_mm: '8', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8mm stopper', 'PE stopper', 'lip gloss stopper'],
  },

  // ── Family: 8.6mm stoppers ────────────────────────────────────────────────
  {
    sku: 'HL060D-A',
    slug: 'tube-stopper-8-6mm-standard-a',
    name: 'Tube Stopper 8.6mm Standard A',
    category: 'Tube Stoppers',
    description: 'Standard A variant PE tube stopper with 8.6 mm inner diameter. Alternative profile geometry for applications requiring a lower-profile seating flange. PE material, OEM bulk quantities available.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE', variant_type: 'Standard A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'PE stopper'],
  },
  {
    sku: 'HL086D',
    slug: 'tube-stopper-8-6mm-standard',
    name: 'Tube Stopper 8.6mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE/PP tube stopper with 8.6 mm inner diameter. One of the most popular sizes for cosmetic lip gloss and serum tube packaging. PE/PP blend for optimal flexibility and durability. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE/PP', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'PE/PP stopper', 'lip gloss stopper', 'popular stopper'],
  },
  {
    sku: 'HL086L',
    slug: 'tube-stopper-8-6mm-long',
    name: 'Tube Stopper 8.6mm Long',
    category: 'Tube Stoppers',
    description: 'Long-profile PE tube stopper with 8.6 mm inner diameter. Extended body for deep-seating applications. Compatible with tall tube packaging. PE construction. OEM bulk supply available.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE', variant_type: 'Long' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'long stopper', 'PE stopper'],
  },
  {
    sku: 'HL086M',
    slug: 'tube-stopper-8-6mm-medium',
    name: 'Tube Stopper 8.6mm Medium',
    category: 'Tube Stoppers',
    description: 'Medium-profile PE/PP tube stopper with 8.6 mm inner diameter. Intermediate length between Standard and Long variants. Ideal for mid-depth tube necks. OEM production with custom material options.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE/PP', variant_type: 'Medium' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'medium stopper', 'PE/PP stopper'],
  },
  {
    sku: 'HL086P',
    slug: 'tube-stopper-8-6mm-plus',
    name: 'Tube Stopper 8.6mm Plus',
    category: 'Tube Stoppers',
    description: 'Plus-profile PE/PP tube stopper with 8.6 mm inner diameter. Enhanced sealing geometry for improved leak prevention. Suitable for liquid cosmetic formulations. OEM bulk quantities.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE/PP', variant_type: 'Plus' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'seal stopper', 'PE/PP stopper'],
  },
  {
    sku: 'HL086S',
    slug: 'tube-stopper-8-6mm-short',
    name: 'Tube Stopper 8.6mm Short',
    category: 'Tube Stoppers',
    description: 'Short-profile PE/PP tube stopper with 8.6 mm inner diameter. Compact form factor suits shallow tube neck applications and thin-walled tubes. PE/PP construction. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '8.6', inner_diameter_mm: '8.6', material: 'PE/PP', variant_type: 'Short' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '8.6mm stopper', 'short stopper', 'PE/PP stopper'],
  },

  // ── Family: 9.6mm stoppers ────────────────────────────────────────────────
  {
    sku: 'HL086Z',
    slug: 'tube-stopper-9-6mm-zero',
    name: 'Tube Stopper 9.6mm Zero',
    category: 'Tube Stoppers',
    description: 'Zero-flange PE tube stopper with 9.6 mm inner diameter. Minimalist profile with no protruding flange for a clean, flush finish inside the tube. PE material. OEM bulk supply available.',
    specs: { shape: 'stopper', capacity_ml: '9.6', inner_diameter_mm: '9.6', material: 'PE', variant_type: 'Zero Flange' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '9.6mm stopper', 'no flange stopper', 'PE stopper'],
  },
  {
    sku: 'HL096W',
    slug: 'tube-stopper-9-6mm-wide',
    name: 'Tube Stopper 9.6mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 9.6 mm inner diameter. Large flange surface creates a stable shoulder seat, preventing the stopper from being pushed in. PE material, OEM bulk production.',
    specs: { shape: 'stopper', capacity_ml: '9.6', inner_diameter_mm: '9.6', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '9.6mm stopper', 'wide flange stopper', 'PE stopper'],
  },
  {
    sku: 'HL096W-A',
    slug: 'tube-stopper-9-6mm-wide-a',
    name: 'Tube Stopper 9.6mm Wide A',
    category: 'Tube Stoppers',
    description: 'Wide A variant PE tube stopper with 9.6 mm inner diameter. Alternative wide-flange geometry for specific tube shoulder profiles. PE construction, compatible with standard cosmetic tube lines. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '9.6', inner_diameter_mm: '9.6', material: 'PE', variant_type: 'Wide A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '9.6mm stopper', 'wide flange stopper'],
  },
  {
    sku: 'HL096D',
    slug: 'tube-stopper-9-6mm-standard',
    name: 'Tube Stopper 9.6mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 9.6 mm inner diameter. Classic profile suitable for a wide range of cosmetic tube applications. Flexible PE provides reliable sealing. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '9.6', inner_diameter_mm: '9.6', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '9.6mm stopper', 'PE stopper', 'cosmetic stopper'],
  },

  // ── Family: 10mm stoppers ─────────────────────────────────────────────────
  {
    sku: 'HL100S',
    slug: 'tube-stopper-10mm-short',
    name: 'Tube Stopper 10mm Short',
    category: 'Tube Stoppers',
    description: 'Short-profile PE/PP tube stopper with 10 mm inner diameter. Compact design for shallow tube neck applications. PE/PP blend for durability and chemical compatibility. OEM bulk production available.',
    specs: { shape: 'stopper', capacity_ml: '10', inner_diameter_mm: '10', material: 'PE/PP', variant_type: 'Short' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '10mm stopper', 'short stopper', 'PE/PP stopper'],
  },
  {
    sku: 'HL100S-A',
    slug: 'tube-stopper-10mm-short-a',
    name: 'Tube Stopper 10mm Short A',
    category: 'Tube Stoppers',
    description: 'Short A variant PE tube stopper with 10 mm inner diameter. Alternative geometry to HL100S for specific tube profile compatibility. PE material for flexible sealing. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '10', inner_diameter_mm: '10', material: 'PE', variant_type: 'Short A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '10mm stopper', 'PE stopper'],
  },
  {
    sku: 'HL100Z',
    slug: 'tube-stopper-10mm-zero',
    name: 'Tube Stopper 10mm Zero',
    category: 'Tube Stoppers',
    description: 'Zero-flange PE tube stopper with 10 mm inner diameter. No protruding flange for a seamless tube finish. Suitable for premium cosmetic packaging where aesthetics matter. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '10', inner_diameter_mm: '10', material: 'PE', variant_type: 'Zero Flange' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '10mm stopper', 'no flange stopper', 'PE stopper'],
  },

  // ── Family: 13mm stoppers ─────────────────────────────────────────────────
  {
    sku: 'HL130W',
    slug: 'tube-stopper-13mm-wide',
    name: 'Tube Stopper 13mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 13 mm inner diameter. Broad flange provides a secure, stable seal against the tube shoulder. Compatible with medium-bore cosmetic and body care tube packaging. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '13', inner_diameter_mm: '13', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '13mm stopper', 'wide flange stopper', 'PE stopper'],
  },
  {
    sku: 'HL130D',
    slug: 'tube-stopper-13mm-standard',
    name: 'Tube Stopper 13mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 13 mm inner diameter. Reliable general-purpose stopper for medium-bore cosmetic tubes. PE construction ensures compatibility with a broad range of cosmetic formulations. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '13', inner_diameter_mm: '13', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '13mm stopper', 'PE stopper', 'cosmetic tube stopper'],
  },
  {
    sku: 'HL130D-A',
    slug: 'tube-stopper-13mm-standard-a',
    name: 'Tube Stopper 13mm Standard A',
    category: 'Tube Stoppers',
    description: 'Standard A variant PE tube stopper with 13 mm inner diameter. Alternative profile for compatibility with specific tube shoulder geometries. PE material. OEM bulk production.',
    specs: { shape: 'stopper', capacity_ml: '13', inner_diameter_mm: '13', material: 'PE', variant_type: 'Standard A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '13mm stopper', 'PE stopper'],
  },

  // ── Family: 15mm stoppers ─────────────────────────────────────────────────
  {
    sku: 'HL150W',
    slug: 'tube-stopper-15mm-wide',
    name: 'Tube Stopper 15mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 15 mm inner diameter. Suitable for body lotion, facial serum, and cream tube packaging with 15 mm bore openings. PE material, flexible and durable. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '15', inner_diameter_mm: '15', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '15mm stopper', 'wide flange stopper', 'PE stopper', 'lotion tube stopper'],
  },
  {
    sku: 'HL150D',
    slug: 'tube-stopper-15mm-standard',
    name: 'Tube Stopper 15mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 15 mm inner diameter. General-purpose stopper for body care and cosmetic tube packaging. Reliable PE construction, OEM bulk quantities available.',
    specs: { shape: 'stopper', capacity_ml: '15', inner_diameter_mm: '15', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '15mm stopper', 'PE stopper', 'cosmetic stopper'],
  },

  // ── Family: 16mm stoppers ─────────────────────────────────────────────────
  {
    sku: 'HL160W',
    slug: 'tube-stopper-16mm-wide',
    name: 'Tube Stopper 16mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 16 mm inner diameter. Popular size for body lotion, shampoo, and cosmetic cream tube packaging. Broad flange ensures a secure fit. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'wide flange stopper', 'PE stopper', 'cream tube stopper'],
  },
  {
    sku: 'HL160D',
    slug: 'tube-stopper-16mm-standard',
    name: 'Tube Stopper 16mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 16 mm inner diameter. One of the most widely used stopper sizes in cosmetic and personal care tube packaging. PE material, OEM bulk production.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'PE stopper', 'popular stopper'],
  },
  {
    sku: 'HL160D-A',
    slug: 'tube-stopper-16mm-standard-a',
    name: 'Tube Stopper 16mm Standard A',
    category: 'Tube Stoppers',
    description: 'Standard A variant PE tube stopper with 16 mm inner diameter. Alternative profile geometry for tubes with different shoulder angles. PE material. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE', variant_type: 'Standard A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'PE stopper'],
  },
  {
    sku: 'HL160F',
    slug: 'tube-stopper-16mm-flat',
    name: 'Tube Stopper 16mm Flat',
    category: 'Tube Stoppers',
    description: 'Flat-head PE/PP tube stopper with 16 mm inner diameter. Flat top profile sits flush with the tube opening for a clean appearance. PE/PP dual-material construction. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE/PP', variant_type: 'Flat' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'flat stopper', 'PE/PP stopper'],
  },
  {
    sku: 'HL160W-B',
    slug: 'tube-stopper-16mm-wide-b',
    name: 'Tube Stopper 16mm Wide B',
    category: 'Tube Stoppers',
    description: 'Wide B variant PE tube stopper with 16 mm inner diameter. Second-generation wide-flange design optimised for improved seating stability. PE material. OEM bulk quantities available.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE', variant_type: 'Wide B' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'wide flange stopper', 'PE stopper'],
  },
  {
    sku: 'HL160D-B',
    slug: 'tube-stopper-16mm-standard-b',
    name: 'Tube Stopper 16mm Standard B',
    category: 'Tube Stoppers',
    description: 'Standard B variant PE tube stopper with 16 mm inner diameter. Updated standard profile for improved fit with newer tube tooling. PE material, OEM bulk production.',
    specs: { shape: 'stopper', capacity_ml: '16', inner_diameter_mm: '16', material: 'PE', variant_type: 'Standard B' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '16mm stopper', 'PE stopper'],
  },

  // ── Standalone: 20mm ─────────────────────────────────────────────────────
  {
    sku: 'HL200D',
    slug: 'tube-stopper-20mm-standard',
    name: 'Tube Stopper 20mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 20 mm inner diameter. Large bore stopper suitable for wide-body cream, gel, and body care tube packaging. Flexible PE, chemical-resistant. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '20', inner_diameter_mm: '20', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '20mm stopper', 'large stopper', 'PE stopper', 'cream tube stopper'],
  },

  // ── Family: 22mm stoppers ─────────────────────────────────────────────────
  {
    sku: 'HL220W',
    slug: 'tube-stopper-22mm-wide',
    name: 'Tube Stopper 22mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 22 mm inner diameter. Designed for large-bore body care and cosmetic tube packaging. Broad flange provides maximum shoulder support. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '22', inner_diameter_mm: '22', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '22mm stopper', 'wide flange stopper', 'large stopper'],
  },
  {
    sku: 'HL220D',
    slug: 'tube-stopper-22mm-standard',
    name: 'Tube Stopper 22mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 22 mm inner diameter. Compatible with large-bore body lotion, sunscreen, and cosmetic cream tubes. PE material, OEM bulk production available.',
    specs: { shape: 'stopper', capacity_ml: '22', inner_diameter_mm: '22', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '22mm stopper', 'PE stopper', 'lotion tube stopper'],
  },

  // ── Standalone: 26mm ─────────────────────────────────────────────────────
  {
    sku: 'HL260D',
    slug: 'tube-stopper-26mm-standard',
    name: 'Tube Stopper 26mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 26 mm inner diameter. Extra-large bore stopper for wide-body tube packaging. Suitable for body wash, hair care, and industrial cosmetic tubes. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '26', inner_diameter_mm: '26', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '26mm stopper', 'large stopper', 'PE stopper'],
  },

  // ── Standalone: 30mm ─────────────────────────────────────────────────────
  {
    sku: 'HL300-A',
    slug: 'tube-stopper-30mm-standard-a',
    name: 'Tube Stopper 30mm Standard A',
    category: 'Tube Stoppers',
    description: 'Standard A PE tube stopper with 30 mm inner diameter. Designed for large-format tube packaging in professional hair care, body treatment, and institutional cosmetics. PE construction. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '30', inner_diameter_mm: '30', material: 'PE', variant_type: 'Standard A' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '30mm stopper', 'large bore stopper', 'PE stopper'],
  },

  // ── Standalone: 33mm ─────────────────────────────────────────────────────
  {
    sku: 'HL330W',
    slug: 'tube-stopper-33mm-wide',
    name: 'Tube Stopper 33mm Wide',
    category: 'Tube Stoppers',
    description: 'Wide-flange PE tube stopper with 33 mm inner diameter. For extra-large tube packaging in professional beauty, salon, and bulk cosmetic applications. Reliable PE construction. OEM bulk available.',
    specs: { shape: 'stopper', capacity_ml: '33', inner_diameter_mm: '33', material: 'PE', variant_type: 'Wide' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '33mm stopper', 'extra large stopper', 'PE stopper'],
  },

  // ── Standalone: 40mm ─────────────────────────────────────────────────────
  {
    sku: 'HL400D',
    slug: 'tube-stopper-40mm-standard',
    name: 'Tube Stopper 40mm Standard',
    category: 'Tube Stoppers',
    description: 'Standard PE tube stopper with 40 mm inner diameter. Industrial-size stopper for large-format tube and container packaging. PE material, OEM bulk production.',
    specs: { shape: 'stopper', capacity_ml: '40', inner_diameter_mm: '40', material: 'PE', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', '40mm stopper', 'industrial stopper', 'PE stopper'],
  },

  // ── Standalone: Range stoppers ────────────────────────────────────────────
  {
    sku: 'HL-TA',
    slug: 'adjustable-tube-stopper-5-18mm',
    name: 'Adjustable Tube Stopper 5.1–18.9mm',
    category: 'Tube Stoppers',
    description: 'Adjustable PE tube stopper covering inner diameter range 5.1–18.9 mm. Flexible design adapts to various tube bore sizes without requiring separate tooling. Ideal for multi-size tube lines. OEM available.',
    specs: { shape: 'stopper', capacity_ml: '', inner_diameter_mm: '5.1-18.9', material: 'PE', variant_type: 'Adjustable' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', 'adjustable stopper', 'multi-size stopper', 'PE stopper'],
  },
  {
    sku: 'HL-TB',
    slug: 'adjustable-tube-stopper-3-21mm',
    name: 'Adjustable Tube Stopper 3.8–21.7mm',
    category: 'Tube Stoppers',
    description: 'Adjustable PE tube stopper covering inner diameter range 3.8–21.7 mm. Wide compatibility range reduces the need for multiple stopper SKUs in mixed tube production lines. OEM bulk supply.',
    specs: { shape: 'stopper', capacity_ml: '', inner_diameter_mm: '3.8-21.7', material: 'PE', variant_type: 'Adjustable' },
    images: ['/placeholder.jpg'],
    tags: ['tube stopper', 'จุกซอง', 'adjustable stopper', 'universal stopper', 'PE stopper'],
  },

  // ── Standalone: Plastic handle ────────────────────────────────────────────
  {
    sku: 'HL101ST',
    slug: 'plastic-handle-101mm',
    name: 'Plastic Handle 101mm',
    category: 'Accessories',
    description: 'PP plastic handle component, 101 mm length. Used as a grip handle or applicator extension in cosmetic and beauty tool packaging. PP construction for rigidity and durability. OEM custom length and colour options available.',
    specs: { shape: 'handle', capacity_ml: '', inner_diameter_mm: '101', material: 'PP', variant_type: 'Standard' },
    images: ['/placeholder.jpg'],
    tags: ['plastic handle', 'ที่จับพลาสติก', 'PP handle', 'applicator handle', 'cosmetic tool'],
  },
]

// ---------------------------------------------------------------------------
// Product Families — groups of products sharing the same mold/design,
// differentiated only by capacity or height.
// ---------------------------------------------------------------------------

export const catalogProductFamilies: CatalogProductFamily[] = [
  {
    key: 'slim-lipgloss-tube',
    label: 'Slim Round Lipgloss Tube',
    optionKeys: ['capacity_ml'],
    skus: ['LGT-101', 'LGT-102'],
  },
  {
    key: 'standard-round-lipgloss-tube',
    label: 'Standard Round Lipgloss Tube',
    optionKeys: ['capacity_ml'],
    skus: ['LGT-201', 'LGT-202', 'LGT-203'],
  },
  {
    key: 'mid-wide-lipgloss-tube',
    label: 'Mid-Wide Round Lipgloss Tube',
    optionKeys: ['capacity_ml'],
    skus: ['LGT-301', 'LGT-302', 'LGT-303'],
  },
  {
    key: 'colored-round-lipgloss-tube',
    label: 'Colored Round Lipgloss Tube',
    optionKeys: ['capacity_ml'],
    skus: ['LGT-401', 'LGT-402', 'LGT-403'],
  },
  {
    key: 'matte-black-square-lipgloss',
    label: 'Matte Black Square Lipgloss Tube',
    optionKeys: ['capacity_ml'],
    skus: ['LGT-501', 'LGT-502'],
  },
  {
    key: 'compact-wide-lipgloss-tube',
    label: 'Compact Wide Lipgloss Tube',
    optionKeys: ['height_mm'],
    skus: ['LGT-601', 'LGT-602'],
  },

  // ── Tube Stopper Families — grouped by inner diameter ────────────────────
  {
    key: 'stopper-5mm',
    label: 'Tube Stopper 5mm',
    optionKeys: ['variant_type'],
    skus: ['HL050D', 'HL050DZ', 'HL050L'],
  },
  {
    key: 'stopper-5-5mm',
    label: 'Tube Stopper 5.5mm',
    optionKeys: ['variant_type'],
    skus: ['HL055W', 'HL055D'],
  },
  {
    key: 'stopper-6mm',
    label: 'Tube Stopper 6mm',
    optionKeys: ['variant_type'],
    skus: ['HL060D', 'HL060L'],
  },
  {
    key: 'stopper-7mm',
    label: 'Tube Stopper 7mm',
    optionKeys: ['variant_type'],
    skus: ['HL070D', 'HL070DL', 'HL070DT'],
  },
  {
    key: 'stopper-8-6mm',
    label: 'Tube Stopper 8.6mm',
    optionKeys: ['variant_type'],
    skus: ['HL060D-A', 'HL086D', 'HL086L', 'HL086M', 'HL086P', 'HL086S'],
  },
  {
    key: 'stopper-9-6mm',
    label: 'Tube Stopper 9.6mm',
    optionKeys: ['variant_type'],
    skus: ['HL086Z', 'HL096W', 'HL096W-A', 'HL096D'],
  },
  {
    key: 'stopper-10mm',
    label: 'Tube Stopper 10mm',
    optionKeys: ['variant_type'],
    skus: ['HL100S', 'HL100S-A', 'HL100Z'],
  },
  {
    key: 'stopper-13mm',
    label: 'Tube Stopper 13mm',
    optionKeys: ['variant_type'],
    skus: ['HL130W', 'HL130D', 'HL130D-A'],
  },
  {
    key: 'stopper-15mm',
    label: 'Tube Stopper 15mm',
    optionKeys: ['variant_type'],
    skus: ['HL150W', 'HL150D'],
  },
  {
    key: 'stopper-16mm',
    label: 'Tube Stopper 16mm',
    optionKeys: ['variant_type'],
    skus: ['HL160W', 'HL160D', 'HL160D-A', 'HL160F', 'HL160W-B', 'HL160D-B'],
  },
  {
    key: 'stopper-22mm',
    label: 'Tube Stopper 22mm',
    optionKeys: ['variant_type'],
    skus: ['HL220W', 'HL220D'],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCatalogProductBySku(sku: string) {
  return catalogProducts.find((product) => product.sku === sku)
}

export function getCatalogProductFamilyBySku(sku: string) {
  const family = catalogProductFamilies.find((item) => item.skus.includes(sku))

  if (!family) {
    return null
  }

  return {
    ...family,
    products: family.skus
      .map((memberSku) => getCatalogProductBySku(memberSku))
      .filter((product): product is CatalogProduct => product !== undefined),
  }
}

/** Groups a (possibly filtered) flat list of products into family groups + standalone items.
 *  Preserves the order families appear in `catalogProductFamilies`, standalones follow after. */
export function groupProductsForDisplay(
  products: CatalogProduct[]
): ProductDisplayGroup[] {
  const skuSet = new Set(products.map((p) => p.sku))
  const usedSkus = new Set<string>()
  const groups: ProductDisplayGroup[] = []

  for (const family of catalogProductFamilies) {
    const familyProducts = family.skus
      .filter((sku) => skuSet.has(sku))
      .map((sku) => products.find((p) => p.sku === sku))
      .filter((p): p is CatalogProduct => p !== undefined)

    if (familyProducts.length > 0) {
      familyProducts.forEach((p) => usedSkus.add(p.sku))
      groups.push({ type: 'family', family: { ...family, products: familyProducts } })
    }
  }

  for (const product of products) {
    if (!usedSkus.has(product.sku)) {
      groups.push({ type: 'standalone', product })
    }
  }

  return groups
}
