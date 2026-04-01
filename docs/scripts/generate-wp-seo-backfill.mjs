import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const outputDir = path.join(root, "docs", "acf-import", "backfill");
const SITE_URL = "https://168innovative.co.th";

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");

function loadEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const idx = line.indexOf("=");
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
      }),
  );
}

const env = loadEnv(envPath);
const WP_API_URL = env.WP_API_URL;
const WP_USERNAME = env.WP_USERNAME;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;

if (!WP_API_URL) {
  throw new Error("WP_API_URL missing in .env.local");
}

const authHeaders =
  WP_USERNAME && WP_APP_PASSWORD
    ? {
        Authorization: `Basic ${Buffer.from(
          `${WP_USERNAME}:${WP_APP_PASSWORD}`,
        ).toString("base64")}`,
      }
    : null;

function empty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function ensureUrl(pathname) {
  return `${SITE_URL}${pathname}`;
}

function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toParagraph(text = "") {
  const cleaned = String(text).trim();
  if (!cleaned) return "";
  return `<p>${escapeHtml(cleaned)}</p>`;
}

function estimateReadingMinutes(html = "") {
  const text = stripHtml(html);
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

async function fetchAll(endpoint, params = {}, perPage = 100) {
  const out = [];
  let page = 1;

  while (true) {
    const url = new URL(`${WP_API_URL}/wp-json/wp/v2/${endpoint}`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${endpoint} page ${page} failed: ${res.status}\n${text}`);
    }

    const data = await res.json();
    out.push(...data);

    const totalPages = Number(res.headers.get("X-WP-TotalPages") || 1);
    if (page >= totalPages) break;
    page += 1;
  }

  return out;
}

function buildProductPatch(item, categorySlug) {
  const acf = item.acf ?? {};
  const patch = {};

  if (empty(acf.canonical_url_th) && categorySlug) {
    patch.canonical_url_th = ensureUrl(`/categories/${categorySlug}/${item.slug}`);
  }
  if (empty(acf.canonical_url_en) && categorySlug) {
    patch.canonical_url_en = ensureUrl(`/en/categories/${categorySlug}/${item.slug}`);
  }
  if (empty(acf.og_title_th)) {
    patch.og_title_th = acf.seo_title_th || acf.name_th || item.title?.rendered || item.slug;
  }
  if (empty(acf.og_title_en)) {
    patch.og_title_en = acf.seo_title_en || acf.name_en || item.title?.rendered || item.slug;
  }
  if (empty(acf.og_description_th)) {
    patch.og_description_th = acf.seo_description_th || acf.description_th || "";
  }
  if (empty(acf.og_description_en)) {
    patch.og_description_en = acf.seo_description_en || acf.description_en || "";
  }
  if (empty(acf.og_image) && acf.image) {
    patch.og_image = acf.image;
  }
  if (empty(acf.content_th) && !empty(acf.description_th)) {
    patch.content_th = toParagraph(acf.description_th);
  }
  if (empty(acf.content_en) && !empty(acf.description_en)) {
    patch.content_en = toParagraph(acf.description_en);
  }
  if (empty(acf.focus_keyword_th) && !empty(acf.name_th)) {
    patch.focus_keyword_th = String(acf.name_th).trim();
  }
  if (empty(acf.focus_keyword_en)) {
    patch.focus_keyword_en = String(acf.name_en || item.title?.rendered || item.slug).trim();
  }
  if (acf.robots_index === undefined || acf.robots_index === null) {
    patch.robots_index = true;
  }
  if (acf.robots_follow === undefined || acf.robots_follow === null) {
    patch.robots_follow = true;
  }

  return patch;
}

function buildCategoryPatch(item) {
  const acf = item.acf ?? {};
  const patch = {};

  if (empty(acf.name_th)) {
    patch.name_th = item.name || item.slug;
  }
  if (empty(acf.canonical_url_th)) {
    patch.canonical_url_th = ensureUrl(`/categories/${item.slug}`);
  }
  if (empty(acf.canonical_url_en)) {
    patch.canonical_url_en = ensureUrl(`/en/categories/${item.slug}`);
  }
  if (empty(acf.image_alt_th)) {
    patch.image_alt_th = acf.name_th || item.name || item.slug;
  }
  if (empty(acf.image_alt_en)) {
    patch.image_alt_en = acf.name_en || item.name || item.slug;
  }
  if (empty(acf.intro_html_th) && !empty(acf.description_th)) {
    patch.intro_html_th = toParagraph(acf.description_th);
  }
  if (empty(acf.intro_html_en) && !empty(acf.description_en)) {
    patch.intro_html_en = toParagraph(acf.description_en);
  }
  if (empty(acf.focus_keyword_th)) {
    patch.focus_keyword_th = String(acf.name_th || item.name || item.slug).trim();
  }
  if (empty(acf.focus_keyword_en)) {
    patch.focus_keyword_en = String(acf.name_en || item.name || item.slug).trim();
  }
  if (empty(acf.og_title_th)) {
    patch.og_title_th = acf.seo_title_th || acf.name_th || item.name || item.slug;
  }
  if (empty(acf.og_title_en)) {
    patch.og_title_en = acf.seo_title_en || acf.name_en || item.name || item.slug;
  }
  if (empty(acf.og_description_th)) {
    patch.og_description_th = acf.seo_description_th || acf.description_th || "";
  }
  if (empty(acf.og_description_en)) {
    patch.og_description_en = acf.seo_description_en || acf.description_en || "";
  }
  if (acf.robots_index === undefined || acf.robots_index === null) {
    patch.robots_index = true;
  }
  if (acf.robots_follow === undefined || acf.robots_follow === null) {
    patch.robots_follow = true;
  }

  return patch;
}

function buildArticlePatch(item) {
  const acf = item.acf ?? {};
  const patch = {};
  const embeddedAuthor = item?._embedded?.author?.[0]?.name;

  if (empty(acf.seo_title_th)) {
    patch.seo_title_th = acf.title_th || item.title?.rendered || item.slug;
  }
  if (empty(acf.seo_title_en)) {
    patch.seo_title_en = acf.title_en || acf.title_th || item.title?.rendered || item.slug;
  }
  if (empty(acf.meta_description_th)) {
    patch.meta_description_th = acf.excerpt_th || stripHtml(acf.content_th || "").slice(0, 155);
  }
  if (empty(acf.meta_description_en)) {
    patch.meta_description_en = acf.excerpt_en || stripHtml(acf.content_en || "").slice(0, 155);
  }
  if (empty(acf.canonical_url_th)) {
    patch.canonical_url_th = ensureUrl(`/articles/${item.slug}`);
  }
  if (empty(acf.canonical_url_en)) {
    patch.canonical_url_en = ensureUrl(`/en/articles/${item.slug}`);
  }
  if (empty(acf.og_title_th)) {
    patch.og_title_th = acf.seo_title_th || acf.title_th || item.title?.rendered || item.slug;
  }
  if (empty(acf.og_title_en)) {
    patch.og_title_en = acf.seo_title_en || acf.title_en || acf.title_th || item.title?.rendered || item.slug;
  }
  if (empty(acf.og_description_th)) {
    patch.og_description_th =
      acf.meta_description_th || acf.excerpt_th || stripHtml(acf.content_th || "").slice(0, 155);
  }
  if (empty(acf.og_description_en)) {
    patch.og_description_en =
      acf.meta_description_en || acf.excerpt_en || stripHtml(acf.content_en || "").slice(0, 155);
  }
  if (empty(acf.og_image) && (acf.image || item.featured_media)) {
    patch.og_image = acf.image || item.featured_media;
  }
  if (empty(acf.author_name) && embeddedAuthor) {
    patch.author_name = embeddedAuthor;
  }
  if (empty(acf.reading_time_minutes)) {
    patch.reading_time_minutes = estimateReadingMinutes(acf.content_en || acf.content_th || "");
  }
  if (empty(acf.focus_keyword_th)) {
    patch.focus_keyword_th = String(acf.focus_keyword || acf.title_th || item.title?.rendered || item.slug).trim();
  }
  if (empty(acf.focus_keyword_en)) {
    patch.focus_keyword_en = String(acf.focus_keyword || acf.title_en || acf.title_th || item.title?.rendered || item.slug).trim();
  }
  if (acf.robots_index === undefined || acf.robots_index === null) {
    patch.robots_index = true;
  }
  if (acf.robots_follow === undefined || acf.robots_follow === null) {
    patch.robots_follow = true;
  }

  return patch;
}

function buildAboutPatch(item) {
  const acf = item.acf ?? {};
  const patch = {};

  if (empty(acf.hero_image_2_alt_en)) {
    patch.hero_image_2_alt_en =
      acf.hero_image_2_alt_th || acf.hero_title_en || acf.hero_title_th || "About image";
  }
  if (empty(acf.canonical_url_th)) {
    patch.canonical_url_th = ensureUrl("/about");
  }
  if (empty(acf.canonical_url_en)) {
    patch.canonical_url_en = ensureUrl("/en/about");
  }
  if (empty(acf.og_title_th)) {
    patch.og_title_th = acf.seo_title_th || acf.hero_title_th || "About";
  }
  if (empty(acf.og_title_en)) {
    patch.og_title_en = acf.seo_title_en || acf.hero_title_en || acf.hero_title_th || "About";
  }
  if (empty(acf.og_description_th)) {
    patch.og_description_th = acf.seo_description_th || acf.hero_description_th || "";
  }
  if (empty(acf.og_description_en)) {
    patch.og_description_en = acf.seo_description_en || acf.hero_description_en || "";
  }
  if (empty(acf.og_image) && (acf.hero_image_1 || acf.hero_image_2 || acf.who_image)) {
    patch.og_image = acf.hero_image_1 || acf.hero_image_2 || acf.who_image;
  }
  if (acf.robots_index === undefined || acf.robots_index === null) {
    patch.robots_index = true;
  }
  if (acf.robots_follow === undefined || acf.robots_follow === null) {
    patch.robots_follow = true;
  }

  return patch;
}

function buildHomePatch(item) {
  const acf = item.acf ?? {};
  const patch = {};

  if (empty(acf.hero_image_alt_th)) {
    patch.hero_image_alt_th = acf.hero_title_th || "Home hero";
  }
  if (empty(acf.hero_image_alt_en)) {
    patch.hero_image_alt_en = acf.hero_title_en || acf.hero_title_th || "Home hero";
  }
  if (empty(acf.seo_title_th)) {
    patch.seo_title_th = acf.hero_title_th || "168 Innovative";
  }
  if (empty(acf.seo_title_en)) {
    patch.seo_title_en = acf.hero_title_en || acf.hero_title_th || "168 Innovative";
  }
  if (empty(acf.seo_description_th)) {
    patch.seo_description_th = acf.hero_description_th || "";
  }
  if (empty(acf.seo_description_en)) {
    patch.seo_description_en = acf.hero_description_en || acf.hero_description_th || "";
  }
  if (empty(acf.canonical_url_th)) {
    patch.canonical_url_th = ensureUrl("/");
  }
  if (empty(acf.canonical_url_en)) {
    patch.canonical_url_en = ensureUrl("/en");
  }
  if (empty(acf.og_title_th)) {
    patch.og_title_th = acf.seo_title_th || acf.hero_title_th || "168 Innovative";
  }
  if (empty(acf.og_title_en)) {
    patch.og_title_en = acf.seo_title_en || acf.hero_title_en || "168 Innovative";
  }
  if (empty(acf.og_description_th)) {
    patch.og_description_th = acf.seo_description_th || acf.hero_description_th || "";
  }
  if (empty(acf.og_description_en)) {
    patch.og_description_en =
      acf.seo_description_en || acf.hero_description_en || acf.hero_description_th || "";
  }
  if (empty(acf.og_image) && acf.hero_image) {
    patch.og_image = acf.hero_image;
  }
  if (acf.robots_index === undefined || acf.robots_index === null) {
    patch.robots_index = true;
  }
  if (acf.robots_follow === undefined || acf.robots_follow === null) {
    patch.robots_follow = true;
  }

  return patch;
}

function withPatchMeta(item, endpoint, patch) {
  return {
    id: item.id,
    slug: item.slug,
    endpoint,
    patch,
    patchFieldCount: Object.keys(patch).length,
  };
}

async function updateItem(endpoint, id, patch) {
  if (!authHeaders) {
    throw new Error("WP auth credentials missing");
  }

  const url = `${WP_API_URL}/wp-json/wp/v2/${endpoint}/${id}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ acf: patch }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${endpoint}/${id} failed: ${res.status}\n${text}`);
  }

  return res.json();
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const [products, categories, articles, aboutItems, homePages] = await Promise.all([
    fetchAll("product"),
    fetchAll("product_category"),
    fetchAll("article", { _embed: "1" }),
    fetchAll("about"),
    fetchAll("pages", { slug: "home" }),
  ]);

  const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item.slug]));

  const productPatches = products
    .map((item) =>
      withPatchMeta(
        item,
        "product",
        buildProductPatch(item, categoryMap[item.product_category?.[0]]),
      ),
    )
    .filter((item) => item.patchFieldCount > 0);

  const categoryPatches = categories
    .map((item) => withPatchMeta(item, "product_category", buildCategoryPatch(item)))
    .filter((item) => item.patchFieldCount > 0);

  const articlePatches = articles
    .map((item) => withPatchMeta(item, "article", buildArticlePatch(item)))
    .filter((item) => item.patchFieldCount > 0);

  const aboutPatches = aboutItems
    .map((item) => withPatchMeta(item, "about", buildAboutPatch(item)))
    .filter((item) => item.patchFieldCount > 0);

  const homePatches = homePages
    .map((item) => withPatchMeta(item, "pages", buildHomePatch(item)))
    .filter((item) => item.patchFieldCount > 0);

  const plan = {
    generatedAt: new Date().toISOString(),
    source: WP_API_URL,
    mode: shouldApply ? "apply" : "dry-run",
    totals: {
      products: productPatches.length,
      categories: categoryPatches.length,
      articles: articlePatches.length,
      about: aboutPatches.length,
      home: homePatches.length,
    },
    patches: {
      products: productPatches,
      categories: categoryPatches,
      articles: articlePatches,
      about: aboutPatches,
      home: homePatches,
    },
  };

  fs.writeFileSync(
    path.join(outputDir, "wp-seo-backfill-plan.json"),
    JSON.stringify(plan, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outputDir, "products-patches.json"),
    JSON.stringify(productPatches, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outputDir, "categories-patches.json"),
    JSON.stringify(categoryPatches, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outputDir, "articles-patches.json"),
    JSON.stringify(articlePatches, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outputDir, "about-patches.json"),
    JSON.stringify(aboutPatches, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outputDir, "home-patches.json"),
    JSON.stringify(homePatches, null, 2) + "\n",
  );

  console.log(JSON.stringify(plan.totals, null, 2));

  if (!shouldApply) {
    return;
  }

  const batches = [
    ...productPatches,
    ...categoryPatches,
    ...articlePatches,
    ...aboutPatches,
    ...homePatches,
  ];

  const applied = [];
  const failed = [];

  for (const item of batches) {
    try {
      await updateItem(item.endpoint, item.id, item.patch);
      applied.push({ endpoint: item.endpoint, id: item.id, slug: item.slug });
      console.log(`Applied ${item.endpoint}/${item.id} ${item.slug}`);
    } catch (error) {
      failed.push({
        endpoint: item.endpoint,
        id: item.id,
        slug: item.slug,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`Failed ${item.endpoint}/${item.id} ${item.slug}`);
    }
  }

  fs.writeFileSync(
    path.join(outputDir, "apply-result.json"),
    JSON.stringify({ applied, failed }, null, 2) + "\n",
  );

  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
