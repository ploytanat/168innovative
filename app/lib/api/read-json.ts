/** Keep upstream HTML/error pages out of JSON parsers and page rendering. */
export async function readJson<T>(response: Response, fallback: T): Promise<T> {
  const contentType = response.headers.get("content-type") ?? ""
  const mime = contentType.split(";", 1)[0].trim().toLowerCase()
  if (!response.ok || !(mime === "application/json" || mime.endsWith("+json"))) {
    console.warn(`API response rejected: ${response.status} ${mime || "missing content-type"} ${response.url.split("?", 1)[0]}`)
    return fallback
  }

  try {
    const data: unknown = await response.json()
    if (Array.isArray(fallback) && !Array.isArray(data)) {
      console.warn(`Expected an API array: ${response.url.split("?", 1)[0]}`)
      return fallback
    }
    return data as T
  } catch {
    console.warn(`Invalid API JSON: ${response.url.split("?", 1)[0]}`)
    return fallback
  }
}
