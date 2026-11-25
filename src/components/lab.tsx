"use client";

import { useState } from "react";
import { Action } from "./ui";
import { StudioControls } from "./studio-controls";

const services = [
  [
    "Browser",
    "Requests a pre-rendered page and runs interactions locally after loading.",
  ],
  [
    "Static host",
    "Serves HTML, styles and scripts from the exported directory.",
  ],
  [
    "Build pipeline",
    "Converts typed content and approved assets into static, versioned files.",
  ],
];

function NeuralNetwork() {
  const [input, setInput] = useState(0.6);
  const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
  const hidden = [sigmoid(3 * input - 0.8), sigmoid(1.1 - 1.7 * input)];
  const output = sigmoid(hidden[0] * 1.4 - hidden[1] * 0.9);
  const nodes = [
    { x: 75, y: 104, value: input },
    { x: 254, y: 50, value: hidden[0] },
    { x: 254, y: 158, value: hidden[1] },
    { x: 436, y: 104, value: output },
  ];
  return (
    <>
      <p>
        A single input feeds two sigmoid activations, which combine into one
        output.
      </p>
      <label>
        Input strength{" "}
        <input
          type="range"
          min="0"
          max="1"
          step=".01"
          value={input}
          onChange={(event) => setInput(+event.target.value)}
        />
      </label>
      <svg
        viewBox="0 0 510 210"
        role="img"
        aria-label="Input connects to two hidden nodes, which connect to the output"
      >
        <path
          d="M75 104L254 50L436 104L254 158Z"
          stroke="#8870a9"
          strokeWidth="2"
          fill="none"
        />
        {nodes.map(({ x, y, value }) => (
          <g key={x + "/" + y}>
            <circle
              cx={x}
              cy={y}
              r="29"
              fill="#241b36"
              stroke="#d5baff"
              strokeWidth={1 + value * 3}
            />
            <text
              x={x}
              y={y + 5}
              fill="#f4eff9"
              textAnchor="middle"
              fontSize="15"
            >
              {value.toFixed(2)}
            </text>
          </g>
        ))}
      </svg>
      <p role="status">
        Input {input.toFixed(2)} · Hidden{" "}
        {hidden.map((value) => value.toFixed(2)).join(" and ")} · Output{" "}
        {output.toFixed(2)}
      </p>
    </>
  );
}

function Physics() {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(18);
  const radians = (angle * Math.PI) / 180;
  const horizontal = speed * Math.cos(radians);
  const vertical = speed * Math.sin(radians);
  const flight = (2 * vertical) / 9.81;
  const plot = Array.from({ length: 41 }, (_, index) => {
    const t = (index * flight) / 40;
    return (
      (index ? "L" : "M") +
      (35 + t * horizontal * 6.3).toFixed(1) +
      " " +
      (260 - (vertical * t - 4.905 * t * t) * 7.5).toFixed(1)
    );
  }).join(" ");
  return (
    <>
      <p>
        Compare launch angles and speeds with constant gravity and no air
        resistance.
      </p>
      <label>
        Launch angle{" "}
        <input
          type="range"
          min="15"
          max="75"
          value={angle}
          onChange={(event) => setAngle(+event.target.value)}
        />{" "}
        <output>{angle}°</output>
      </label>
      <label>
        Launch speed{" "}
        <input
          type="range"
          min="5"
          max="25"
          value={speed}
          onChange={(event) => setSpeed(+event.target.value)}
        />{" "}
        <output>{speed} m/s</output>
      </label>
      <svg
        viewBox="0 0 510 280"
        role="img"
        aria-label="Projectile path above a level ground line"
      >
        <path d="M35 20V260H465" stroke="#665878" fill="none" />
        <path d={plot} stroke="#9ce0d7" strokeWidth="3" fill="none" />
      </svg>
      <p role="status">
        Flight {flight.toFixed(2)} seconds · Range{" "}
        {(flight * horizontal).toFixed(1)} m
      </p>
    </>
  );
}

function Architecture() {
  const [selected, select] = useState(0);
  return (
    <>
      <p>Trace a page request from the browser back to the source build.</p>
      <div className="actions">
        {services.map(([name], index) => (
          <button
            type="button"
            className="action action-outline"
            key={name}
            aria-pressed={selected === index}
            onClick={() => select(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <p role="status">{services[selected][1]}</p>
    </>
  );
}

export function Lab() {
  return (
    <div className="lab-list">
      <details>
        <summary>Neural Network Explorer</summary>
        <div className="lab-body">
          <NeuralNetwork />
        </div>
      </details>
      <details>
        <summary>Digital Twin Demonstration</summary>
        <div className="lab-body">
          <p>
            Compare actual and predicted stopping distances with two friction
            values.
          </p>
          <Action href="/research/#sandbox">
            Open the Digital Twin Sandbox
          </Action>
        </div>
      </details>
      <details>
        <summary>Physics Simulation</summary>
        <div className="lab-body">
          <Physics />
        </div>
      </details>
      <details>
        <summary>System Architecture Explorer</summary>
        <div className="lab-body">
          <Architecture />
        </div>
      </details>
      <details>
        <summary>Real-Time 3D Showcase</summary>
        <StudioControls />
      </details>
    </div>
  );
}
