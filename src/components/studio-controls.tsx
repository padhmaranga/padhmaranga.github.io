"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { SceneBoundary, useVisualSupport } from "./three/visual-support";

const Studio = dynamic(() => import("./three/studio"), { ssr: false });

function Lighting() {
  const [angle, setAngle] = useState(35);
  const [roughness, setRoughness] = useState(0.32);
  const ref = useRef<HTMLDivElement>(null);
  const state = useVisualSupport(ref, true, true);
  const [lost, setLost] = useState(false);
  const radians = (angle * Math.PI) / 180;
  return (
    <>
      <p>
        Move the light around a metallic form and adjust its surface roughness.
      </p>
      <label>
        Light angle{" "}
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(event) => setAngle(+event.target.value)}
        />{" "}
        <output>{angle}°</output>
      </label>
      <label>
        Surface roughness{" "}
        <input
          type="range"
          min=".1"
          max="1"
          step=".01"
          value={roughness}
          onChange={(event) => setRoughness(+event.target.value)}
        />{" "}
        <output>{roughness.toFixed(2)}</output>
      </label>
      <div ref={ref} className="lab-lighting">
        {state.capable && !lost ? (
          <SceneBoundary fallback={<p>3D lighting is unavailable.</p>}>
            <Studio
              active={state.visible}
              angle={angle}
              roughness={roughness}
              onLost={() => setLost(true)}
            />
          </SceneBoundary>
        ) : (
          <div
            className="lab-lighting-poster"
            role="img"
            aria-label="2D lighting preview"
            style={{
              background:
                "radial-gradient(circle at " +
                (50 + 24 * Math.cos(radians)) +
                "% " +
                (50 - 24 * Math.sin(radians)) +
                "%, #eddbff 0%, #7354aa " +
                (12 + 48 * roughness) +
                "%, #201433 76%)",
            }}
          />
        )}
      </div>
    </>
  );
}

export function StudioControls() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lab-body">
      <button
        className="action action-outline"
        type="button"
        aria-expanded={open}
        aria-controls="lighting-demo"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close lighting controls" : "Load lighting controls"}
      </button>
      <div className="lighting-controls" id="lighting-demo" hidden={!open}>
        {open && <Lighting />}
      </div>
    </div>
  );
}
