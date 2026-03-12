const legacyProductRedirectMap: Record<string, string> = {
  "Cream-sachet-stopper-HL086D-Size-8.6-mm-84":
    "/categories/spout/plastic-spout-hl086d-8-6mm",
  "Lipstick-Bottle": "/categories/lipstick-packaging",
  "HL086M-8.6mm-144": "/categories/spout/plastic-spout-hl086m-8-6mm",
  "HL086S-8.6mm-142": "/categories/spout/plastic-spout-hl086s-8-6mm",
  "HL096W-9.6mm-146": "/categories/spout/plastic-spout-hl096-9-6mm",
  "HL080D-8mm-138": "/categories/spout/plastic-spout-hl080d-8mm",
  "HL160D-16mm-159": "/categories/spout/plastic-spout-hl160d-16mm",
  "HL130D-13mm-154": "/categories/spout/plastic-spout-hl130d-13mm",
  "HL086M-8.6mm-143": "/categories/spout/plastic-spout-hl086m-8-6mm",
  "HL013W-1.3-mm--125": "/categories/spout/plastic-spout-hl013-3mm",
}

const legacyProductCodeRedirectMap: Record<string, string> = {
  HL013W: "/categories/spout/plastic-spout-hl013-3mm",
  HL018: "/categories/spout/plastic-spout-hl018-1-8mm",
  HL020: "/categories/spout/plastic-spout-hl020-2mm",
  HL048D: "/categories/spout/plastic-spout-hl048d-cx048-4-8mm",
  HL050: "/categories/spout/plastic-spout-hl050-5mm",
  HL050D: "/categories/spout/plastic-spout-hl050d-5mm",
  HL055D: "/categories/spout/plastic-spout-hl055d-1-5mm",
  HL060D: "/categories/spout/plastic-spout-hl060d-sr060-6mm",
  HL060L: "/categories/spout/plastic-spout-hl060l-6mm",
  HL070DLJ: "/categories/mascara-packaging/plastic-spout-hl070dlj-7mm",
  HL078LF: "/categories/spout",
  HL080D: "/categories/spout/plastic-spout-hl080d-8mm",
  HL082: "/categories/spout/plastic-spout-hl082d-8-2mm",
  HL082D: "/categories/spout/plastic-spout-hl082d-8-2mm",
  HL086D: "/categories/spout/plastic-spout-hl086d-8-6mm",
  HL086H: "/categories/spout/plastic-spout-hl086h-8-6mm",
  HL086M: "/categories/spout/plastic-spout-hl086m-8-6mm",
  HL086S: "/categories/spout/plastic-spout-hl086s-8-6mm",
  HL096: "/categories/spout/plastic-spout-hl096-9-6mm",
  HL096D: "/categories/spout/plastic-spout-hl096d-9-6mm",
  HL096F: "/categories/spout/plastic-spout-hl096f-9-6mm",
  HL096W: "/categories/spout/plastic-spout-hl096-9-6mm",
  "HL096W-A": "/categories/spout/plastic-spout-hl096-9-6mm",
  HL100S: "/categories/spout/plastic-spout-hl100s-10mm",
  "HL100S-A": "/categories/spout/plastic-spout-hl100s-10mm",
  HL100SL: "/categories/spout/plastic-spout-hl100sl-10mm",
  HL100SM: "/categories/spout/plastic-spout-hl100sm-10mm",
  HL100W: "/categories/spout/plastic-spout-hl100w-10mm",
  HL100Z: "/categories/spout/plastic-spout-hl100w-10mm",
  HL101ST: "/categories/spout",
  HL130D: "/categories/spout/plastic-spout-hl130d-13mm",
  HL130W: "/categories/spout/plastic-spout-hl130w-13mm",
  HL140: "/categories/spout/plastic-spout-hl140-14mm",
  HL140J: "/categories/spout/plastic-spout-hl140j-14mm",
  HL150D: "/categories/spout/plastic-spout-hl150d-15mm",
  HL150F: "/categories/spout/plastic-spout-hl150f-15mm",
  HL150W: "/categories/spout/plastic-spout-hl150w-15mm",
  HL160D: "/categories/spout/plastic-spout-hl160d-16mm",
  "HL160D-A": "/categories/spout/plastic-spout-hl160d-1-16mm",
  HL160W: "/categories/spout/plastic-spout-hl160w-16mm",
  HL200: "/categories/spout/plastic-spout-hl200-20mm",
  HL200D: "/categories/spout/plastic-spout-hl200d-20mm",
  HL220: "/categories/spout/plastic-spout-hl220-22mm",
  HL330: "/categories/spout/plastic-spout-hl330-33mm",
  HL400D: "/categories/spout/coffee-bag-valve-hl400-40mm",
  "HL-TA": "/categories/spout",
  RD124: "/categories/spout/plastic-spout-rd124-8-6mm",
}

const legacyProductPrefixRedirectMap: Array<[RegExp, string]> = [
  [/^MASCARA-/i, "/categories/mascara-packaging"],
  [/^LIPSTICK-BOTTLE$/i, "/categories/lipstick-packaging"],
  [/^LIPSTICK-BOTTLE-/i, "/categories/lipstick-packaging"],
  [/^LIP-GLOSS-TUBE$/i, "/categories/lipstick-packaging"],
  [/^LIP-GLOSS-TUBE-/i, "/categories/lipstick-packaging"],
  [/^LIP-GLOSS-/i, "/categories/lipstick-packaging"],
  [/^POWDER-COMPACT$/i, "/categories/powder-compact"],
  [/^POWDER-COMPACT-/i, "/categories/powder-compact"],
  [/^SOAP-BAG$/i, "/categories/soap-bag"],
  [/^SOAP-BAG-/i, "/categories/soap-bag"],
  [/^PUMP-BOTTLE-CAP$/i, "/categories/dispensing-press-cap"],
  [/^PUMP-BOTTLE-CAP-/i, "/categories/dispensing-press-cap"],
  [/^ROE-CHAIN$/i, "/categories/ball-chain"],
  [/^ROE-CHAIN-/i, "/categories/ball-chain"],
  [/^W\d+(?:\.\d+)?MM-H\d+(?:\.\d+)?MM$/i, "/categories/plastic-handle"],
  [/^มือจับพลาสติก-/i, "/categories/plastic-handle"],
  [/^วาล์วสำหรับถุงกาแฟ-/i, "/categories/spout/coffee-bag-valve-hl400-40mm"],
]

function normalizeLegacySlug(slug: string) {
  return decodeURIComponent(slug).trim()
}

function extractLegacyProductCode(slug: string) {
  const normalized = normalizeLegacySlug(slug)

  const patterns = [
    /Cream-sachet-stopper-([A-Za-z0-9-]+)-Size/i,
    /จุกซองครีม-([A-Za-z0-9-]+)(?:[\.-]|$)/i,
    /จุกมาสคาร่า-([A-Za-z0-9-]+)(?:[\.-]|$)/i,
    /^([A-Za-z0-9-]+?)-\d+$/i,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)

    if (match?.[1]) {
      return match[1].toUpperCase()
    }
  }

  return null
}

export function resolveLegacyProductRedirect(slug: string) {
  const normalized = normalizeLegacySlug(slug)

  if (legacyProductRedirectMap[normalized]) {
    return legacyProductRedirectMap[normalized]
  }

  const code = extractLegacyProductCode(normalized)

  if (!code) {
    for (const [pattern, destination] of legacyProductPrefixRedirectMap) {
      if (pattern.test(normalized)) {
        return destination
      }
    }

    return null
  }

  const directMatch = legacyProductCodeRedirectMap[code]

  if (directMatch) {
    return directMatch
  }

  if (/^(HL|RD)/i.test(code)) {
    return "/categories/spout"
  }

  if (/^(J|Q)/i.test(code)) {
    return "/categories/dispensing-press-cap"
  }

  for (const [pattern, destination] of legacyProductPrefixRedirectMap) {
    if (pattern.test(normalized)) {
      return destination
    }
  }

  return null
}
