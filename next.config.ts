import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",           // when visiting data.indiagraphs.com
        destination: "/graphs", // redirect target
        permanent: true,        // 308 SEO-safe redirect
      },
    ];
  },
};

export default nextConfig;