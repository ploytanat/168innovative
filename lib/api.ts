// lib/api.ts
import type { Home } from "../types/home";

import { home } from "./mock/home";
import { products } from "./mock/products";
import { categories } from "./mock/categories";
import { whyChooseUs } from "./mock/why";

/**
 * FLAG กลาง
 * วันไหนต่อ WordPress → เปลี่ยนเป็น false
 */
const USE_MOCK = true;

/* ======================
   HOME
====================== */
export async function getHome(): Promise<Home> {
  if (USE_MOCK) {
    return home;
  }
throw new Error("home data not found")
  // 🔮 future: WordPress API
  // const res = await fetch(`${CMS_URL}/wp-json/...`);
  // return mapHome(res);
}

/* ======================
   PRODUCTS
====================== */
export async function getProducts() {
  if (USE_MOCK) {
    return products;
  }

  // 🔮 future: WordPress API
}

export async function getProductBySlug(slug: string) {
  if (USE_MOCK) {
    return products.find((p) => p.slug === slug) || null;
  }

  // 🔮 future: WordPress API
}

/* ======================
   CATEGORIES
====================== */
export async function getCategories() {
  if (USE_MOCK) {
    return categories;
  }

  // 🔮 future: WordPress API
}

export async function getProductsByCategory(slug: string) {
  if (USE_MOCK) {
    return products.filter(
      (p) => p.category.slug === slug
    );
  }

  // 🔮 future: WordPress API
}

/* ======================
   WHY CHOOSE US
====================== */
export async function getWhy() {
  if (USE_MOCK) {
    return whyChooseUs;
  }

  // 🔮 future: WordPress API
}
