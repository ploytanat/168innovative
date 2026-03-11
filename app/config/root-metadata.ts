import type { Metadata, Viewport } from "next"

import { SITE_URL } from "@/app/config/site"

const baseUrl = SITE_URL

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const siteRootMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "168 Innovative Co., Ltd.",
    template: "%s | 168 Innovative",
  },
  description:
    "168 Innovative imports and distributes cosmetic packaging, pump bottles, cream jars, spray bottles, and plastic products.",
  keywords: [
    "168 Innovative",
    "168 Innovative Co Ltd",
    "cosmetic packaging",
    "pump bottle",
    "cream jar",
    "spray bottle",
    "plastic packaging",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "168 Innovative Co., Ltd.",
    description:
      "Cosmetic packaging and plastic products imported directly from the factory.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
  },
}

export const adminRootMetadata: Metadata = {
  title: {
    default: "Admin | 168 Innovative",
    template: "%s | Admin | 168 Innovative",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.png",
  },
}
