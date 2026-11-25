"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";

function Vehicle({
  z,
  fraction,
  color,
}: {
  z: number;
  fraction: number;
  color: string;
}) {
  const distance = fraction * 9;
  return (
    <>
      <mesh position={[-4.5 + distance / 2, 0.06, z]}>
        <boxGeometry args={[distance, 0.03, 0.08]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group position={[-4.5 + distance, 0.23, z]}>
        <mesh>
          <boxGeometry args={[0.65, 0.25, 0.38]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
        <mesh position={[-0.06, 0.2, 0]}>
          <boxGeometry args={[0.32, 0.18, 0.33]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {[-0.2, 0.2].flatMap((x) =>
          [-0.2, 0.2].map((wheel) => (
            <mesh
              key={x + "/" + wheel}
              position={[x, -0.1, wheel]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.09, 0.09, 0.06, 12]} />
              <meshStandardMaterial color="#13121b" />
            </mesh>
          )),
        )}
      </group>
    </>
  );
}

function ContextLoss({ onLost }: { onLost: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [canvas, onLost]);
  return null;
}

export default function TwinScene({
  physical,
  predicted,
  active,
  onLost,
}: {
  physical: number;
  predicted: number;
  active: boolean;
  onLost: () => void;
}) {
  return (
    <div aria-hidden="true" className="twin-canvas">
      <Canvas
        dpr={[1, 1.35]}
        frameloop={active ? "demand" : "never"}
        camera={{ position: [1.9, 7.7, 7.5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ContextLoss onLost={onLost} />
        <ambientLight intensity={1.65} />
        <directionalLight position={[3, 7, 5]} intensity={2.7} />
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[10, 0.16, 3.2]} />
          <meshStandardMaterial color="#273b43" />
        </mesh>
        {Array.from({ length: 13 }, (_, i) => (
          <mesh key={i} position={[-4.5 + i * 0.75, 0.042, 0]}>
            <boxGeometry args={[0.4, 0.012, 0.035]} />
            <meshBasicMaterial color="#86a7ad" />
          </mesh>
        ))}
        <Vehicle z={0.72} fraction={physical} color="#9ce0d7" />
        <Vehicle z={-0.72} fraction={predicted} color="#cfb6fb" />
      </Canvas>
    </div>
  );
}
