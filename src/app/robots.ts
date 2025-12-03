import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/*?embed=1"], // ⛔ Do NOT crawl embed views
      },
    ],
    sitemap: "https://indiagraphs.com/sitemap.xml",
    host: "https://indiagraphs.com",
  };
}