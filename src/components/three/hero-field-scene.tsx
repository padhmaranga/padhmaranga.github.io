"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  MathUtils,
  type Points,
  type ShaderMaterial,
  Vector3,
} from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uScroll;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uPulseOrigin;
  uniform float uPulseTime;
  attribute vec3 aTarget;
  attribute float aRandom;
  varying float vMix;
  varying float vAlpha;

  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t) + sin(p.z * 2.3 - t * 0.7),
      sin(p.z * 1.9 + t * 0.8) + sin(p.x * 2.1 + t * 0.5),
      sin(p.x * 1.6 - t * 0.6) + sin(p.y * 2.5 + t * 0.9)
    ) * 0.5;
  }

  void main() {
    float m = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(position, aTarget, m);
    vec3 f = flow(p * 0.9, uTime * 0.35 + aRandom * 6.2831);
    p += f * (0.06 + 0.12 * aRandom);

    float a = uTime * 0.07;
    float c = cos(a);
    float s = sin(a);
    p.xz = mat2(c, -s, s, c) * p.xz;

    vec4 world = modelMatrix * vec4(p, 1.0);

    vec2 toMouse = world.xy - uMouse.xy;
    float dist = length(toMouse);
    float push = smoothstep(1.6, 0.0, dist) * uMouseStrength;
    world.xy += normalize(toMouse + 0.0001) * push * 0.7;
    world.z += push * 0.8;

    vec2 fromPulse = world.xy - uPulseOrigin.xy;
    float pd = length(fromPulse);
    float wave = exp(-pow((pd - uPulseTime * 4.2) * 2.0, 2.0)) * exp(-uPulseTime * 1.4);
    world.xy += normalize(fromPulse + 0.0001) * wave * 0.55;
    world.z += wave * 0.4;

    world.xyz *= 1.0 + uScroll * 0.45;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.45 + aRandom) * uPixelRatio / -mv.z;

    vMix = clamp(0.5 + f.y * 0.45 + push * 0.8 + wave, 0.0, 1.0);
    vAlpha = (0.3 + 0.7 * aRandom) * (1.0 - clamp(uScroll, 0.0, 1.0) * 0.85)
      + push * 0.5 + wave * 0.8;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 1.7);
    vec3 color = mix(uColorA, uColorB, vMix);
    color = mix(color, uColorC, smoothstep(0.75, 1.0, vMix));
    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

type Pointer = { x: number; y: number; moved: number };
type Pulse = { x: number; y: number; at: number };

const golden = Math.PI * (3 - Math.sqrt(5));

/** Point i of n on one of the morph shapes, written into out[o..o+2]. */
function shapePoint(
  shape: number,
  i: number,
  n: number,
  out: Float32Array,
  o: number,
) {
  const u = i / n;
  const a = Math.random() * Math.PI * 2;
  const j = Math.random();
  let x = 0;
  let y = 0;
  let z = 0;
  switch (shape) {
    case 1: {
      // (2,3) torus knot with a soft tube
      const t = u * Math.PI * 2;
      const rr = 1.15 + 0.45 * Math.cos(3 * t);
      const tube = 0.2 * Math.sqrt(j);
      x = rr * Math.cos(2 * t) + Math.cos(a) * tube;
      y = rr * Math.sin(2 * t) + Math.sin(a) * tube;
      z = 0.45 * Math.sin(3 * t) + Math.cos(a) * tube;
      break;
    }
    case 2: {
      // Donut surface
      const t = u * Math.PI * 2 * 37;
      const rr = 1.35 + Math.cos(a) * 0.45;
      x = rr * Math.cos(t);
      y = Math.sin(a) * 0.45;
      z = rr * Math.sin(t);
      break;
    }
    case 3: {
      // Double helix
      const t = (u - 0.5) * 4;
      const strand = i % 2 ? Math.PI : 0;
      const ang = t * 2.4 + strand;
      const tube = 0.12 * Math.sqrt(j);
      x = Math.cos(ang) * 0.85 + Math.cos(a) * tube;
      y = t * 0.95;
      z = Math.sin(ang) * 0.85 + Math.sin(a) * tube;
      break;
    }
    case 4: {
      // Three-arm spiral galaxy
      const radius = Math.pow(j, 0.6) * 2.1;
      const arm = ((i % 3) / 3) * Math.PI * 2;
      const ang = arm + radius * 2.1 + (Math.random() - 0.5) * 0.5;
      x = Math.cos(ang) * radius;
      y = (Math.random() - 0.5) * 0.18 * (2.2 - radius);
      z = Math.sin(ang) * radius;
      break;
    }
    case 5: {
      // Cube shell
      const face = i % 6;
      const s1 = (Math.random() * 2 - 1) * 1.15;
      const s2 = (Math.random() * 2 - 1) * 1.15;
      const side = face % 2 ? 1.15 : -1.15;
      if (face < 2) [x, y, z] = [side, s1, s2];
      else if (face < 4) [x, y, z] = [s1, side, s2];
      else [x, y, z] = [s1, s2, side];
      break;
    }
    default: {
      // Fibonacci sphere shell
      const yy = 1 - 2 * (i + 0.5) / n;
      const radius = Math.sqrt(1 - yy * yy);
      const shell = 1.75 + (j - 0.5) * 0.12;
      x = Math.cos(i * golden) * radius * shell;
      y = yy * shell;
      z = Math.sin(i * golden) * radius * shell;
    }
  }
  out[o] = x;
  out[o + 1] = y;
  out[o + 2] = z;
}

function buildGeometry(count: number, shapes: readonly [number, number]) {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
    if (i % 7 === 0) {
      // Loose dust that drifts around both shapes.
      const y = 1 - (2 * (i + 0.5)) / count;
      const radius = Math.sqrt(1 - y * y);
      const shell = 2.2 + Math.random() * 3.2;
      positions[i * 3] = Math.cos(i * golden) * radius * shell;
      positions[i * 3 + 1] = y * shell;
      positions[i * 3 + 2] = Math.sin(i * golden) * radius * shell;
      targets[i * 3] = positions[i * 3] * 1.15;
      targets[i * 3 + 1] = positions[i * 3 + 1] * 1.15;
      targets[i * 3 + 2] = positions[i * 3 + 2] * 1.15;
    } else {
      shapePoint(shapes[0], i, count, positions, i * 3);
      shapePoint(shapes[1], i, count, targets, i * 3);
    }
  }
  return { positions, targets, randoms };
}

export type FieldVariant = "hero" | "page";

function Field({
  compact,
  variant,
  shapes,
  pointer,
  pulse,
  onReady,
}: {
  compact: boolean;
  variant: FieldVariant;
  shapes: readonly [number, number];
  pointer: RefObject<Pointer>;
  pulse: RefObject<Pulse>;
  onReady: () => void;
}) {
  const points = useRef<Points>(null);
  const material = useRef<ShaderMaterial>(null);
  const { camera, viewport, gl } = useThree();
  const page = variant === "page";
  const count = page ? (compact ? 3200 : 7000) : compact ? 5200 : 13000;
  const [shapeA, shapeB] = shapes;
  const geometry = useMemo(
    () => buildGeometry(count, [shapeA, shapeB]),
    [count, shapeA, shapeB],
  );
  const scratch = useMemo(() => new Vector3(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: compact ? 40 : 48 },
      uScroll: { value: 0 },
      uMouse: { value: new Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uPulseOrigin: { value: new Vector3() },
      uPulseTime: { value: 10 },
      uColorA: { value: new Color("#7b52d6") },
      uColorB: { value: new Color("#d5baff") },
      uColorC: { value: new Color("#9ce0d7") },
    }),
    [compact],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(frame);
  }, [onReady]);

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const dt = Math.min(delta, 0.05);
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uTime.value += dt;
    const t = u.uTime.value;
    // Hold each shape, then ease into the other.
    u.uMorph.value = 0.5 - 0.5 * Math.cos(t * 0.16);
    u.uScroll.value = MathUtils.damp(
      u.uScroll.value,
      Math.min(window.scrollY / window.innerHeight, 1.4),
      6,
      dt,
    );

    const p = pointer.current;
    const recent = performance.now() - p.moved < 2200;
    scratch.set(p.x, p.y, 0.5).unproject(camera).sub(camera.position);
    scratch.multiplyScalar(-camera.position.z / scratch.z).add(camera.position);
    u.uMouse.value.lerp(scratch, 1 - Math.exp(-10 * dt));
    u.uMouseStrength.value = MathUtils.damp(
      u.uMouseStrength.value,
      recent && !compact ? 1 : 0,
      4,
      dt,
    );

    const pl = pulse.current;
    if (pl.at > 0) {
      u.uPulseTime.value = (performance.now() - pl.at) / 1000;
      scratch.set(pl.x, pl.y, 0.5).unproject(camera).sub(camera.position);
      scratch
        .multiplyScalar(-camera.position.z / scratch.z)
        .add(camera.position);
      u.uPulseOrigin.value.copy(scratch);
    }

    if (points.current) {
      const targetX = compact
        ? page
          ? viewport.width * 0.28
          : 0
        : viewport.width * (page ? 0.3 : 0.24);
      points.current.position.x = MathUtils.damp(
        points.current.position.x,
        targetX,
        3,
        dt,
      );
      points.current.position.y = page
        ? 0.2
        : compact
          ? viewport.height * 0.12
          : 0.1;
      points.current.rotation.x = MathUtils.damp(
        points.current.rotation.x,
        0.35 + p.y * 0.18,
        2.5,
        dt,
      );
      points.current.rotation.z = MathUtils.damp(
        points.current.rotation.z,
        -p.x * 0.12,
        2.5,
        dt,
      );
    }
    state.camera.position.x = MathUtils.damp(
      state.camera.position.x,
      p.x * 0.35,
      2,
      dt,
    );
    state.camera.position.y = MathUtils.damp(
      state.camera.position.y,
      p.y * 0.2,
      2,
      dt,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points
      ref={points}
      scale={page ? (compact ? 0.6 : 0.78) : compact ? 0.85 : 1.02}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[geometry.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          args={[geometry.targets, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[geometry.randoms, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export default function HeroFieldScene({
  active,
  compact,
  variant = "hero",
  shapes = [0, 1],
  onReady,
  onLost,
}: {
  active: boolean;
  compact: boolean;
  variant?: FieldVariant;
  shapes?: readonly [number, number];
  onReady: () => void;
  onLost: () => void;
}) {
  const pointer = useRef<Pointer>({ x: 0, y: 0, moved: 0 });
  const pulse = useRef<Pulse>({ x: 0, y: 0, at: 0 });
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current?.closest(".hero, .page-heading");
    if (!element) return;
    const toNdc = (event: PointerEvent) => {
      const rect = host.current!.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };
    const onMove = (event: Event) => {
      const e = event as PointerEvent;
      Object.assign(pointer.current, toNdc(e), { moved: performance.now() });
    };
    const onDown = (event: Event) => {
      const e = event as PointerEvent;
      if ((e.target as HTMLElement).closest("a, button")) return;
      Object.assign(pulse.current, toNdc(e), { at: performance.now() });
    };
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={host} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={[1, compact ? 1.3 : 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) =>
          gl.domElement.addEventListener("webglcontextlost", onLost)
        }
      >
        <Field
          compact={compact}
          variant={variant}
          shapes={shapes}
          pointer={pointer}
          pulse={pulse}
          onReady={onReady}
        />
      </Canvas>
    </div>
  );
}
