"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { techStack } from "@/data/tech-stack";

type NodeData = {
  label: string;
  pos: THREE.Vector3;
  isCat: boolean;
};

type EdgeData = {
  a: number;
  b: number;
};

function buildGraph(): { nodes: NodeData[]; edges: EdgeData[] } {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];
  const catCount = techStack.length;

  techStack.forEach((cat, ci) => {
    const catAngle = (ci / catCount) * Math.PI * 2 - Math.PI / 2;
    const catR = 3.2;
    const cx = Math.cos(catAngle) * catR;
    const cy = Math.sin(catAngle) * catR;
    const catIdx = nodes.length;
    nodes.push({ label: cat.category, pos: new THREE.Vector3(cx, cy, 0), isCat: true });

    cat.items.forEach((item, ii) => {
      const spread = Math.min(cat.items.length, 6);
      const itemAngle = catAngle + ((ii - (cat.items.length - 1) / 2) / spread) * 1.1;
      const itemR = catR + 1.4;
      const ix = Math.cos(itemAngle) * itemR;
      const iy = Math.sin(itemAngle) * itemR;
      const itemIdx = nodes.length;
      nodes.push({
        label: item.name,
        pos: new THREE.Vector3(ix, iy, (Math.random() - 0.5) * 0.3),
        isCat: false,
      });
      edges.push({ a: catIdx, b: itemIdx });
    });
  });

  return { nodes, edges };
}

function getInk(): string {
  if (typeof document === "undefined") return "#1a1a1a";
  return document.documentElement.classList.contains("dark") ? "#e8e4dc" : "#1a1a1a";
}

function NetworkScene() {
  const { nodes, edges } = useMemo(buildGraph, []);
  const groupRef = useRef<THREE.Group>(null!);
  const hoveredRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.12;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current) * 0.18;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.7) * 0.06;
    }
  });

  const ink = getInk();

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {edges.map((e, i) => {
        const a = nodes[e.a].pos;
        const b = nodes[e.b].pos;
        const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(b, a);
        const len = dir.length();
        const axis = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize());
        return (
          <mesh key={`edge-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.006, 0.006, len, 4]} />
            <meshBasicMaterial color={ink} transparent opacity={0.18} />
          </mesh>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const size = n.isCat ? 0.16 : 0.09;
        return (
          <group key={`node-${i}`} position={n.pos}>
            <mesh
              onPointerEnter={() => { hoveredRef.current = i; }}
              onPointerLeave={() => { hoveredRef.current = null; }}
            >
              <sphereGeometry args={[size, 10, 10]} />
              <meshStandardMaterial
                color={ink}
                emissive={ink}
                emissiveIntensity={hoveredRef.current === i ? 1.0 : n.isCat ? 0.3 : 0.1}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            <Text
              position={[0, size + 0.1, 0]}
              fontSize={n.isCat ? 0.13 : 0.085}
              color={ink}
              anchorX="center"
              anchorY="bottom"
              maxWidth={1.5}
            >
              {n.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export function NeuralNetwork() {
  return (
    <div style={{ height: 380 }} className="w-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 4, 6]} intensity={0.6} />
        <NetworkScene />
      </Canvas>
    </div>
  );
}
