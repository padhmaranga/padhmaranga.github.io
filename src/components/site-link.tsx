import type { ComponentProps } from "react";
import { publicAsset } from "@/lib/site";

export function SiteLink({
  href,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  return <a href={publicAsset(href)} {...props} />;
}
