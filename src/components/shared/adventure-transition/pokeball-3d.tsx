"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Points,
  PointMaterial,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh, Points as ThreePoints } from "three";

interface SceneProps {
  /** Master timeline elapsed (ms). Drives every effect. */
  t: number;
}

const PARTICLE_COUNT = 60;

/**
 * Cinematic timeline (ms). The component is a pure function of t, so
 * everything stays deterministic and the orchestrator can scrub through it.
 */
const BEAT = {
  spawnEnd: 600,        // 0..600     ball falls + bounces in
  introEnd: 1200,       // 600..1200  tilt toward camera, look around
  whipEnd: 1700,        // 1200..1700 fast whip-spin (motion-streak on band)
  chargeEnd: 2400,      // 1700..2400 shake + glow + ring brightens
  openEnd: 3200,        // 2400..3200 lid opens in slow-mo, soul + beam
  dollyEnd: 3800,       // 3200..3800 camera dives into the ball
} as const;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x: number) => x * x * x;
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
// Slow-mo curve: starts slow, speeds up only at the very end
const slowMoEase = (x: number) => Math.pow(x, 1.8);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function Pokeball({ t }: SceneProps) {
  const groupRef = useRef<Group>(null);
  const topRef = useRef<Group>(null);
  const buttonRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const soulRef = useRef<Mesh>(null);
  const beamRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const sparksRef = useRef<ThreePoints>(null);

  // Stable PRNG-seeded particle layout
  const particles = useMemo(() => {
    let seed = 0x9e3779b9;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let n = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
      return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = 1.4 + rand() * 0.6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (rand() - 0.5) * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      seeds[i * 3] = rand();
      seeds[i * 3 + 1] = rand();
      seeds[i * 3 + 2] = rand();
    }
    return { positions, seeds };
  }, []);

  useFrame(() => {
    if (!groupRef.current || !topRef.current) return;

    // ── Beat 1: Spawn (fall + bounce) ─────────────────────────────────
    if (t <= BEAT.spawnEnd) {
      const p = clamp01(t / BEAT.spawnEnd);
      const fall = easeInCubic(Math.min(p / 0.6, 1));
      let y = 4 - fall * 4;
      if (p > 0.6) {
        const bp = (p - 0.6) / 0.4;
        const bounce = Math.exp(-bp * 5) * Math.sin(bp * Math.PI * 4) * 0.22;
        y = bounce;
        const squash = Math.max(0, Math.exp(-bp * 8)) * 0.22;
        groupRef.current.scale.set(1 + squash, 1 - squash, 1 + squash);
      } else {
        groupRef.current.scale.setScalar(1);
      }
      groupRef.current.position.set(0, y, 0);
      groupRef.current.rotation.set(0, 0, 0);
    }

    // ── Beat 2: Intro — tilt toward camera, "look around" ─────────────
    else if (t <= BEAT.introEnd) {
      const p = (t - BEAT.spawnEnd) / (BEAT.introEnd - BEAT.spawnEnd);
      // Float up a touch, then tilt to face camera
      const lift = Math.sin(p * Math.PI) * 0.12;
      groupRef.current.position.set(0, lift, 0);
      // Tilt forward (X axis) — like nodding to camera
      const tilt = easeInOutCubic(Math.min(p * 2, 1)) * 0.35;
      // Look-around (Y axis) — slow swing left then right
      const lookY = Math.sin(p * Math.PI * 1.2) * 0.6;
      groupRef.current.rotation.set(tilt, lookY, 0);
      groupRef.current.scale.setScalar(1);
    }

    // ── Beat 3: Whip — fast spin with motion blur on band ─────────────
    else if (t <= BEAT.whipEnd) {
      const p = (t - BEAT.introEnd) / (BEAT.whipEnd - BEAT.introEnd);
      // Spin angular velocity ramps up then down
      const speed = Math.sin(p * Math.PI) * 8;
      const angleAccum = p * Math.PI * 4 * easeOutCubic(p);
      groupRef.current.position.set(0, 0.05, 0);
      groupRef.current.rotation.set(0.2 * (1 - p), angleAccum, 0);
      groupRef.current.scale.setScalar(1);
      // (speed used to drive band streak intensity if we add a custom mat later)
      void speed;
    }

    // ── Beat 4: Charge-up ─────────────────────────────────────────────
    else if (t <= BEAT.chargeEnd) {
      const p = (t - BEAT.whipEnd) / (BEAT.chargeEnd - BEAT.whipEnd);
      const shakeAmp = p * 0.07;
      const x = (Math.random() - 0.5) * shakeAmp;
      const y = (Math.random() - 0.5) * shakeAmp;
      groupRef.current.position.set(x, y, 0);
      groupRef.current.rotation.set(0, p * 2.5, 0);
      groupRef.current.scale.setScalar(1);

      if (buttonRef.current) {
        const mat = buttonRef.current.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color("#ffeeaa");
        mat.emissiveIntensity = p * 3;
      }
      if (haloRef.current) {
        const mat = haloRef.current.material as THREE.MeshStandardMaterial;
        mat.opacity = p * 0.45;
        haloRef.current.scale.setScalar(1.05 + p * 0.45);
      }
    }

    // ── Beat 5: Open — slow-mo lid rotation, soul + beam ──────────────
    else if (t <= BEAT.openEnd) {
      const raw = (t - BEAT.chargeEnd) / (BEAT.openEnd - BEAT.chargeEnd);
      const p = slowMoEase(raw);
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      topRef.current.rotation.x = -p * Math.PI * 0.7;
      topRef.current.position.y = p * 0.22;

      if (soulRef.current) {
        soulRef.current.scale.setScalar(p * 0.65);
        const mat = soulRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1 + p * 5;
      }
      if (beamRef.current) {
        beamRef.current.scale.set(1 + p * 0.5, p * 14, 1 + p * 0.5);
        beamRef.current.position.y = p * 7;
        const mat = beamRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = p * 0.85;
      }
    }

    // ── Beat 6: Dolly — hold open state, camera does the work ────────
    else {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      topRef.current.rotation.x = -Math.PI * 0.7;
      topRef.current.position.y = 0.22;
      if (soulRef.current) {
        const mat = soulRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 6;
      }
    }

    // ── Energy rings (Saturn-style) ───────────────────────────────────
    // Visible from intro onward, brightest during charge & open.
    if (ringRef.current && ring2Ref.current) {
      let ringOpacity = 0;
      let ringScale = 1.5;
      if (t > BEAT.spawnEnd) {
        const since = t - BEAT.spawnEnd;
        ringOpacity = clamp01(since / 600) * 0.85;
      }
      if (t > BEAT.whipEnd) {
        const cp = clamp01((t - BEAT.whipEnd) / (BEAT.chargeEnd - BEAT.whipEnd));
        ringOpacity = 0.85 + cp * 0.15;
        ringScale = 1.5 + cp * 0.3;
      }
      if (t > BEAT.openEnd) {
        ringOpacity = Math.max(0, 1 - (t - BEAT.openEnd) / 600);
      }

      ringRef.current.rotation.z = t * 0.002;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.0008) * 0.15;
      ringRef.current.scale.setScalar(ringScale);
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = ringOpacity;

      ring2Ref.current.rotation.z = -t * 0.0015;
      ring2Ref.current.rotation.x = Math.PI / 2 + 0.3 + Math.cos(t * 0.001) * 0.15;
      ring2Ref.current.scale.setScalar(ringScale * 1.18);
      const ring2Mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      ring2Mat.opacity = ringOpacity * 0.7;
    }

    // ── Particles: orbit then explode ─────────────────────────────────
    if (sparksRef.current) {
      const positions = sparksRef.current.geometry.attributes.position
        .array as Float32Array;
      const seeds = particles.seeds;
      const opening = t > BEAT.chargeEnd;
      const explodeP = opening ? clamp01((t - BEAT.chargeEnd) / 800) : 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const baseAngle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const orbitT = t * 0.0009 + seeds[i * 3] * Math.PI * 2;
        const orbitR = 1.5 + Math.sin(t * 0.001 + seeds[i * 3 + 1] * 6) * 0.18;

        if (!opening) {
          positions[i * 3] = Math.cos(baseAngle + orbitT) * orbitR;
          positions[i * 3 + 1] = Math.sin(t * 0.002 + seeds[i * 3 + 2] * 6) * 0.5;
          positions[i * 3 + 2] = Math.sin(baseAngle + orbitT) * orbitR;
        } else {
          const dir = new THREE.Vector3(
            Math.cos(baseAngle) * (0.5 + seeds[i * 3]),
            (seeds[i * 3 + 1] - 0.5) * 2,
            Math.sin(baseAngle) * (0.5 + seeds[i * 3 + 2])
          ).normalize();
          const dist = 1.5 + explodeP * 8;
          positions[i * 3] = dir.x * dist;
          positions[i * 3 + 1] = dir.y * dist;
          positions[i * 3 + 2] = dir.z * dist;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;

      const mat = sparksRef.current.material as THREE.PointsMaterial;
      mat.opacity = opening ? Math.max(0, 1 - explodeP * 0.6) : 0.85;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Bottom hemisphere */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <sphereGeometry
            args={[1, 64, 48, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#f4f4f4"
            roughness={0.18}
            metalness={0.5}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Top hemisphere — hinged */}
        <group ref={topRef}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <sphereGeometry args={[1, 64, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#e63946"
              roughness={0.16}
              metalness={0.55}
              envMapIntensity={1.4}
            />
          </mesh>
        </group>

        {/* Equator band */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.005, 1.005, 0.06, 64]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Center button — outer black ring */}
        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Center button — glowing white core */}
        <mesh ref={buttonRef} position={[0, 0, 1.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.15}
            metalness={0.2}
            emissive="#000000"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Halo shell */}
        <mesh ref={haloRef}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color="#ffd166"
            transparent
            opacity={0}
            emissive="#ffaa44"
            emissiveIntensity={0.7}
            depthWrite={false}
          />
        </mesh>

        {/* Soul / energy core */}
        <mesh ref={soulRef} scale={0}>
          <sphereGeometry args={[0.6, 32, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffeeaa"
            emissiveIntensity={1}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Light beam shooting up from inside */}
        <mesh ref={beamRef} position={[0, 0, 0]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.3, 0.55, 1, 16, 1, true]} />
          <meshBasicMaterial
            color="#fff5cc"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Saturn-style energy rings */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.03, 8, 96]} />
          <meshBasicMaterial
            color="#ffd166"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.022, 8, 96]} />
          <meshBasicMaterial
            color="#ff9b54"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.55}
        scale={8}
        blur={2.6}
        far={4}
      />

      {/* Particles */}
      <Points ref={sparksRef} positions={particles.positions} stride={3}>
        <PointMaterial
          transparent
          color="#ffd966"
          size={0.07}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  );
}

function CameraRig({ t }: SceneProps) {
  const { camera } = useThree();

  useFrame(() => {
    let x = 0;
    let y = 0.4;
    let z = 5;
    let lookX = 0;
    const lookY = 0;

    if (t < BEAT.introEnd) {
      // Settle in close after spawn
      const p = clamp01(t / BEAT.introEnd);
      z = 5.5 - easeOutCubic(p) * 0.7;
    } else if (t < BEAT.chargeEnd) {
      // Orbital arc from front-right around to front-left, showing off the 3D
      const p = clamp01((t - BEAT.introEnd) / (BEAT.chargeEnd - BEAT.introEnd));
      const angle = -Math.PI * 0.35 + easeInOutCubic(p) * Math.PI * 0.7;
      const radius = 4.7;
      x = Math.sin(angle) * radius;
      z = Math.cos(angle) * radius;
      y = 0.4 + Math.sin(p * Math.PI) * 0.25;
      lookX = 0;
    } else if (t < BEAT.openEnd) {
      // Settle to front-center for the opening shot
      const p = clamp01((t - BEAT.chargeEnd) / (BEAT.openEnd - BEAT.chargeEnd));
      const startX = Math.sin(Math.PI * 0.35) * 4.7;
      const startZ = Math.cos(Math.PI * 0.35) * 4.7;
      x = startX * (1 - easeInOutCubic(p));
      z = startZ + (4 - startZ) * easeInOutCubic(p);
      y = 0.4;
    } else {
      // Final dolly into the ball
      const p = clamp01((t - BEAT.openEnd) / (BEAT.dollyEnd - BEAT.openEnd));
      x = 0;
      z = 4 - easeInCubic(p) * 3.6;
      y = 0.4;
    }

    // Camera shake during charge-up
    if (t > BEAT.whipEnd && t < BEAT.chargeEnd) {
      const p = (t - BEAT.whipEnd) / (BEAT.chargeEnd - BEAT.whipEnd);
      const amp = p * 0.05;
      x += (Math.random() - 0.5) * amp;
      y += (Math.random() - 0.5) * amp;
    }

    camera.position.set(x, y, z);
    camera.lookAt(lookX, lookY, 0);
  });

  return null;
}

interface Pokeball3DProps {
  t: number;
}

export function Pokeball3D({ t }: Pokeball3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* Reflective environment — gives the metallic shell real depth.
          Wrapped in Suspense because Environment loads an HDR async. */}
      <Suspense fallback={null}>
        <Environment preset="sunset" resolution={64} />
      </Suspense>

      {/* Three-point lighting on top of the env map */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff5e6" />
      <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#9bbcff" />
      <directionalLight position={[0, -2, -4]} intensity={0.35} color="#ffe9b0" />

      <Pokeball t={t} />
      <CameraRig t={t} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.4}
          kernelSize={2}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0009, 0.0009]}
        />
      </EffectComposer>
    </Canvas>
  );
}
