import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",           // Allow crawling main site
      },
      {
        userAgent: "*",
        disallow: [
          "https://cms.indiagraphs.com/",   // Block crawling CMS domain
        ],
      },
    ],
    sitemap: "https://indiagraphs.com/sitemap.xml",
  };
}