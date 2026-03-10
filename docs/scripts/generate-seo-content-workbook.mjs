import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const envPath = path.join(root, ".env.local")
const outputDir = path.join(root, "docs", "seo-content-workbook")

function loadEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const idx = line.indexOf("=")
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
      })
  )
}

const env = loadEnv(envPath)
const WP_API_URL = env.WP_API_URL

if (!WP_API_URL) {
  throw new Error("WP_API_URL missing in .env.local")
}

function empty(value) {
  return value === undefined || value === null || String(value).trim() === ""
}

function normalizeText(value) {
  return empty(value) ? "" : String(value).replace(/\s+/g, " ").trim()
}

function countFaq(items) {
  return Array.isArray(items) ? items.length : 0
}

function joinTerms(values) {
  return [...new Set(values.map(normalizeText).filter(Boolean))].join(" | ")
}

function csvEscape(value) {
  const text = value === undefined || value === null ? "" : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

function writeCsv(filePath, rows) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const lines = [headers.map(csvEscape).join(",")]

  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","))
  }

  fs.writeFileSync(filePath, `${lines.join("\n")}\n`)
}

async function fetchAll(endpoint, params = {}, perPage = 100) {
  const out = []
  let page = 1

  while (true) {
    const url = new URL(`${WP_API_URL}/wp-json/wp/v2/${endpoint}`)
    url.searchParams.set("per_page", String(perPage))
    url.searchParams.set("page", String(page))

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }

    const res = await fetch(url)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`${endpoint} page ${page} failed: ${res.status}\n${text}`)
    }

    const data = await res.json()
    out.push(...data)

    const totalPages = Number(res.headers.get("X-WP-TotalPages") || 1)
    if (page >= totalPages) break
    page += 1
  }

  return out
}

function getPriority(missingCount) {
  if (missingCount >= 4) return "High"
  if (missingCount >= 2) return "Medium"
  return "Low"
}

function productRow(item, categoryMap) {
  const acf = item.acf ?? {}
  const category = categoryMap.get(item.product_category?.[0] ?? 0)
  const missingFields = []

  if (empty(acf.content_th)) missingFields.push("content_th")
  if (empty(acf.content_en)) missingFields.push("content_en")
  if (empty(acf.application_th)) missingFields.push("application_th")
  if (empty(acf.application_en)) missingFields.push("application_en")
  if (countFaq(acf.faq_items) === 0) missingFields.push("faq_items")
  if (empty(acf.focus_keyword_th)) missingFields.push("focus_keyword_th")
  if (empty(acf.focus_keyword_en)) missingFields.push("focus_keyword_en")

  const nameTh = normalizeText(acf.name_th || item.title?.rendered)
  const nameEn = normalizeText(acf.name_en || item.title?.rendered)
  const categoryTh = normalizeText(category?.acf?.name_th || category?.name)
  const categoryEn = normalizeText(category?.acf?.name_en || category?.name)

  return {
    type: "product",
    id: item.id,
    slug: item.slug,
    url_th: `https://168innovative.co.th/categories/${category?.slug || ""}/${item.slug}`,
    url_en: `https://168innovative.co.th/en/categories/${category?.slug || ""}/${item.slug}`,
    category_slug: category?.slug || "",
    name_th: nameTh,
    name_en: nameEn,
    primary_keyword_th: normalizeText(acf.focus_keyword_th || nameTh),
    primary_keyword_en: normalizeText(acf.focus_keyword_en || nameEn),
    secondary_terms_th: joinTerms([categoryTh, "รับผลิต", "OEM", "โรงงาน"]),
    secondary_terms_en: joinTerms([categoryEn, "OEM", "manufacturer", "supplier"]),
    short_description_status:
      !empty(acf.description_th) && !empty(acf.description_en) ? "filled" : "missing",
    long_content_status:
      !empty(acf.content_th) && !empty(acf.content_en) ? "filled" : "missing",
    application_status:
      !empty(acf.application_th) && !empty(acf.application_en) ? "filled" : "missing",
    faq_count: countFaq(acf.faq_items),
    priority: getPriority(missingFields.length),
    fields_to_fill: missingFields.join(" | "),
    writing_angle_th:
      "สรุปจุดเด่น + วัสดุ/ขนาด + การใช้งาน + กลุ่มสินค้า/อุตสาหกรรมที่เหมาะ + CTA สอบถามราคา",
    writing_angle_en:
      "Explain features, size/material, applications, suitable industries, and B2B enquiry angle",
  }
}

function categoryRow(item) {
  const acf = item.acf ?? {}
  const missingFields = []

  if (empty(acf.name_th)) missingFields.push("name_th")
  if (empty(acf.intro_html_th)) missingFields.push("intro_html_th")
  if (empty(acf.intro_html_en)) missingFields.push("intro_html_en")
  if (countFaq(acf.faq_items) === 0) missingFields.push("faq_items")
  if (empty(acf.focus_keyword_th)) missingFields.push("focus_keyword_th")
  if (empty(acf.focus_keyword_en)) missingFields.push("focus_keyword_en")
  if (!Array.isArray(acf.featured_products) || acf.featured_products.length === 0) {
    missingFields.push("featured_products")
  }

  const nameTh = normalizeText(acf.name_th || item.name)
  const nameEn = normalizeText(acf.name_en || item.name)

  return {
    type: "category",
    id: item.id,
    slug: item.slug,
    url_th: `https://168innovative.co.th/categories/${item.slug}`,
    url_en: `https://168innovative.co.th/en/categories/${item.slug}`,
    name_th: nameTh,
    name_en: nameEn,
    primary_keyword_th: normalizeText(acf.focus_keyword_th || nameTh),
    primary_keyword_en: normalizeText(acf.focus_keyword_en || nameEn),
    secondary_terms_th: joinTerms([nameTh, "โรงงาน", "OEM", "แพ็กเกจจิ้ง"]),
    secondary_terms_en: joinTerms([nameEn, "OEM", "packaging", "manufacturer"]),
    intro_status:
      !empty(acf.intro_html_th) && !empty(acf.intro_html_en) ? "filled" : "missing",
    faq_count: countFaq(acf.faq_items),
    featured_products_count: Array.isArray(acf.featured_products) ? acf.featured_products.length : 0,
    priority: getPriority(missingFields.length),
    fields_to_fill: missingFields.join(" | "),
    writing_angle_th:
      "ภาพรวมหมวด + วิธีเลือก + การใช้งานหลัก + สเปกหรือรูปแบบที่พบบ่อย + FAQ สำหรับผู้ซื้อ",
    writing_angle_en:
      "Category overview, selection guide, common applications, typical specs, and buyer FAQ",
  }
}

function articleRow(item) {
  const acf = item.acf ?? {}
  const missingFields = []

  if (empty(acf.content_th)) missingFields.push("content_th")
  if (empty(acf.content_en)) missingFields.push("content_en")
  if (countFaq(acf.faq_items) === 0) missingFields.push("faq_items")
  if (empty(acf.focus_keyword_th || acf.focus_keyword)) missingFields.push("focus_keyword_th")
  if (empty(acf.focus_keyword_en || acf.focus_keyword)) missingFields.push("focus_keyword_en")
  if (!Array.isArray(acf.related_products) || acf.related_products.length === 0) {
    missingFields.push("related_products")
  }

  const titleTh = normalizeText(acf.title_th || item.title?.rendered)
  const titleEn = normalizeText(acf.title_en || item.title?.rendered)

  return {
    type: "article",
    id: item.id,
    slug: item.slug,
    url_th: `https://168innovative.co.th/articles/${item.slug}`,
    url_en: `https://168innovative.co.th/en/articles/${item.slug}`,
    title_th: titleTh,
    title_en: titleEn,
    primary_keyword_th: normalizeText(acf.focus_keyword_th || acf.focus_keyword || titleTh),
    primary_keyword_en: normalizeText(acf.focus_keyword_en || acf.focus_keyword || titleEn),
    supporting_terms_th: joinTerms(["วิธีเลือก", "OEM", "เปรียบเทียบ", "คำแนะนำ"]),
    supporting_terms_en: joinTerms(["guide", "OEM", "comparison", "best for"]),
    content_status:
      !empty(acf.content_th) && !empty(acf.content_en) ? "filled" : "missing",
    faq_count: countFaq(acf.faq_items),
    related_products_count: Array.isArray(acf.related_products) ? acf.related_products.length : 0,
    priority: getPriority(missingFields.length),
    fields_to_fill: missingFields.join(" | "),
    writing_angle_th:
      "ตอบคำถามหลักให้จบในหน้าเดียว แล้วโยงไปหมวดหรือสินค้าที่เกี่ยวข้อง",
    writing_angle_en:
      "Solve one search problem completely, then bridge naturally to related categories and products",
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true })

  const [categories, products, articles] = await Promise.all([
    fetchAll("product_category"),
    fetchAll("product", { _fields: "id,slug,title,acf,product_category" }),
    fetchAll("article", { _fields: "id,slug,title,acf" }),
  ])

  const categoryMap = new Map(categories.map((item) => [item.id, item]))

  const productRows = products.map((item) => productRow(item, categoryMap))
  const categoryRows = categories.map((item) => categoryRow(item))
  const articleRows = articles.map((item) => articleRow(item))

  writeCsv(path.join(outputDir, "products-workbook.csv"), productRows)
  writeCsv(path.join(outputDir, "categories-workbook.csv"), categoryRows)
  writeCsv(path.join(outputDir, "articles-workbook.csv"), articleRows)

  const summary = {
    generatedAt: new Date().toISOString(),
    counts: {
      products: productRows.length,
      categories: categoryRows.length,
      articles: articleRows.length,
    },
    outputDir,
  }

  fs.writeFileSync(
    path.join(outputDir, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`
  )

  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
