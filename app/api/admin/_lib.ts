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

type ParsedWpBody =
  | { message?: string; code?: string; error?: string; data?: { status?: number } }
  | string
  | number
  | boolean
  | null
  | ParsedWpBody[]
  | { [key: string]: ParsedWpBody }

function buildAuthFailureMessage(code: string) {
  if (code === "rest_cannot_edit") {
    return "WordPress ปฏิเสธการแก้ไขข้อมูลจาก credential ปัจจุบัน กรุณาตรวจสอบสิทธิ์ของผู้ใช้ใน WordPress ก่อน"
  }

  return "WordPress ไม่ยอมรับการยืนยันตัวตนของคำขอนี้ กรุณาตรวจสอบ WP_USERNAME, WP_APP_PASSWORD และการส่งต่อ Authorization header บนเซิร์ฟเวอร์ WordPress"
}

export async function parseWpBody(res: Response): Promise<ParsedWpBody> {
  const text = await res.text()

  try {
    const data = JSON.parse(text) as ParsedWpBody
    if (
      !res.ok &&
      typeof data === "object" &&
      data !== null &&
      "code" in data &&
      (data.code === "rest_cannot_edit" || data.code === "rest_not_logged_in")
    ) {
      return {
        ...data,
        message: buildAuthFailureMessage(data.code),
      }
    }
    return data
  } catch {
    return { message: text.slice(0, 200) }
  }
}
