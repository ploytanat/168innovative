import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Keep Next/Image layout/lazy-loading behavior without using Vercel Image Optimization quota.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wb.168innovative.co.th",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1024, 1080, 1200, 1280, 1536, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
  },
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  async redirects() {
    // Old catalog mock SKUs that may have been indexed by search engines.
    // 301 permanent → /products so Google transfers link equity to the new catalog.
    const deprecatedCatalogSkus = [
      'BR-1001', 'BR-1002',
      'CP-2001', 'CP-2002', 'CP-2003',
      'BT-3001', 'BT-3002', 'BT-3003',
      'TB-4001', 'TB-4002',
      'CM-5001', 'CM-5002',
    ]

    const catalogRedirects = deprecatedCatalogSkus.map((sku) => ({
      source: `/products/${sku}`,
      destination: '/products',
      permanent: true,
    }))

    return [
      // www → non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.168innovative.co.th' }],
        destination: 'https://168innovative.co.th/:path*',
        permanent: true,
      },
      ...catalogRedirects,
    ];
  },
};

export default nextConfig;
