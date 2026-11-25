"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Group, MathUtils, Vector3 } from "three";

const goldenAngle = Math.PI * (3 - Math.sqrt(5));

function Network({ count }: { count: number }) {
  const { points, edges, dust } = useMemo(() => {
    const vertices = Array.from({ length: count }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / count;
      const radius = Math.sqrt(1 - y * y);
      return new Vector3(
        radius * Math.cos(i * goldenAngle),
        y,
        radius * Math.sin(i * goldenAngle),
      ).multiplyScalar(1.35);
    });
    const segments: number[] = [];
    vertices.forEach((a, index) => {
      vertices.slice(index + 1).forEach((b) => {
        if (a.distanceToSquared(b) < (count < 120 ? 0.42 : 0.27))
          segments.push(...a.toArray(), ...b.toArray());
      });
    });
    const dust = Array.from({ length: count * 2 }, (_, i) => [
      Math.sin(i * 123.17) * 3.12,
      Math.cos(i * 108.7) * 2.43,
      Math.sin(i * 182.91) * 2.3,
    ]).flat();
    return {
      points: new Float32Array(vertices.flatMap((v) => v.toArray())),
      edges: new Float32Array(segments),
      dust: new Float32Array(dust),
    };
  }, [count]);

  return (
    <>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#cfafff"
          transparent
          opacity={0.48}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e2c9ff"
          size={0.034}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#af8aff"
          size={0.018}
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function Sculpture({
  compact,
  onReady,
  onLost,
}: {
  compact: boolean;
  onReady: () => void;
  onLost: () => void;
}) {
  const sculpture = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const scroll = useRef({ progress: 0 });
  const time = useRef(0);
  const eventTarget = useThree((s) => s.gl.domElement);
  const rings = useMemo(
    () =>
      [2.17, 2.32, 2.4].map((radius) =>
        Array.from({ length: 97 }, (_, point) => {
          const angle = (point * Math.PI) / 48;
          return new Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0,
          );
        }),
      ),
    [],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(onReady);
    eventTarget.addEventListener("webglcontextlost", onLost);
    return () => {
      cancelAnimationFrame(frame);
      eventTarget.removeEventListener("webglcontextlost", onLost);
    };
  }, [eventTarget, onReady, onLost]);

  useEffect(() => {
    let disposed = false;
    let destroy: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const motion = gsap.to(scroll.current, {
          progress: 3,
          ease: "none",
          scrollTrigger: {
            trigger: "#intelligence-core",
            start: "top top",
            end: "bottom 15%",
            scrub: 0.45,
          },
        });
        destroy = () => {
          motion.scrollTrigger?.kill();
          motion.kill();
        };
      },
    );
    return () => {
      disposed = true;
      destroy?.();
    };
  }, []);

  useFrame(({ camera, pointer }, delta) => {
    if (!sculpture.current || !orbit.current) return;
    time.current += Math.min(delta, 0.05);
    const t = time.current;
    const stage = scroll.current.progress;
    const strength = compact ? 0 : 0.62;
    camera.position.x = MathUtils.damp(
      camera.position.x,
      pointer.x * strength + Math.sin(stage) * 0.62,
      3,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      pointer.y * strength - 0.26 * stage,
      3,
      delta,
    );
    camera.lookAt(0, 0, 0);
    sculpture.current.rotation.set(
      0.17 + Math.sin(t * 0.31) * 0.13 + stage * 0.32,
      t * 0.22 + stage * 0.82,
      stage * 0.14,
    );
    orbit.current.rotation.y = t * 0.15 + stage * 0.44;
    orbit.current.scale.setScalar(1 + Math.sin(stage * 1.9) * 0.11);
    sculpture.current.scale.set(1 + 0.09 * stage, 1 - 0.085 * stage, 1);
  });

  return (
    <>
      <ambientLight intensity={0.8} color="#a486f3" />
      <pointLight position={[-3, 4, 4]} color="#c2a2ff" intensity={36} />
      <pointLight position={[3, -2, 0]} color="#6744de" intensity={19} />
      <group ref={sculpture}>
        <mesh>
          <icosahedronGeometry args={[1.18, compact ? 2 : 4]} />
          <meshPhysicalMaterial
            color="#2d1c50"
            emissive="#120b29"
            metalness={0.72}
            roughness={0.26}
            transparent
            opacity={0.67}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.25, 2]} />
          <meshBasicMaterial
            color="#a57ce3"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
        <Network count={compact ? 88 : 156} />
      </group>
      <group ref={orbit}>
        {rings.map((points, index) => (
          <group
            key={index}
            rotation={
              [
                [1.07, -0.2, -0.43],
                [1.22, 0.68, 0.83],
                [0.94, -0.55, 1.68],
              ][index] as [number, number, number]
            }
          >
            <Line
              points={points}
              color={index === 0 ? "#efd4ff" : "#9569df"}
              lineWidth={index === 0 ? 1.35 : 0.85}
              transparent
              opacity={index === 0 ? 0.92 : 0.62}
            />
            <mesh position={points[18 + index * 35]}>
              <sphereGeometry args={[0.035, 10, 8]} />
              <meshBasicMaterial color="#efd8ff" />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function CoreScene({
  active,
  compact,
  onReady,
  onLost,
}: {
  active: boolean;
  compact: boolean;
  onReady: () => void;
  onLost: () => void;
}) {
  return (
    <Canvas
      dpr={[1, compact ? 1.2 : 1.55]}
      camera={{ position: [0, 0, 7.5], fov: 46 }}
      gl={{ alpha: true, antialias: !compact, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
    >
      <Sculpture compact={compact} onReady={onReady} onLost={onLost} />
    </Canvas>
  );
}
