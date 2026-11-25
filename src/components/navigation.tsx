"use client";

import { useEffect, useRef, useState } from "react";
import { SiteLink as Link } from "@/components/site-link";
import { ArrowDownToLine, ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { basePath, publicAsset } from "@/lib/site";

const links: { label: string; route: string; section?: string }[] = [
  { label: "Home", route: "/", section: "home" },
  { label: "Projects", route: "/work/", section: "work" },
  { label: "Experience", route: "/experience/", section: "experience" },
  { label: "Skills", route: "/skills/" },
  { label: "About", route: "/about/", section: "about" },
  { label: "Writing", route: "/writing/" },
  { label: "Contact", route: "/contact/", section: "contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  const home = pathname === "/";

  useEffect(() => {
    if (!home) return;
    let scheduled = 0;
    const measure = () => {
      scheduled = 0;
      const anchor = Math.min(window.innerHeight * 0.31, 260);
      const sections = links
        .map((link) => link.section && document.getElementById(link.section))
        .filter((item): item is HTMLElement => Boolean(item))
        .sort((a, b) => a.offsetTop - b.offsetTop);
      const active = sections.findLast(
        (item) => item.getBoundingClientRect().top <= anchor,
      );
      setSection(active?.id ?? "home");
    };
    const onScroll = () => {
      if (!scheduled) scheduled = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(scheduled);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [home]);

  function active(route: string, id?: string) {
    return home
      ? section === id
      : route !== "/" &&
          pathname.startsWith(
            route.replace(/\/$/, "") +
              (pathname === route.replace(/\/$/, "") ? "" : "/"),
          );
  }

  return (
    <header
      className="site-header wrap"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <Link
        className="brand"
        href="/"
        aria-label={profile.initials + ". " + profile.name + " home"}
        onClick={() => setOpen(false)}
      >
        {profile.initials}
        <span>.</span>
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-controls="primary-nav"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        ref={toggle}
        onClick={() => setOpen(!open)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>
      <nav
        id="primary-nav"
        className={open ? "site-nav is-open" : "site-nav"}
        aria-label="Main navigation"
      >
        {links.map(({ label, route, section: id }) =>
          home && id ? (
            <a
              key={route}
              href={basePath + "/#" + id}
              aria-current={active(route, id) ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ) : (
            <Link
              key={route}
              href={route}
              aria-current={active(route, id) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ),
        )}
      </nav>
      {profile.cv ? (
        <a className="nav-cta" href={publicAsset(profile.cv)} download>
          Download CV <ArrowDownToLine size={15} aria-hidden />
        </a>
      ) : (
        <Link
          className="nav-cta"
          href="/recruiter/"
          onClick={() => setOpen(false)}
        >
          Recruiter overview <ArrowUpRight size={15} aria-hidden />
        </Link>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <Link
        className="brand"
        href="/"
        aria-label={profile.initials + ". " + profile.name + " home"}
      >
        {profile.initials}
        <span>.</span>
      </Link>
      <p>{profile.name}</p>
      <nav aria-label="Footer navigation">
        <Link href="/skills/">Skills</Link>
        <Link href="/lab/">Engineering lab</Link>
        <Link href="/products/">App Store Releases</Link>
        <Link href="/research/">Research sandbox</Link>
        <Link href="/education/">Education</Link>
        <Link href="/recruiter/">Recruiter overview</Link>
      </nav>
    </footer>
  );
}
