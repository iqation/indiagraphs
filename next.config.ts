import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return []; // empty list = no active redirects
  },
};

export default nextConfig;