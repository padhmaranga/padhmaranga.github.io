"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Box, RotateCcw } from "lucide-react";
import { SceneBoundary, useVisualSupport } from "../three/visual-support";

const TwinScene = dynamic(() => import("./twin-scene"), { ssr: false });
const physicalFriction = 0.72;
const roadMeters = 160;
const initial = { speed: 80, modelFriction: 0.47 };
function stoppingDistance(speed: number, friction: number) {
  return (speed / 3.6) ** 2 / (2 * friction * 9.81);
}

export function Sandbox() {
  const [speed, setSpeed] = useState(initial.speed);
  const [modelFriction, setFriction] = useState(initial.modelFriction);
  const [show3D, setShow3D] = useState(false);
  const [lost, setLost] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const state = useVisualSupport(ref, show3D, true);
  const physical = stoppingDistance(speed, physicalFriction);
  const predicted = stoppingDistance(speed, modelFriction);
  const format = (value: number) => value.toFixed(1) + " m";
  const endpoint = (meters: number) => 68 + (meters / roadMeters) * 520;

  return (
    <div className="sandbox" id="sandbox">
      <div className="sandbox-top">
        <div>
          <p className="eyebrow mint">Conceptual demonstration</p>
          <h2>Digital Twin Sandbox</h2>
        </div>
        <button
          className="action action-outline"
          onClick={() => {
            setSpeed(initial.speed);
            setFriction(initial.modelFriction);
          }}
        >
          Reset <RotateCcw size={16} aria-hidden />
        </button>
      </div>
      <p>
        Change the speed or the model’s friction estimate to compare stopping
        distances on a level road. The physical reference uses fixed friction of{" "}
        {physicalFriction}.
      </p>
      <div className="sandbox-grid">
        <div className="sandbox-controls">
          <label htmlFor="speed">
            Starting speed <output>{speed} km/h</output>
          </label>
          <input
            id="speed"
            type="range"
            min="30"
            max="100"
            step="1"
            value={speed}
            onChange={(event) => setSpeed(+event.target.value)}
          />
          <label htmlFor="friction">
            Model friction <output>{modelFriction.toFixed(2)}</output>
          </label>
          <input
            id="friction"
            type="range"
            min="0.25"
            max="0.95"
            step="0.01"
            value={modelFriction}
            onChange={(event) => setFriction(+event.target.value)}
          />
          <dl className="sandbox-results" aria-live="polite">
            <div>
              <dt>Physical</dt>
              <dd>{format(physical)}</dd>
            </div>
            <div>
              <dt>Predicted</dt>
              <dd>{format(predicted)}</dd>
            </div>
            <div>
              <dt>Difference</dt>
              <dd>{format(Math.abs(predicted - physical))}</dd>
            </div>
          </dl>
        </div>
        <div className="sandbox-display">
          <svg
            role="img"
            aria-label={
              "Braking comparison. Physical " +
              format(physical) +
              ", predicted " +
              format(predicted)
            }
            viewBox="0 0 640 230"
          >
            <rect
              x="52"
              y="48"
              width="548"
              height="136"
              rx="8"
              fill="#131e27"
              stroke="#304752"
            />
            {[0, 40, 80, 120, 160].map((mark) => (
              <g key={mark}>
                <path
                  d={"M" + endpoint(mark) + " 49v135"}
                  stroke="#304752"
                  strokeDasharray="4 4"
                />
                <text
                  x={endpoint(mark)}
                  y="209"
                  textAnchor="middle"
                  fill="#abb9ca"
                  fontSize="14"
                >
                  {mark} m
                </text>
              </g>
            ))}
            <path
              d={"M68 92H" + endpoint(physical)}
              stroke="#9ce0d7"
              strokeWidth="4"
            />
            <circle cx={endpoint(physical)} cy="92" r="7" fill="#9ce0d7" />
            <path
              d={"M68 148H" + endpoint(predicted)}
              stroke="#cfb6fb"
              strokeWidth="4"
            />
            <circle cx={endpoint(predicted)} cy="148" r="7" fill="#cfb6fb" />
            <text x="68" y="32" fill="#9ce0d7" fontSize="15">
              Physical
            </text>
            <text x="160" y="32" fill="#cfb6fb" fontSize="15">
              Predicted
            </text>
          </svg>
          <button
            className="action action-outline"
            type="button"
            aria-expanded={show3D}
            aria-controls="sandbox-3d"
            onClick={() => setShow3D(!show3D)}
          >
            {show3D ? "Hide 3D view" : "Show 3D view"}{" "}
            <Box size={16} aria-hidden />
          </button>
        </div>
      </div>
      <div id="sandbox-3d" ref={ref} hidden={!show3D} className="sandbox-scene">
        {show3D && state.capable && !lost ? (
          <SceneBoundary
            fallback={<p>The 2D comparison remains available above.</p>}
          >
            <TwinScene
              physical={physical / roadMeters}
              predicted={predicted / roadMeters}
              active={state.visible}
              onLost={() => setLost(true)}
            />
          </SceneBoundary>
        ) : (
          <p>3D requires WebGL 2. The 2D comparison is available above.</p>
        )}
      </div>
      <p className="fineprint">
        This model assumes constant deceleration, a level road and immediate
        braking. The values are illustrative.
      </p>
    </div>
  );
}
