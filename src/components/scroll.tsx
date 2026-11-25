"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollEnhancements() {
  const path = usePathname();
  useEffect(() => {
    if (path !== "/") return;
    const media = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    let cleanup: (() => void) | undefined;
    let generation = 0;
    async function configure() {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (!media.matches) return;
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        anchors: false,
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      lenis.on("scroll", ScrollTrigger.update);
      const scope = gsap.context(() => {
        gsap.to(".hero-poster", {
          yPercent: 8,
          scrollTrigger: {
            trigger: "#intelligence-core",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      cleanup = () => {
        scope.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    }
    let usedWheel = false;
    const onWheel = () => {
      usedWheel = true;
      void configure();
    };
    const onPreference = () => {
      if (usedWheel) void configure();
    };
    window.addEventListener("wheel", onWheel, { once: true, passive: true });
    media.addEventListener("change", onPreference);
    return () => {
      generation++;
      cleanup?.();
      window.removeEventListener("wheel", onWheel);
      media.removeEventListener("change", onPreference);
    };
  }, [path]);
  return null;
}
