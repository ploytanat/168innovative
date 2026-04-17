import type { Metadata } from "next"

import OrganicStoreHome from "@/components/OrganicStoreHome"
import { getOrganicHomepageData } from "@/lib/api/home"

export const metadata: Metadata = {
  title: "Organic E-commerce Homepage Template",
  description:
    "Discover our curated selection of premium, responsibly sourced organic products for a healthier lifestyle.",
}

export default async function HomePage() {
  const data = await getOrganicHomepageData("th")

  return <OrganicStoreHome data={data} />
}
