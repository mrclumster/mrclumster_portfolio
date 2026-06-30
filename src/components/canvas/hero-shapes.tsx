"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PresentationControls, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// 1. THE GLOWING CORE
function GlowingCore({ isDark, radius }: { isDark: boolean; radius: number }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Intense solid center */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[radius * 0.8, 64, 64]} />
        <meshBasicMaterial color={isDark ? 0xffffff : 0x000000} depthWrite={true} />
      </mesh>

      {/* Soft glow halo */}
      <mesh ref={glowRef} renderOrder={2}>
        <sphereGeometry args={[radius * 2.5, 64, 64]} />
        <meshBasicMaterial 
          color={isDark ? 0xffffff : 0x000000} 
          transparent={true} 
          opacity={isDark ? 0.15 : 0.12} 
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} 
          depthWrite={false} 
        />
      </mesh>
    </group>
  );
}

// 2. THE BLACK HOLE
export function HeroShapes({ theme }: { theme?: string }) {
  const isDark = theme === "dark";
  const group = useRef<THREE.Group>(null);
  
  const diskRef = useRef<THREE.InstancedMesh>(null);   // Flat accretion disk
  const cloudRef = useRef<THREE.InstancedMesh>(null);  // 3D ambient sparkle cloud
  const haloRef = useRef<THREE.InstancedMesh>(null);   // Bright halo ring particles

  // Particle counts per layer
  const DISK_COUNT = 8000;   // Flat swirling accretion disk
  const CLOUD_COUNT = 3000;  // 3D scattered sparkle particles
  const HALO_COUNT = 1000;   // Bright tight halo ring around the core

  const CORE_RADIUS = 0.2;
  const MAX_RADIUS = 10.0;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate all particle starting states
  const { diskData, cloudData, haloData } = useMemo(() => {
    const dData = [];
    const cData = [];
    const hData = [];

    // DISK: flat accretion disk particles
    for (let i = 0; i < DISK_COUNT; i++) {
      const distPercent = Math.pow(Math.random(), 1.6);
      const radius = CORE_RADIUS + distPercent * (MAX_RADIUS - CORE_RADIUS);
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 0.12;
      dData.push({
        angle, radius, yOffset,
        speed: 0.005 + Math.random() * 0.01,
        size: 0.4 + Math.random() * 1.2,
      });
    }

    // CLOUD: 3D scattered sparkle particles (full sphere)
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const distPercent = Math.pow(Math.random(), 1.2);
      const radius = CORE_RADIUS * 2 + distPercent * (MAX_RADIUS * 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      cData.push({
        theta, phi, radius,
        speed: 0.001 + Math.random() * 0.004,
        size: 0.3 + Math.random() * 0.8,
        flickerOffset: Math.random() * Math.PI * 2, // For twinkling
        flickerSpeed: 2 + Math.random() * 6,
      });
    }

    // HALO: tight bright ring close to the core
    for (let i = 0; i < HALO_COUNT; i++) {
      const radius = CORE_RADIUS + 0.05 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 0.03;
      hData.push({
        angle, radius, yOffset,
        speed: 0.01 + Math.random() * 0.02,
        size: 0.8 + Math.random() * 2.0,
      });
    }

    return { diskData: dData, cloudData: cData, haloData: hData };
  }, []);

  useFrame((state) => {
    if (!diskRef.current || !cloudRef.current || !haloRef.current) return;
    const t = state.clock.elapsedTime;

    // --- DISK PARTICLES (flat accretion disk) ---
    for (let i = 0; i < DISK_COUNT; i++) {
      const p = diskData[i];

      const gravity = 1 / Math.max(0.1, p.radius * p.radius);
      const spinSpeed = Math.min(0.04, gravity * 0.006 + p.speed * 0.15);
      const suckSpeed = 0.01 + (1 / Math.max(0.3, p.radius)) * 0.02;

      p.angle -= spinSpeed;
      p.radius -= suckSpeed;

      if (p.radius <= CORE_RADIUS) {
        p.radius = MAX_RADIUS;
        p.angle = Math.random() * Math.PI * 2;
      }

      const x = Math.cos(p.angle) * p.radius;
      const y = p.yOffset * (p.radius / MAX_RADIUS);
      const z = Math.sin(p.angle) * p.radius;

      dummy.position.set(x, y, z);
      const s = p.size * Math.min(1, p.radius / 3);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      diskRef.current.setMatrixAt(i, dummy.matrix);
    }

    // --- CLOUD PARTICLES (3D sparkle cloud, twinkling) ---
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const p = cloudData[i];

      // Drift inward with gentle tumble
      const spinSpeed = p.speed * 0.5;
      const suckSpeed = 0.005 + (1 / Math.max(0.5, p.radius)) * 0.01;

      p.theta -= spinSpeed;
      p.phi += spinSpeed * 0.2;
      p.radius -= suckSpeed;

      if (p.radius <= CORE_RADIUS * 2) {
        p.radius = MAX_RADIUS * 0.8;
        p.theta = Math.random() * Math.PI * 2;
        p.phi = Math.acos(2 * Math.random() - 1);
      }

      const x = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
      const y = p.radius * Math.cos(p.phi);
      const z = p.radius * Math.sin(p.phi) * Math.sin(p.theta);

      dummy.position.set(x, y, z);

      // Twinkle/flicker: scale oscillates over time
      const flicker = 0.3 + 0.7 * Math.abs(Math.sin(t * p.flickerSpeed + p.flickerOffset));
      const s = p.size * flicker;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      cloudRef.current.setMatrixAt(i, dummy.matrix);
    }

    // --- HALO PARTICLES (bright tight ring) ---
    for (let i = 0; i < HALO_COUNT; i++) {
      const p = haloData[i];

      p.angle -= p.speed;
      p.radius -= 0.008;

      if (p.radius <= CORE_RADIUS) {
        p.radius = CORE_RADIUS + 0.05 + Math.random() * 0.8;
        p.angle = Math.random() * Math.PI * 2;
      }

      const x = Math.cos(p.angle) * p.radius;
      const y = p.yOffset;
      const z = Math.sin(p.angle) * p.radius;

      dummy.position.set(x, y, z);
      const s = p.size * (0.5 + 0.5 * Math.sin(t * 4 + i));
      dummy.scale.set(s, s, s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      haloRef.current.setMatrixAt(i, dummy.matrix);
    }

    diskRef.current.instanceMatrix.needsUpdate = true;
    cloudRef.current.instanceMatrix.needsUpdate = true;
    haloRef.current.instanceMatrix.needsUpdate = true;

    if (group.current) {
      group.current.rotation.x = Math.sin(t * 0.1) * 0.05;
      group.current.rotation.z = Math.cos(t * 0.05) * 0.05;
    }
  });

  return (
    <PresentationControls
      global
      rotation={[0.5, 0, 0]} 
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      {/* SPRINKLE SPRINKLE */}
      {isDark && <Stars radius={50} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />}
      <Sparkles count={3000} scale={20} size={isDark ? 1.5 : 3} speed={0.4} opacity={isDark ? 0.3 : 0.8} color={isDark ? 0xffffff : 0x000000} />

      <group ref={group}>
        
        <GlowingCore isDark={isDark} radius={CORE_RADIUS} />

        {/* LAYER 1: Flat accretion disk particles */}
        <instancedMesh ref={diskRef} args={[undefined, undefined, DISK_COUNT]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial 
            color={isDark ? 0xffffff : 0x000000} 
            transparent={true}
            opacity={isDark ? 0.6 : 0.8}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </instancedMesh>

        {/* LAYER 2: 3D sparkle cloud (twinkling ambient particles) */}
        <instancedMesh ref={cloudRef} args={[undefined, undefined, CLOUD_COUNT]}>
          <sphereGeometry args={[0.005, 4, 4]} />
          <meshBasicMaterial 
            color={isDark ? 0xccccff : 0x1a1a3a} 
            transparent={true}
            opacity={isDark ? 0.5 : 0.65}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </instancedMesh>

        {/* LAYER 3: Bright halo ring */}
        <instancedMesh ref={haloRef} args={[undefined, undefined, HALO_COUNT]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshBasicMaterial 
            color={isDark ? 0xffffff : 0x000000} 
            transparent={true}
            opacity={0.9}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </instancedMesh>

      </group>
    </PresentationControls>
  );
}
