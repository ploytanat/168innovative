import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wb.168innovative.co.th",
      },
    ],
    // Optimize image delivery - include JPEG for iPad compatibility
    formats: ['image/avif', 'image/webp', 'image/jpeg'],
    // Optimized sizes for various devices including iPad
    deviceSizes: [640, 750, 828, 1024, 1080, 1200, 1280, 1536, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
  },
  reactStrictMode: true,
  // Enable SWR revalidation to avoid waterfall on dynamic routes
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
