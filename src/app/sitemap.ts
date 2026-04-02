import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://aziztebbeng.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://aziztebbeng.vercel.app/resume",
      lastModified: new Date(),
    },
  ];
}
