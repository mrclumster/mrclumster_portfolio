"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BIRD_COUNT = 6;

function makeCraneGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const verts = new Float32Array([
    // Body lower-left
    0, 0, 0,   0.35, 0.18, 0,   0.18, -0.1, 0,
    // Body lower-right
    0, 0, 0,  -0.35, 0.18, 0,  -0.18, -0.1, 0,
    // Right wing
    0.35, 0.18, 0,   0.75, 0.45, 0,   0.45, 0, 0,
    // Left wing
   -0.35, 0.18, 0,  -0.75, 0.45, 0,  -0.45, 0, 0,
    // Tail right
    0.18, -0.1, 0,   0.28, -0.45, 0,   0, -0.2, 0,
    // Tail left
   -0.18, -0.1, 0,  -0.28, -0.45, 0,   0, -0.2, 0,
    // Head right
    0.35, 0.18, 0,   0.55, 0.38, 0,   0.45, 0.12, 0,
    // Head left
   -0.35, 0.18, 0,  -0.55, 0.38, 0,  -0.45, 0.12, 0,
  ]);
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

type BirdState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rotY: number;
  rotVelY: number;
  wingPhase: number;
  wingSpeed: number;
  scale: number;
};

function getInk(): string {
  if (typeof document === "undefined") return "#1a1a1a";
  return document.documentElement.classList.contains("dark") ? "#e8e4dc" : "#1a1a1a";
}

function Birds() {
  const groupRef = useRef<THREE.Group>(null!);
  const birds = useMemo<BirdState[]>(() =>
    Array.from({ length: BIRD_COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.003,
        0
      ),
      rotY: Math.random() * Math.PI * 2,
      rotVelY: (Math.random() - 0.5) * 0.004,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.7 + Math.random() * 0.7,
      scale: 0.45 + Math.random() * 0.55,
    })), []);

  const geo = useMemo(makeCraneGeometry, []);
  const ink = getInk();

  useFrame((_, delta) => {
    groupRef.current.children.forEach((child, i) => {
      const b = birds[i];
      b.pos.add(b.vel);
      b.rotY += b.rotVelY;
      b.wingPhase += delta * b.wingSpeed;

      const hw = 9;
      const hv = 4.5;
      if (b.pos.x > hw) b.pos.x = -hw;
      if (b.pos.x < -hw) b.pos.x = hw;
      if (b.pos.y > hv) b.pos.y = -hv;
      if (b.pos.y < -hv) b.pos.y = hv;

      child.position.copy(b.pos);
      child.rotation.y = b.rotY;
      child.rotation.z = Math.sin(b.wingPhase) * 0.12;
    });
  });

  return (
    <group ref={groupRef}>
      {birds.map((b, i) => (
        <mesh key={i} geometry={geo} scale={b.scale}>
          <meshBasicMaterial color={ink} side={THREE.DoubleSide} transparent opacity={0.14} />
        </mesh>
      ))}
    </group>
  );
}

export function OrigamiBirds() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ alpha: true, antialias: false }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <Birds />
    </Canvas>
  );
}
