import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const xmlPath = path.join(root, "docs", "168innovativecms.WordPress.2026-03-10.xml");
const outputDir = path.join(root, "docs", "acf-import");
const localJsonDir = path.join(outputDir, "local-json");
const modified = Math.floor(Date.now() / 1000);
const wrapper = { width: "", class: "", id: "" };

const groupOrder = [
  "Product Fields",
  "Home - Hero Section",
  "Hero Slide Fields",
  "Product Category Fields",
  "Why Fields",
  "Company Fields",
  "About Fields",
  "Article Fields",
];

const locations = {
  "Product Fields": [[{ param: "post_type", operator: "==", value: "product" }]],
  "Home - Hero Section": [[{ param: "page_type", operator: "==", value: "front_page" }]],
  "Hero Slide Fields": [[{ param: "post_type", operator: "==", value: "hero_slide" }]],
  "Product Category Fields": [[{ param: "taxonomy", operator: "==", value: "product_category" }]],
  "Why Fields": [[{ param: "post_type", operator: "==", value: "why" }]],
  "Company Fields": [[{ param: "post_type", operator: "==", value: "company" }]],
  "About Fields": [[{ param: "post_type", operator: "==", value: "about" }]],
  "Article Fields": [[{ param: "post_type", operator: "==", value: "article" }]],
};

function escapeTag(tag) {
  return tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTagValue(block, tag) {
  const pattern = new RegExp(
    `<${escapeTag(tag)}(?: [^>]*)?>\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*<\\/${escapeTag(tag)}>`,
    "i",
  );
  const match = block.match(pattern);
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function getSerializedType(serialized) {
  return serialized.match(/s:\d+:"type";s:\d+:"([^"]*)";/i)?.[1] ?? "";
}

function getSerializedRequired(serialized) {
  return Number(serialized.match(/s:\d+:"required";i:(\d+);/i)?.[1] ?? 0);
}

function baseField({ key, label, name, type, required = 0, instructions = "" }) {
  return {
    key,
    label,
    name,
    "aria-label": "",
    type,
    instructions,
    required,
    conditional_logic: 0,
    wrapper: { ...wrapper },
  };
}

function textField(config) {
  return {
    ...baseField({ ...config, type: "text" }),
    default_value: "",
    maxlength: "",
    allow_in_bindings: 0,
    placeholder: "",
    prepend: "",
    append: "",
  };
}

function textareaField(config) {
  return {
    ...baseField({ ...config, type: "textarea" }),
    default_value: "",
    maxlength: "",
    allow_in_bindings: 0,
    rows: config.rows ?? 4,
    placeholder: "",
    new_lines: "",
  };
}

function wysiwygField(config) {
  return {
    ...baseField({ ...config, type: "wysiwyg" }),
    default_value: "",
    tabs: "all",
    toolbar: config.toolbar ?? "full",
    media_upload: 1,
    delay: 0,
  };
}

function imageField(config) {
  return {
    ...baseField({ ...config, type: "image" }),
    return_format: "array",
    library: "all",
    min_width: "",
    min_height: "",
    min_size: "",
    max_width: "",
    max_height: "",
    max_size: "",
    mime_types: "",
    allow_in_bindings: 0,
    preview_size: "medium",
  };
}

function urlField(config) {
  return {
    ...baseField({ ...config, type: "url" }),
    default_value: "",
    allow_in_bindings: 0,
    placeholder: "https://",
  };
}

function numberField(config) {
  return {
    ...baseField({ ...config, type: "number" }),
    default_value: "",
    min: "",
    max: "",
    allow_in_bindings: 0,
    placeholder: "",
    step: "",
  };
}

function emailField(config) {
  return {
    ...baseField({ ...config, type: "email" }),
    default_value: "",
    allow_in_bindings: 0,
    placeholder: "",
    prepend: "",
    append: "",
  };
}

function trueFalseField(config) {
  return {
    ...baseField({ ...config, type: "true_false" }),
    message: "",
    default_value: config.defaultValue ?? 1,
    allow_in_bindings: 0,
    ui: 1,
    ui_on_text: "",
    ui_off_text: "",
  };
}

function selectField(config) {
  return {
    ...baseField({ ...config, type: "select" }),
    choices: config.choices,
    default_value: "",
    return_format: "value",
    multiple: 0,
    allow_null: 1,
    allow_in_bindings: 0,
    ui: 1,
    ajax: 0,
    placeholder: "",
  };
}

function relationshipField(config) {
  return {
    ...baseField({ ...config, type: "relationship" }),
    post_type: config.postTypes,
    taxonomy: [],
    filters: ["search", "post_type"],
    elements: "",
    min: "",
    max: "",
    return_format: "id",
    bidirectional: 0,
    bidirectional_target: [],
  };
}

function repeaterField(config) {
  return {
    ...baseField({ ...config, type: "repeater" }),
    layout: "table",
    pagination: 0,
    min: 0,
    max: 0,
    collapsed: "",
    button_label: config.buttonLabel ?? "Add Row",
    rows_per_page: 20,
    sub_fields: config.subFields,
  };
}

function faqRepeater(key, name = "faq_items", label = "FAQ Items") {
  return repeaterField({
    key,
    name,
    label,
    buttonLabel: "Add FAQ Item",
    subFields: [
      textField({ key: `${key}_q_th`, label: "Question TH", name: "question_th", required: 1 }),
      textField({ key: `${key}_q_en`, label: "Question EN", name: "question_en", required: 1 }),
      wysiwygField({
        key: `${key}_a_th`,
        label: "Answer TH",
        name: "answer_th",
        required: 1,
        toolbar: "basic",
      }),
      wysiwygField({
        key: `${key}_a_en`,
        label: "Answer EN",
        name: "answer_en",
        required: 1,
        toolbar: "basic",
      }),
    ],
  });
}

function buildExistingField(field) {
  const base = {
    key: field.key,
    label: field.label,
    name: field.name,
    required: field.required,
  };

  switch (field.type) {
    case "textarea":
      return textareaField(base);
    case "image":
      return imageField(base);
    case "email":
      return emailField(base);
    case "url":
      return urlField(base);
    case "number":
      return numberField(base);
    case "wysiwyg":
      return wysiwygField(base);
    default:
      return textField(base);
  }
}

function buildGroup({ key, title, description, fields }) {
  return {
    key,
    title,
    fields,
    location: locations[title],
    menu_order: 0,
    position: "normal",
    style: "default",
    label_placement: "top",
    instruction_placement: "label",
    hide_on_screen: "",
    active: true,
    description,
    show_in_rest: 1,
    modified,
  };
}

const xml = fs.readFileSync(xmlPath, "utf8");
const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

const groupsById = new Map();
const fieldsByParent = new Map();

for (const item of items) {
  const postType = getTagValue(item, "wp:post_type");
  if (postType === "acf-field-group") {
    const id = getTagValue(item, "wp:post_id");
    groupsById.set(id, {
      id,
      key: getTagValue(item, "wp:post_name"),
      title: getTagValue(item, "title"),
    });
  }

  if (postType === "acf-field") {
    const parent = getTagValue(item, "wp:post_parent");
    const serialized = getTagValue(item, "content:encoded");
    const field = {
      key: getTagValue(item, "wp:post_name"),
      label: getTagValue(item, "title"),
      name: getTagValue(item, "excerpt:encoded"),
      order: Number(getTagValue(item, "wp:menu_order") || 0),
      type: getSerializedType(serialized) || "text",
      required: getSerializedRequired(serialized),
    };
    const list = fieldsByParent.get(parent) ?? [];
    list.push(field);
    fieldsByParent.set(parent, list);
  }
}

const extraFields = {
  "Product Fields": [
    wysiwygField({ key: "field_168_product_content_th", label: "Content TH", name: "content_th" }),
    wysiwygField({ key: "field_168_product_content_en", label: "Content EN", name: "content_en" }),
    textField({ key: "field_168_product_sku", label: "SKU", name: "sku" }),
    textField({ key: "field_168_product_brand_name", label: "Brand Name", name: "brand_name" }),
    textField({ key: "field_168_product_material", label: "Material", name: "material" }),
    textField({ key: "field_168_product_capacity", label: "Capacity", name: "capacity" }),
    textField({ key: "field_168_product_dimensions", label: "Dimensions", name: "dimensions" }),
    textField({ key: "field_168_product_moq", label: "MOQ", name: "moq" }),
    numberField({ key: "field_168_product_lead_time_days", label: "Lead Time Days", name: "lead_time_days" }),
    selectField({
      key: "field_168_product_availability_status",
      label: "Availability Status",
      name: "availability_status",
      choices: { in_stock: "In stock", preorder: "Pre-order", out_of_stock: "Out of stock" },
    }),
    relationshipField({
      key: "field_168_product_related_products",
      label: "Related Products",
      name: "related_products",
      postTypes: ["product"],
    }),
    relationshipField({
      key: "field_168_product_related_articles",
      label: "Related Articles",
      name: "related_articles",
      postTypes: ["article"],
    }),
    urlField({ key: "field_168_product_canonical_url_th", label: "Canonical URL TH", name: "canonical_url_th" }),
    urlField({ key: "field_168_product_canonical_url_en", label: "Canonical URL EN", name: "canonical_url_en" }),
    textField({ key: "field_168_product_focus_keyword_th", label: "Focus Keyword TH", name: "focus_keyword_th" }),
    textField({ key: "field_168_product_focus_keyword_en", label: "Focus Keyword EN", name: "focus_keyword_en" }),
    textField({ key: "field_168_product_og_title_th", label: "OG Title TH", name: "og_title_th" }),
    textField({ key: "field_168_product_og_title_en", label: "OG Title EN", name: "og_title_en" }),
    textareaField({
      key: "field_168_product_og_description_th",
      label: "OG Description TH",
      name: "og_description_th",
    }),
    textareaField({
      key: "field_168_product_og_description_en",
      label: "OG Description EN",
      name: "og_description_en",
    }),
    imageField({ key: "field_168_product_og_image", label: "OG Image", name: "og_image" }),
    trueFalseField({ key: "field_168_product_robots_index", label: "Robots Index", name: "robots_index" }),
    trueFalseField({ key: "field_168_product_robots_follow", label: "Robots Follow", name: "robots_follow" }),
    faqRepeater("field_168_product_faq_items"),
  ],
  "Home - Hero Section": [
    textField({ key: "field_168_home_hero_image_alt_th", label: "Hero Image Alt TH", name: "hero_image_alt_th" }),
    textField({ key: "field_168_home_hero_image_alt_en", label: "Hero Image Alt EN", name: "hero_image_alt_en" }),
    textField({ key: "field_168_home_seo_title_th", label: "SEO Title TH", name: "seo_title_th" }),
    textField({ key: "field_168_home_seo_title_en", label: "SEO Title EN", name: "seo_title_en" }),
    textareaField({
      key: "field_168_home_seo_description_th",
      label: "SEO Description TH",
      name: "seo_description_th",
    }),
    textareaField({
      key: "field_168_home_seo_description_en",
      label: "SEO Description EN",
      name: "seo_description_en",
    }),
    urlField({ key: "field_168_home_canonical_url_th", label: "Canonical URL TH", name: "canonical_url_th" }),
    urlField({ key: "field_168_home_canonical_url_en", label: "Canonical URL EN", name: "canonical_url_en" }),
    textField({ key: "field_168_home_og_title_th", label: "OG Title TH", name: "og_title_th" }),
    textField({ key: "field_168_home_og_title_en", label: "OG Title EN", name: "og_title_en" }),
    textareaField({
      key: "field_168_home_og_description_th",
      label: "OG Description TH",
      name: "og_description_th",
    }),
    textareaField({
      key: "field_168_home_og_description_en",
      label: "OG Description EN",
      name: "og_description_en",
    }),
    imageField({ key: "field_168_home_og_image", label: "OG Image", name: "og_image" }),
    trueFalseField({ key: "field_168_home_robots_index", label: "Robots Index", name: "robots_index" }),
    trueFalseField({ key: "field_168_home_robots_follow", label: "Robots Follow", name: "robots_follow" }),
  ],
  "Product Category Fields": [
    textField({ key: "field_69940ca2c9629", label: "Name TH", name: "name_th", required: 1 }),
    wysiwygField({ key: "field_168_category_intro_html_th", label: "Intro HTML TH", name: "intro_html_th" }),
    wysiwygField({ key: "field_168_category_intro_html_en", label: "Intro HTML EN", name: "intro_html_en" }),
    textField({ key: "field_168_category_image_alt_th", label: "Image Alt TH", name: "image_alt_th" }),
    textField({ key: "field_168_category_image_alt_en", label: "Image Alt EN", name: "image_alt_en" }),
    urlField({ key: "field_168_category_canonical_url_th", label: "Canonical URL TH", name: "canonical_url_th" }),
    urlField({ key: "field_168_category_canonical_url_en", label: "Canonical URL EN", name: "canonical_url_en" }),
    textField({ key: "field_168_category_focus_keyword_th", label: "Focus Keyword TH", name: "focus_keyword_th" }),
    textField({ key: "field_168_category_focus_keyword_en", label: "Focus Keyword EN", name: "focus_keyword_en" }),
    textField({ key: "field_168_category_og_title_th", label: "OG Title TH", name: "og_title_th" }),
    textField({ key: "field_168_category_og_title_en", label: "OG Title EN", name: "og_title_en" }),
    textareaField({
      key: "field_168_category_og_description_th",
      label: "OG Description TH",
      name: "og_description_th",
    }),
    textareaField({
      key: "field_168_category_og_description_en",
      label: "OG Description EN",
      name: "og_description_en",
    }),
    imageField({ key: "field_168_category_og_image", label: "OG Image", name: "og_image" }),
    relationshipField({
      key: "field_168_category_featured_products",
      label: "Featured Products",
      name: "featured_products",
      postTypes: ["product"],
    }),
    relationshipField({
      key: "field_168_category_related_articles",
      label: "Related Articles",
      name: "related_articles",
      postTypes: ["article"],
    }),
    trueFalseField({ key: "field_168_category_robots_index", label: "Robots Index", name: "robots_index" }),
    trueFalseField({ key: "field_168_category_robots_follow", label: "Robots Follow", name: "robots_follow" }),
    faqRepeater("field_168_category_faq_items"),
  ],
  "Why Fields": [
    textField({ key: "field_168_why_image_alt_th", label: "Image Alt TH", name: "image_alt_th" }),
    textField({ key: "field_168_why_image_alt_en", label: "Image Alt EN", name: "image_alt_en" }),
  ],
  "About Fields": [
    urlField({ key: "field_168_about_canonical_url_th", label: "Canonical URL TH", name: "canonical_url_th" }),
    urlField({ key: "field_168_about_canonical_url_en", label: "Canonical URL EN", name: "canonical_url_en" }),
    textField({ key: "field_168_about_og_title_th", label: "OG Title TH", name: "og_title_th" }),
    textField({ key: "field_168_about_og_title_en", label: "OG Title EN", name: "og_title_en" }),
    textareaField({
      key: "field_168_about_og_description_th",
      label: "OG Description TH",
      name: "og_description_th",
    }),
    textareaField({
      key: "field_168_about_og_description_en",
      label: "OG Description EN",
      name: "og_description_en",
    }),
    imageField({ key: "field_168_about_og_image", label: "OG Image", name: "og_image" }),
    trueFalseField({ key: "field_168_about_robots_index", label: "Robots Index", name: "robots_index" }),
    trueFalseField({ key: "field_168_about_robots_follow", label: "Robots Follow", name: "robots_follow" }),
  ],
  "Article Fields": [
    textField({ key: "field_168_article_author_name", label: "Author Name", name: "author_name" }),
    numberField({
      key: "field_168_article_reading_time_minutes",
      label: "Reading Time Minutes",
      name: "reading_time_minutes",
    }),
    textField({ key: "field_168_article_focus_keyword_th", label: "Focus Keyword TH", name: "focus_keyword_th" }),
    textField({ key: "field_168_article_focus_keyword_en", label: "Focus Keyword EN", name: "focus_keyword_en" }),
    textField({ key: "field_168_article_og_title_th", label: "OG Title TH", name: "og_title_th" }),
    textField({ key: "field_168_article_og_title_en", label: "OG Title EN", name: "og_title_en" }),
    textareaField({
      key: "field_168_article_og_description_th",
      label: "OG Description TH",
      name: "og_description_th",
    }),
    textareaField({
      key: "field_168_article_og_description_en",
      label: "OG Description EN",
      name: "og_description_en",
    }),
    imageField({ key: "field_168_article_og_image", label: "OG Image", name: "og_image" }),
    relationshipField({
      key: "field_168_article_related_products",
      label: "Related Products",
      name: "related_products",
      postTypes: ["product"],
    }),
    relationshipField({
      key: "field_168_article_related_articles",
      label: "Related Articles",
      name: "related_articles",
      postTypes: ["article"],
    }),
    faqRepeater("field_168_article_faq_items"),
    trueFalseField({ key: "field_168_article_robots_index", label: "Robots Index", name: "robots_index" }),
    trueFalseField({ key: "field_168_article_robots_follow", label: "Robots Follow", name: "robots_follow" }),
  ],
};

const descriptions = {
  "Product Fields":
    "Import-safe update of the existing Product Fields group with SEO and long-form content fields.",
  "Home - Hero Section":
    "Front-page fields. The location rule is set to the configured front page instead of a fixed page ID.",
  "Hero Slide Fields": "Existing hero slide fields preserved for direct import.",
  "Product Category Fields":
    "Adds the missing official name_th field and SEO extensions while preserving current keys.",
  "Why Fields": "Existing Why fields plus optional localized image alt fields.",
  "Company Fields": "Company singleton fields preserved for direct import.",
  "About Fields":
    "Preserves current About fields and fixes the duplicate hero_image_1_alt_en field by converting the second copy into hero_image_2_alt_en.",
  "Article Fields":
    "Extends the current bilingual article model with author, FAQ, localized focus keywords, OG, and robots fields.",
};

const groups = groupOrder.map((title) => {
  const groupMeta = [...groupsById.values()].find((item) => item.title === title);
  if (!groupMeta) {
    throw new Error(`Missing field group in export: ${title}`);
  }

  let fields = (fieldsByParent.get(groupMeta.id) ?? [])
    .sort((a, b) => a.order - b.order)
    .map((field) => {
      if (
        title === "Article Fields" &&
        (field.name === "canonical_url_th" || field.name === "canonical_url_en")
      ) {
        return urlField(field);
      }

      if (title === "About Fields" && field.key === "field_699584280a900") {
        return buildExistingField({
          ...field,
          label: "Hero Image 2 Alt EN",
          name: "hero_image_2_alt_en",
        });
      }

      if (title === "Company Fields" && field.key === "field_699c10135eba0") {
        return buildExistingField({
          ...field,
          label: "Email 3",
          name: "email_3",
        });
      }

      return buildExistingField(field);
    });

  if (title === "Product Category Fields") {
    fields = [
      ...extraFields[title].slice(0, 1),
      ...fields,
      ...extraFields[title].slice(1),
    ];
  } else {
    fields = [...fields, ...(extraFields[title] ?? [])];
  }

  return buildGroup({
    key: groupMeta.key,
    title,
    description: descriptions[title],
    fields,
  });
});

fs.mkdirSync(localJsonDir, { recursive: true });

const bundlePath = path.join(outputDir, "168innovative-acf-field-groups.json");
fs.writeFileSync(bundlePath, JSON.stringify(groups, null, 2) + "\n");

for (const group of groups) {
  fs.writeFileSync(
    path.join(localJsonDir, `${group.key}.json`),
    JSON.stringify(group, null, 2) + "\n",
  );
}

console.log(`Wrote ${bundlePath}`);
console.log(`Wrote ${groups.length} local JSON files to ${localJsonDir}`);
