import { NextResponse } from "next/server"

import { parseWpBody, wpHeaders, WP_BASE } from "../_lib"

async function readMe() {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/users/me?context=edit`, {
    headers: wpHeaders(),
    cache: "no-store",
  })

  return {
    status: res.status,
    ok: res.ok,
    body: await parseWpBody(res),
  }
}

export async function GET() {
  if (!WP_BASE || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing WordPress admin environment variables",
        env: {
          wpBase: !!WP_BASE,
          username: !!process.env.WP_USERNAME,
          appPassword: !!process.env.WP_APP_PASSWORD,
        },
      },
      { status: 500 }
    )
  }

  const me = await readMe()

  return NextResponse.json({
    ok: me.ok,
    env: {
      wpBase: WP_BASE,
      username: process.env.WP_USERNAME,
      appPassword: "<set>",
    },
    me,
  })
}

export async function POST() {
  if (!WP_BASE || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing WordPress admin environment variables",
      },
      { status: 500 }
    )
  }

  const me = await readMe()
  if (!me.ok) {
    return NextResponse.json(
      {
        ok: false,
        stage: "auth",
        me,
      },
      { status: me.status }
    )
  }

  const stamp = new Date().toISOString().replace(/[^\d]/g, "").slice(0, 14)
  const title = `Codex Auth Probe ${stamp}`

  const createRes = await fetch(`${WP_BASE}/wp-json/wp/v2/product`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify({
      title,
      status: "draft",
      featured_media: 0,
      product_category: [],
      acf: {
        name_th: title,
        name_en: title,
        description_th: "temporary auth probe",
        description_en: "temporary auth probe",
        content_th: "",
        content_en: "",
        application_th: "",
        application_en: "",
        image_alt_th: "",
        image_alt_en: "",
        specs_json: "",
        sku: `AUTH-PROBE-${stamp}`,
        brand_name: "",
        material: "",
        capacity: "",
        dimensions: "",
        moq: "",
        lead_time_days: null,
        availability_status: "out_of_stock",
        canonical_url_th: "",
        canonical_url_en: "",
        seo_title_th: "",
        seo_title_en: "",
        seo_description_th: "",
        seo_description_en: "",
        focus_keyword_th: "",
        focus_keyword_en: "",
        og_title_th: "",
        og_title_en: "",
        og_description_th: "",
        og_description_en: "",
        robots_index: true,
        robots_follow: true,
      },
    }),
  })

  const createBody = await parseWpBody(createRes)
  if (!createRes.ok || typeof createBody !== "object" || createBody === null || !("id" in createBody)) {
    return NextResponse.json(
      {
        ok: false,
        stage: "create",
        me,
        create: {
          status: createRes.status,
          ok: createRes.ok,
          body: createBody,
        },
      },
      { status: createRes.status }
    )
  }

  const createdId = Number(createBody.id)

  const patchRes = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${createdId}`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify({
      title: `${title} Updated`,
    }),
  })
  const patchBody = await parseWpBody(patchRes)

  const deleteRes = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${createdId}?force=true`, {
    method: "DELETE",
    headers: wpHeaders(),
  })
  const deleteBody = await parseWpBody(deleteRes)

  const ok = createRes.ok && patchRes.ok && deleteRes.ok

  return NextResponse.json(
    {
      ok,
      stage: ok ? "completed" : "cleanup",
      me,
      create: {
        status: createRes.status,
        ok: createRes.ok,
        body: createBody,
      },
      patch: {
        status: patchRes.status,
        ok: patchRes.ok,
        body: patchBody,
      },
      delete: {
        status: deleteRes.status,
        ok: deleteRes.ok,
        body: deleteBody,
      },
    },
    { status: ok ? 200 : 500 }
  )
}
