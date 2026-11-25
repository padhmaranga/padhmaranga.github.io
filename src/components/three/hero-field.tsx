"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneBoundary, useVisualSupport } from "./visual-support";

const HeroFieldScene = dynamic(() => import("./hero-field-scene"), {
  ssr: false,
});

const SHAPE_PAIRS = [
  [2, 3],
  [4, 0],
  [5, 2],
  [3, 4],
  [0, 5],
  [1, 4],
  [2, 0],
] as const;

function pairFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return SHAPE_PAIRS[Math.abs(hash) % SHAPE_PAIRS.length];
}

/**
 * Full-bleed particle field behind the home hero ("hero") or an inner page
 * header ("page", lighter, with a shape pair chosen from the page title). It
 * loads after the page is idle so the content paints first, and it stays off
 * for reduced motion or without WebGL 2 (the CSS glow remains as fallback).
 */
export function HeroField({
  variant = "hero",
  seed = "",
}: {
  variant?: "hero" | "page";
  seed?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [idle, setIdle] = useState(false);
  const { capable, active, compact } = useVisualSupport(ref, idle);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setLost(true), []);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  const scene = capable && !lost;
  return (
    <div
      className={"hero-field hero-field-" + variant}
      ref={ref}
      aria-hidden="true"
      data-ready={scene && ready ? "" : undefined}
    >
      <div className="hero-field-glow" />
      {scene && (
        <div className="hero-field-canvas">
          <SceneBoundary onError={onLost}>
            <HeroFieldScene
              active={active}
              compact={compact}
              variant={variant}
              shapes={variant === "page" ? pairFor(seed) : [0, 1]}
              onReady={onReady}
              onLost={onLost}
            />
          </SceneBoundary>
        </div>
      )}
      {scene && ready && !compact && variant === "hero" && (
        <p className="hero-field-hint">
          <span /> Move to disturb · click to send a pulse
        </p>
      )}
    </div>
  );
}
