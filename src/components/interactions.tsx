"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MAGNETIC = ".action-primary, .action-outline, .nav-cta, .round-arrow";
const TILT = ".project-card, .hero-portrait";
const SPOTLIGHT = ".timeline details";
const INTERACTIVE = "a, button, summary, label, input, select, textarea";
const REVEAL = ".section-heading, .page-heading, .core-feature h2";
const SCROLL_REVEAL = [
  ".project-card",
  "[data-reveal]",
  ".case-hero",
  ".case-content > section",
  ".case-facts",
  ".architecture > li",
  ".content-block",
].join(", ");

/**
 * Site-wide pointer and scroll polish, attached through event delegation so
 * server-rendered markup stays unchanged. Everything here is decorative:
 * it is skipped for coarse pointers and reduced motion (except the progress
 * bar), and content stays fully visible without JavaScript.
 */
export function Interactions() {
  const path = usePathname();

  // Scroll progress bar — useful for everyone, no motion involved.
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty(
        "--progress",
        String(max > 0 ? Math.min(window.scrollY / max, 1) : 0),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  // Heading reveals, re-run per route.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const targets = document.querySelectorAll<HTMLElement>(REVEAL);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("is-in");
      } else observer.observe(el);
    });
    return () => observer.disconnect();
  }, [path]);

  // Project sections: staggered scroll reveals. The hidden start state is
  // keyed on `motion-ok`, which the head script sets before first paint.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion-ok")) return;
    root.classList.add("reveal-live");
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    const seen = new WeakSet<Element>();

    const start = () => {
      observer = new IntersectionObserver(
        (entries) => {
          const batch = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLElement)
            .sort((a, b) => {
              const ra = a.getBoundingClientRect();
              const rb = b.getBoundingClientRect();
              return ra.top - rb.top || ra.left - rb.left;
            });
          batch.forEach((el, index) => {
            el.style.setProperty("--d", `${Math.min(index, 6) * 110}ms`);
            el.classList.add("is-in");
            observer?.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );
      const scan = () =>
        document.querySelectorAll<HTMLElement>(SCROLL_REVEAL).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          observer?.observe(el);
        });
      scan();
      // Filtering on /work mounts new cards; reveal those too.
      mutations = new MutationObserver(scan);
      mutations.observe(document.querySelector("main") ?? document.body, {
        childList: true,
        subtree: true,
      });
    };

    // Let the first-visit loader lift before anything animates in.
    let waiting: MutationObserver | undefined;
    if (root.classList.contains("is-loading")) {
      waiting = new MutationObserver(() => {
        if (root.classList.contains("is-loaded")) {
          waiting?.disconnect();
          start();
        }
      });
      waiting.observe(root, { attributes: true, attributeFilter: ["class"] });
    } else start();

    return () => {
      waiting?.disconnect();
      observer?.disconnect();
      mutations?.disconnect();
    };
  }, [path]);

  // Cursor follower, magnetic buttons and card tilt (fine pointers only).
  useEffect(() => {
    const media = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!media.matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    ring.innerHTML = "<span>View</span>";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring);

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const release = (el: HTMLElement | null, tilted: boolean) => {
      if (!el) return;
      if (tilted) {
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
        el.classList.remove("is-tilting");
      } else el.style.removeProperty("translate");
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      document.body.classList.add("cursor-on");
      const target = event.target as Element | null;
      if (!target?.closest) return;

      ring.classList.toggle("is-link", Boolean(target.closest(INTERACTIVE)));
      ring.classList.toggle("is-view", Boolean(target.closest(".project-card")));

      const nextMagnet = target.closest<HTMLElement>(MAGNETIC);
      if (nextMagnet !== magnet) release(magnet, false);
      magnet = nextMagnet;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const mx = (x - (r.left + r.width / 2)) * 0.22;
        const my = (y - (r.top + r.height / 2)) * 0.3;
        magnet.style.translate = `${mx.toFixed(1)}px ${my.toFixed(1)}px`;
      }

      const spot = target.closest<HTMLElement>(SPOTLIGHT);
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(x - r.left).toFixed(0)}px`);
        spot.style.setProperty("--my", `${(y - r.top).toFixed(0)}px`);
      }

      const nextTilt = target.closest<HTMLElement>(TILT);
      if (nextTilt !== tilt) release(tilt, true);
      tilt = nextTilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (x - r.left) / r.width;
        const py = (y - r.top) / r.height;
        const strength = tilt.classList.contains("hero-portrait") ? 10 : 5;
        tilt.classList.add("is-tilting");
        tilt.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        tilt.style.setProperty(
          "--rx",
          `${((0.5 - py) * strength).toFixed(2)}deg`,
        );
        tilt.style.setProperty(
          "--ry",
          `${((px - 0.5) * strength).toFixed(2)}deg`,
        );
      }
    };
    const onLeave = () => {
      document.body.classList.remove("cursor-on");
      release(magnet, false);
      release(tilt, true);
      magnet = tilt = null;
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      onLeave();
      dot.remove();
      ring.remove();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
