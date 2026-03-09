import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    return [
      // www → non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.168innovative.co.th' }],
        destination: 'https://168innovative.co.th/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
