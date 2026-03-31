import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wb.168innovative.co.th",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1024, 1080, 1200, 1280, 1536, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
  },
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  async redirects() {
    const deprecatedCatalogSkus = [
      "BR-1001", "BR-1002",
      "CP-2001", "CP-2002", "CP-2003",
      "BT-3001", "BT-3002", "BT-3003",
      "TB-4001", "TB-4002",
      "CM-5001", "CM-5002",
    ];

    const catalogRedirects = deprecatedCatalogSkus.map((sku) => ({
      source: `/products/${sku}`,
      destination: "/categories",
      permanent: true,
    }));

    return [
      {
        source: "/products",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.168innovative.co.th" }],
        destination: "https://168innovative.co.th/:path*",
        permanent: true,
      },
      ...catalogRedirects,
    ];
  },
};

export default nextConfig;
