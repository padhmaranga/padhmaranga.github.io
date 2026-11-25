"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { publicAsset } from "@/lib/site";
import { SceneBoundary, useVisualSupport } from "./visual-support";

const CoreScene = dynamic(() => import("./core-scene"), { ssr: false });

export function Core() {
  const ref = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);
  const { capable, unavailable, active, compact } = useVisualSupport(
    ref,
    requested,
  );
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setLost(true), []);
  const scene = capable && !lost;
  const failed = unavailable || lost;
  const label = failed
    ? "Intelligence Core animation unavailable"
    : !scene || !ready
      ? "Enable Intelligence Core animation"
      : paused
        ? "Play Intelligence Core animation"
        : "Pause Intelligence Core animation";

  return (
    <div
      className="core"
      ref={ref}
      data-core-render={scene && ready ? "webgl" : "poster"}
      onPointerMove={(event) => {
        if (!requested && event.pointerType === "mouse") setRequested(true);
      }}
    >
      <div className="core-field" />
      <Image
        className="hero-poster"
        src={publicAsset("/visuals/core.webp")}
        alt=""
        width={720}
        height={585}
        loading="lazy"
      />
      {scene && (
        <div className="core-canvas" aria-hidden="true">
          <SceneBoundary onError={onLost}>
            <CoreScene
              active={active && !paused}
              compact={compact}
              onReady={onReady}
              onLost={onLost}
            />
          </SceneBoundary>
        </div>
      )}
      <button
        type="button"
        className="core-pause"
        aria-label={label}
        aria-disabled={failed}
        onClick={() => {
          if (failed) return;
          if (!requested) setRequested(true);
          else if (ready) setPaused(!paused);
        }}
      >
        {scene && ready && !paused ? (
          <Pause size={15} aria-hidden />
        ) : (
          <Play size={15} aria-hidden />
        )}
      </button>
      <span className="core-label">
        <span /> Intelligence Core
      </span>
    </div>
  );
}
