const BASE = process.env.WP_API_URL

if (!BASE) {
  throw new Error("WP_API_URL is not defined")
}

type ModifiedRecord = {
  modified?: string
}

async function fetchModifiedRecords(path: string): Promise<ModifiedRecord[]> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

async function fetchFirstModified(path: string) {
  const records = await fetchModifiedRecords(path)
  return records[0]?.modified ?? null
}

async function fetchLatestModified(path: string) {
  const records = await fetchModifiedRecords(path)
  return records[0]?.modified ?? null
}

export function getAboutLastModified() {
  return fetchFirstModified("/wp-json/wp/v2/about?per_page=1&_fields=modified")
}

export function getCompanyLastModified() {
  return fetchFirstModified("/wp-json/wp/v2/company?per_page=1&_fields=modified")
}

export function getHeroLastModified() {
  return fetchLatestModified(
    "/wp-json/wp/v2/hero_slide?per_page=1&_fields=modified&orderby=modified&order=desc"
  )
}

export function getWhyLastModified() {
  return fetchLatestModified(
    "/wp-json/wp/v2/why?per_page=1&_fields=modified&orderby=modified&order=desc"
  )
}
