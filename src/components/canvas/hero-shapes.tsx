"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

export function HeroShapes() {
  const group = useRef<THREE.Group>(null);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.8,
    ior: 1.5,
    thickness: 2.0,
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x5a00ff, // Cyber violet accent
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 4;
    group.current.rotation.x = Math.cos(t / 4) / 4;
  });

  return (
    <PresentationControls
      global
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      <group ref={group}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh material={material} position={[0, 0, 0]} scale={1.5}>
            <octahedronGeometry args={[1, 0]} />
          </mesh>
        </Float>
        
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
          <mesh material={wireframeMaterial} position={[2.5, 1, -2]} scale={0.8}>
            <icosahedronGeometry args={[1, 0]} />
          </mesh>
        </Float>
        
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
          <mesh material={material} position={[-2, -1.5, 1]} scale={0.6}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
        </Float>
        
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <mesh material={wireframeMaterial} position={[1.5, -2, 2]} scale={0.4}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </Float>
      </group>
    </PresentationControls>
  );
}
