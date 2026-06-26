"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a subtle Cyber Violet / Blue for the glass material
  const glassColor = new THREE.Color(0x3a00ff); 

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const scrollY = window.scrollY;
    const time = state.clock.getElapsedTime();
    
    // Slow, majestic rotation that speeds up slightly on scroll
    meshRef.current.rotation.x = time * 0.1 + scrollY * 0.001;
    meshRef.current.rotation.y = time * 0.15 + scrollY * 0.0015;
    
    // Subtle floating animation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={1.8}>
      <icosahedronGeometry args={[3, 0]} />
      <meshPhysicalMaterial 
        color={0x111111}
        emissive={glassColor}
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0.9}
        transparent={true}
        opacity={0.8}
        wireframe={true}
        // To make it look like a sleek wireframe glass cage rather than a solid blob
      />
    </mesh>
  );
}
