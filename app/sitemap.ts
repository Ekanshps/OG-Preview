import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { blogs } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about/", "/developer/", "/contact/", "/privacy/", "/terms/", "/blog/"];
  return [
    ...staticPages.map((path) => ({ url: `${SITE_URL}${path || "/"}`, lastModified: new Date("2026-10-30"), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : path === "/blog/" ? 0.8 : 0.5 })),
    ...blogs.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}/`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: post.category === "Tool guide" ? 0.8 : 0.7 })),
  ];
}
