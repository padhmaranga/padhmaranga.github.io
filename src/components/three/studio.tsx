"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";

function Monitor({ onLost }: { onLost: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [canvas, onLost]);
  return null;
}

export default function Studio({
  active,
  angle,
  roughness,
  onLost,
}: {
  active: boolean;
  angle: number;
  roughness: number;
  onLost: () => void;
}) {
  const radians = (angle * Math.PI) / 180;
  return (
    <div className="twin-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        frameloop={active ? "demand" : "never"}
        camera={{ position: [2.6, 2.4, 5.4] }}
        gl={{ powerPreference: "low-power", antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Monitor onLost={onLost} />
        <ambientLight color="#a890c8" intensity={1.1} />
        <pointLight
          position={[3 * Math.cos(radians), 2.6, 3 * Math.sin(radians)]}
          intensity={60}
          color="#ecd3ff"
        />
        <directionalLight
          position={[-2, 1, -2]}
          intensity={2.1}
          color="#9ce0d7"
        />
        <mesh rotation={[0.1, 0.42, 0.4]}>
          <torusKnotGeometry args={[0.86, 0.25, 96, 16]} />
          <meshStandardMaterial
            color="#9378bd"
            metalness={0.52}
            roughness={roughness}
          />
        </mesh>
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.16, 44]} />
          <meshStandardMaterial color="#2a2238" roughness={0.75} />
        </mesh>
      </Canvas>
    </div>
  );
}
