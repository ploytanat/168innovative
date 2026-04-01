export const WP_BASE = (process.env.WP_API_URL ?? "").replace(/\/+$/, "")

function credentials() {
  const user = process.env.WP_USERNAME ?? ""
  const pass = process.env.WP_APP_PASSWORD ?? ""
  return Buffer.from(`${user}:${pass}`).toString("base64")
}

export function wpHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${credentials()}`,
  }
}

export function wpAdminFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: { ...wpHeaders(), ...(init.headers ?? {}) },
  })
}
