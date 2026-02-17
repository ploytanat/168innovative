import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wb.168innovative.co.th",
      },
    ],
  },
};

export default nextConfig;
