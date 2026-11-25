import type { MetadataRoute } from "next";
import { absolute, siteUrl } from "@/lib/site";
import { projects, projectPath } from "@/content/projects";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    "/",
    "/about/",
    "/experience/",
    "/work/",
    "/research/",
    "/skills/",
    "/lab/",
    "/products/",
    "/writing/",
    "/education/",
    "/recruiter/",
    "/contact/",
    ...projects.map((project) => projectPath(project.slug)),
  ].map((path) => ({ url: absolute(path) }));
}
