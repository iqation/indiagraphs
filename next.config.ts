import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "indiagraphs.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.indiagraphs.com",
        pathname: "/wp-content/uploads/**",
      }
    ],
  },

  async redirects() {
    return [];
  },
};

export default nextConfig;