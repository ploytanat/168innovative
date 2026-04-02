import { NextRequest, NextResponse } from "next/server";
import { parseWpBody, wpAdminFetch, wpHeaders, WP_BASE } from "../_lib";

// GET  /api/admin/products
// status=any requires Administrator role in WordPress.
// If WP_ADMIN_ROLE=true is set (user is admin), fetch all statuses; otherwise fetch publish only.
export async function GET() {
  const useAny = process.env.WP_ADMIN_ROLE === "true";
  const statuses = useAny ? ["any"] : ["publish", "draft"];
  const results: unknown[] = [];

  for (const status of statuses) {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await wpAdminFetch(
        `${WP_BASE}/wp-json/wp/v2/product?per_page=100&page=${page}&status=${status}`,
        { next: { revalidate: 0 } },
      );
      if (!res.ok) {
        const data = await parseWpBody(res);
        return NextResponse.json(data, { status: res.status });
      }
      results.push(...(await res.json()));
      totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
      page++;
    }
  }

  return NextResponse.json(results);
}

// POST /api/admin/products — create
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify(buildWPProductPayload(body)),
  });
  const data = await parseWpBody(res);
  return NextResponse.json(data, { status: res.status });
}

function normalizeLeadTimeDays(value: unknown) {
  if (value === "" || value === null || typeof value === "undefined") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildWPProductPayload(body: Record<string, unknown>) {
  const acf: Record<string, unknown> = {
    name_th: body.name_th ?? "",
    name_en: body.name_en ?? "",
    description_th: body.description_th ?? "",
    description_en: body.description_en ?? "",
    content_th: body.content_th ?? "",
    content_en: body.content_en ?? "",
    application_th: body.application_th ?? "",
    application_en: body.application_en ?? "",
    image_alt_th: body.image_alt_th ?? "",
    image_alt_en: body.image_alt_en ?? "",
    specs_json: body.specs_json ?? "",
    sku: body.sku ?? "",
    brand_name: body.brand_name ?? "",
    material: body.material ?? "",
    capacity: body.capacity ?? "",
    dimensions: body.dimensions ?? "",
    moq: body.moq ?? "",
    lead_time_days: normalizeLeadTimeDays(body.lead_time_days),
    canonical_url_th: body.canonical_url_th ?? "",
    canonical_url_en: body.canonical_url_en ?? "",
    seo_title_th: body.seo_title_th ?? "",
    seo_title_en: body.seo_title_en ?? "",
    seo_description_th: body.seo_description_th ?? "",
    seo_description_en: body.seo_description_en ?? "",
    focus_keyword_th: body.focus_keyword_th ?? "",
    focus_keyword_en: body.focus_keyword_en ?? "",
    og_title_th: body.og_title_th ?? "",
    og_title_en: body.og_title_en ?? "",
    og_description_th: body.og_description_th ?? "",
    og_description_en: body.og_description_en ?? "",
    robots_index: body.robots_index ?? true,
    robots_follow: body.robots_follow ?? true,
  };

  if (Array.isArray(body.related_products)) {
    acf.related_products = body.related_products;
  }

  return {
    title: body.name_th ?? body.name_en ?? "Untitled",
    status: body.status ?? "publish",
    featured_media: body.featured_media ?? 0,
    product_category: body.categoryIds ?? [],
    acf,
  };
}
