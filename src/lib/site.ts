import type { Metadata } from "next";
import { profile } from "@/content/profile";

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
export const indexable = Boolean(siteUrl && profile.identityVerified);
export const publicAsset = (path: string) => basePath + path;
export const absolute = (path: string) =>
  siteUrl ? siteUrl + basePath + path : publicAsset(path);

export function meta(
  title: string,
  description: string,
  path: string,
): Metadata {
  const image = absolute("/visuals/share.png");
  return {
    title,
    description,
    alternates: siteUrl ? { canonical: absolute(path) } : undefined,
    openGraph: {
      title,
      description,
      siteName: profile.name,
      url: siteUrl ? absolute(path) : undefined,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Padhmaranga Rajarathne, engineering portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
