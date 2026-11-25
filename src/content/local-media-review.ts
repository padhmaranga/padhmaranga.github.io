import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Project } from "./projects";

type CaptionedImage = { file: string; alt: string; caption: string };
type ReviewMedia = {
  cover: CaptionedImage;
  videos: Project["videos"];
};

export async function localMediaReview(
  slug: string,
): Promise<Pick<Project, "cover" | "videos"> | undefined> {
  if (
    process.env.PORTFOLIO_LOCAL_MEDIA_REVIEW !== "1" ||
    process.env.NEXT_PUBLIC_SITE_URL
  )
    return;

  const directory = join(process.cwd(), "private", "media-review", "deck");
  const entries: Record<string, ReviewMedia> = JSON.parse(
    await readFile(join(directory, "local-review.json"), "utf8"),
  );
  const media = entries[slug];
  if (!media) return;

  const { file, ...cover } = media.cover;
  const image = await readFile(join(directory, file));
  return {
    cover: {
      ...cover,
      src: "data:image/webp;base64," + image.toString("base64"),
    },
    videos: media.videos,
  };
}
