"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 65;
const CONNECT_DIST = 2.2;
const REPEL_DIST = 1.6;
const REPEL_FORCE = 0.003;

function getInkColor() {
  if (typeof document === "undefined") return new THREE.Color(0x1a1a1a);
  return document.documentElement.classList.contains("dark")
    ? new THREE.Color(0xe8e4dc)
    : new THREE.Color(0x1a1a1a);
}

type ParticleData = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
};

function Particles() {
  const { size } = useThree();
  const mouseRef = useRef(new THREE.Vector2(-999, -999));
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const particles = useMemo<ParticleData[]>(() =>
    Array.from({ length: COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        0
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        0
      ),
    })), []);

  const posArray = useMemo(() => new Float32Array(COUNT * 3), []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    }
    function onMouseLeave() {
      mouseRef.current.set(-999, -999);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useFrame(() => {
    const aspect = size.width / size.height;
    const mx = mouseRef.current.x * 10 * aspect;
    const my = mouseRef.current.y * 5;
    const ink = getInkColor();

    particles.forEach((p, i) => {
      const dx = p.pos.x - mx;
      const dy = p.pos.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_DIST && dist > 0.001) {
        p.vel.x += (dx / dist) * REPEL_FORCE;
        p.vel.y += (dy / dist) * REPEL_FORCE;
      }
      p.vel.multiplyScalar(0.98);
      p.pos.add(p.vel);
      const hw = 10 * aspect;
      const hh = 5;
      if (p.pos.x < -hw) p.pos.x = hw;
      if (p.pos.x > hw) p.pos.x = -hw;
      if (p.pos.y < -hh) p.pos.y = hh;
      if (p.pos.y > hh) p.pos.y = -hh;
      posArray[i * 3] = p.pos.x;
      posArray[i * 3 + 1] = p.pos.y;
      posArray[i * 3 + 2] = 0;
    });

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      attr.set(posArray);
      attr.needsUpdate = true;
      (pointsRef.current.material as THREE.PointsMaterial).color.copy(ink);
    }

    const linePositions: number[] = [];
    const lineColors: number[] = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = particles[i].pos.distanceTo(particles[j].pos);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          linePositions.push(particles[i].pos.x, particles[i].pos.y, 0);
          linePositions.push(particles[j].pos.x, particles[j].pos.y, 0);
          lineColors.push(ink.r, ink.g, ink.b, alpha, ink.r, ink.g, ink.b, alpha);
        }
      }
    }

    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      geo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 4));
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[posArray, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors={false} transparent opacity={0.65} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent />
      </lineSegments>
    </>
  );
}

export function ParticleConstellation() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: false }}
      style={{ background: "transparent" }}
    >
      <Particles />
    </Canvas>
  );
}
