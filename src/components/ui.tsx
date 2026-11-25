import type { CSSProperties, ReactNode } from "react";
import { ArrowDown, ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { SiteLink as Link } from "@/components/site-link";
import { profile } from "@/content/profile";
import { publicAsset } from "@/lib/site";
import { HeroField } from "./three/hero-field";

export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {children && <div className="section-aside">{children}</div>}
    </header>
  );
}

export function PageHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <HeroField variant="page" seed={label + title} />
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </header>
  );
}

export function Action({
  href,
  children,
  variant = "outline",
  direction = "right",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "text";
  direction?: "right" | "down";
}) {
  return (
    <Link className={"action action-" + variant} href={href}>
      {children}
      {direction === "down" ? (
        <ArrowDown size={16} aria-hidden />
      ) : (
        <ArrowUpRight size={17} aria-hidden />
      )}
    </Link>
  );
}

export function CvLink() {
  return profile.cv ? (
    <a
      className="action action-outline"
      href={publicAsset(profile.cv)}
      download
    >
      Download CV <ArrowDownToLine size={16} aria-hidden />
    </a>
  ) : null;
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Topics">
      {items.map((item, index) => (
        <li key={item} style={{ "--i": index } as CSSProperties}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="action action-outline" href={href} rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={16} aria-hidden />
    </a>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
