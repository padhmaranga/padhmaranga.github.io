import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/latin-400.css";
import "./globals.css";
import "./interactive.css";
import { Footer, Navigation } from "@/components/navigation";
import { ScrollEnhancements } from "@/components/scroll";
import { Interactions } from "@/components/interactions";
import { profile } from "@/content/profile";
import { indexable, meta, publicAsset, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  ...meta(profile.name + " · Engineering Portfolio", profile.introduction, "/"),
  metadataBase: new URL(siteUrl || "http://localhost:4173"),
  title: {
    default: profile.name + " · Engineering Portfolio",
    template: "%s · " + profile.name,
  },
  icons: { icon: publicAsset("/visuals/icon.svg") },
  robots: { index: indexable, follow: indexable },
};

// Remembers where a link was clicked so the next page's view transition can
// expand from that point. It has to run while the HTML is parsed (before the
// "pagereveal" event), so it is a plain inline script rather than next/script.
const transitionOrigin = `(() => {
  const key = "vt-origin";
  addEventListener("click", (event) => {
    const link = event.target instanceof Element && event.target.closest("a[href]");
    if (!link || link.origin !== location.origin || link.target || link.hasAttribute("download")) return;
    let x = event.clientX, y = event.clientY;
    if (!event.detail) {
      const rect = link.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    try { sessionStorage.setItem(key, (x / innerWidth) * 100 + "," + (y / innerHeight) * 100); } catch {}
  }, true);
  addEventListener("pagereveal", (event) => {
    if (!event.viewTransition) return;
    let value = null;
    try { value = sessionStorage.getItem(key); sessionStorage.removeItem(key); } catch {}
    const [x, y] = (value || "50,0").split(",");
    const root = document.documentElement.style;
    root.setProperty("--vt-x", x + "%");
    root.setProperty("--vt-y", y + "%");
    event.viewTransition.ready.catch(() => {});
    event.viewTransition.finished.catch(() => {}).finally(() => {
      root.removeProperty("--vt-x");
      root.removeProperty("--vt-y");
    });
  });
})();`;

// First-visit loader. Shown once per browser session, only with JavaScript
// and standard motion preferences. Progress tracks real loading (window
// "load") with a short minimum so the intro can play, and a hard cap so a
// slow asset never holds the page hostage.
const loaderScript = `(() => {
  // Scroll reveals start hidden only when JS and motion are available. If the
  // app never boots, show everything after a few seconds.
  if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    const html = document.documentElement;
    html.classList.add("motion-ok");
    setTimeout(() => {
      if (!html.classList.contains("reveal-live")) html.classList.remove("motion-ok");
    }, 6000);
  }
  let first = false;
  try {
    first = !sessionStorage.getItem("pr-intro");
    sessionStorage.setItem("pr-intro", "1");
  } catch {}
  if (!first || !matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  const root = document.documentElement;
  root.classList.add("is-loading");
  const start = performance.now();
  const MIN = 1500, MAX = 3500;
  // Time-based, so slow frame rates don't stretch the intro.
  let doneAt = document.readyState === "complete" ? start : 0;
  addEventListener("load", () => { doneAt = doneAt || performance.now(); }, { once: true });
  let count = null, finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    root.style.setProperty("--load", "100");
    if (count) count.textContent = "100";
    root.classList.add("is-loaded");
    setTimeout(() => {
      root.classList.remove("is-loading", "is-loaded");
      root.style.removeProperty("--load");
    }, 1100);
  };
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const tick = (now) => {
    if (finished) return;
    const t = now - start;
    if (!doneAt && t > MAX) doneAt = now;
    // Run to 90% on the clock; the last 10% follows the real "load" event.
    let p = 90 * ease(Math.min(t / MIN, 1));
    if (doneAt) p += 10 * Math.min((now - Math.max(doneAt, start + MIN)) / 300, 1) * (t >= MIN ? 1 : 0);
    root.style.setProperty("--load", p.toFixed(2));
    count = count || document.querySelector("[data-loader-count]");
    if (count) count.textContent = String(Math.round(p)).padStart(3, "0");
    if (p >= 99.9) return finish();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  // Never block the page, even if animation frames stall.
  setTimeout(finish, MAX + 1000);
})();`;

function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-core">
        <svg viewBox="0 0 120 120">
          <circle className="loader-track" cx="60" cy="60" r="52" />
          <circle className="loader-arc" cx="60" cy="60" r="52" />
          <g className="loader-orbit">
            <circle cx="60" cy="8" r="2.4" />
            <circle cx="105" cy="86" r="1.6" />
            <circle cx="15" cy="86" r="1.2" />
          </g>
        </svg>
        <span className="loader-mark">
          PR<i>.</i>
        </span>
      </div>
      <p className="loader-name">
        {Array.from(profile.name).map((char, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties}>
            {char === " " ? " " : char}
          </span>
        ))}
      </p>
      <p className="loader-meta">
        <span>{profile.title}</span>
        <span>
          <span data-loader-count suppressHydrationWarning>
            000
          </span>
          %
        </span>
      </p>
      <span className="loader-bar" />
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: transitionOrigin }} />
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      </head>
      <body>
        <Loader />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollEnhancements />
        <Interactions />
      </body>
    </html>
  );
}
