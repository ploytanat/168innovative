import fs from "node:fs"
import path from "node:path"

const manualRedirectMap = {
  "Cream-sachet-stopper-HL086D-Size-8.6-mm-84":
    "/categories/spout/plastic-spout-hl086d-8-6mm",
  "HL086M-8.6mm-144": "/categories/spout/plastic-spout-hl086m-8-6mm",
  "HL086S-8.6mm-142": "/categories/spout/plastic-spout-hl086s-8-6mm",
  "HL096W-9.6mm-146": "/categories/spout/plastic-spout-hl096-9-6mm",
  "HL080D-8mm-138": "/categories/spout/plastic-spout-hl080d-8mm",
  "HL160D-16mm-159": "/categories/spout/plastic-spout-hl160d-16mm",
  "HL130D-13mm-154": "/categories/spout/plastic-spout-hl130d-13mm",
  "HL086M-8.6mm-143": "/categories/spout/plastic-spout-hl086m-8-6mm",
  "HL013W-1.3-mm--125": "/categories/spout/plastic-spout-hl013-3mm",
}

const codeRedirectMap = {
  HL013W: "/categories/spout/plastic-spout-hl013-3mm",
  HL018: "/categories/spout/plastic-spout-hl018-1-8mm",
  HL020: "/categories/spout/plastic-spout-hl020-2mm",
  HL048D: "/categories/spout/plastic-spout-hl048d-cx048-4-8mm",
  HL070DLJ: "/categories/mascara-packaging/plastic-spout-hl070dlj-7mm",
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
  RD124: "/categories/spout/plastic-spout-rd124-8-6mm",
}

const prefixRedirectMap = [
  [/^MASCARA-/i, "/categories/mascara-packaging"],
  [/^LIPSTICK-BOTTLE-/i, "/categories/lipstick-packaging"],
  [/^LIP-GLOSS-TUBE-/i, "/categories/lipstick-packaging"],
  [/^LIP-GLOSS-/i, "/categories/lipstick-packaging"],
  [/^POWDER-COMPACT-/i, "/categories/powder-compact"],
  [/^SOAP-BAG-/i, "/categories/soap-bag"],
  [/^PUMP-BOTTLE-CAP-/i, "/categories/dispensing-press-cap"],
  [/^ROE-CHAIN-/i, "/categories/ball-chain"],
  [/^W\d+(?:\.\d+)?MM-H\d+(?:\.\d+)?MM$/i, "/categories/plastic-handle"],
  [/^มือจับพลาสติก-/i, "/categories/plastic-handle"],
  [/^วาล์วสำหรับถุงกาแฟ-/i, "/categories/spout/coffee-bag-valve-hl400-40mm"],
]

function normalizeLegacySlug(slug) {
  return decodeURIComponent(slug).trim()
}

function extractLegacyProductCode(slug) {
  const normalized = normalizeLegacySlug(slug)
  const patterns = [
    /Cream-sachet-stopper-([A-Za-z0-9-]+)-Size/i,
    /จุกซองครีม-([A-Za-z0-9-]+)(?:[\.-]|$)/i,
    /จุกมาสคาร่า-([A-Za-z0-9-]+)(?:[\.-]|$)/i,
    /^([A-Za-z0-9-]+?)-\d+$/i,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (match?.[1]) return match[1].toUpperCase()
  }

  return null
}

function resolveLegacyProductRedirect(slug) {
  const normalized = normalizeLegacySlug(slug)

  if (manualRedirectMap[normalized]) {
    return { destination: manualRedirectMap[normalized], source: "manual" }
  }

  const code = extractLegacyProductCode(normalized)

  if (code && codeRedirectMap[code]) {
    return { destination: codeRedirectMap[code], source: `code:${code}` }
  }

  if (code && /^(HL|RD)/i.test(code)) {
    return { destination: "/categories/spout", source: `family:${code}` }
  }

  if (code && /^(J|Q)/i.test(code)) {
    return {
      destination: "/categories/dispensing-press-cap",
      source: `family:${code}`,
    }
  }

  for (const [pattern, destination] of prefixRedirectMap) {
    if (pattern.test(normalized)) {
      return { destination, source: `prefix:${pattern}` }
    }
  }

  return null
}

function parseInputLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    return {
      input: trimmed,
      pathname: url.pathname,
      search: url.search,
      slug: url.pathname.startsWith("/product/")
        ? url.pathname.replace("/product/", "")
        : null,
    }
  } catch {
    return {
      input: trimmed,
      pathname: trimmed.startsWith("/") ? trimmed : `/product/${trimmed}`,
      search: "",
      slug: trimmed
        .replace(/^https?:\/\/[^/]+/i, "")
        .replace(/^\/product\//i, "")
        .replace(/^\//, ""),
    }
  }
}

function resolveInput(line) {
  const parsed = parseInputLine(line)
  if (!parsed) return null

  if (parsed.pathname === "/category") {
    const category = new URLSearchParams(parsed.search).get("category")
    if (category) {
      return {
        input: parsed.input,
        type: "legacy-category",
        destination: `(lookup category id ${category} at runtime)`,
        status: "runtime",
      }
    }

    return {
      input: parsed.input,
      type: "legacy-category",
      destination: "/categories",
      status: "fallback",
    }
  }

  if (!parsed.slug) {
    return {
      input: parsed.input,
      type: "unsupported",
      destination: null,
      status: "skip",
    }
  }

  const resolved = resolveLegacyProductRedirect(parsed.slug)
  if (resolved) {
    return {
      input: parsed.input,
      type: "legacy-product",
      destination: resolved.destination,
      status: resolved.source,
    }
  }

  return {
    input: parsed.input,
    type: "legacy-product",
    destination: "(fallback to wb legacy API lookup)",
    status: "runtime",
  }
}

function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error("Usage: node docs/scripts/check-legacy-redirects.mjs <input-file>")
    process.exit(1)
  }

  const absolutePath = path.resolve(process.cwd(), inputPath)
  const content = fs.readFileSync(absolutePath, "utf8")
  const lines = content.split(/\r?\n/)
  const results = lines.map(resolveInput).filter(Boolean)

  const counts = results.reduce(
    (acc, item) => {
      acc.total += 1
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    },
    { total: 0 }
  )

  console.log(JSON.stringify({ counts, results }, null, 2))
}

main()
