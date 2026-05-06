"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 7;
const ROWS = 9;

interface ShardMeta {
  mesh: THREE.Mesh;
  originPos: THREE.Vector3;
  originRot: { x: number; y: number; z: number };
  scatterPos: THREE.Vector3;
  scatterRot: { x: number; y: number; z: number };
}

interface ShardFieldProps {
  imageSrc: string;
}

function ShardField({ imageSrc }: ShardFieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const shardsRef = useRef<ShardMeta[]>([]);
  const scatteredRef = useRef(false);
  const progressRef = useRef(0);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageSrc);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageSrc]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    // Clear previous
    while (group.children.length) group.remove(group.children[0]);
    shardsRef.current = [];

    const W = 3.0;
    const H = 3.8;
    const sw = W / COLS;
    const sh = H / ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const u0 = c / COLS;
        const u1 = (c + 1) / COLS;
        const v0 = 1 - (r + 1) / ROWS;
        const v1 = 1 - r / ROWS;
        const cx = -W / 2 + sw * c + sw / 2;
        const cy = H / 2 - sh * r - sh / 2;

        // Two triangles per cell
        const triangles: [number[], number[]][] = [
          [
            [-sw / 2, -sh / 2, 0, sw / 2, -sh / 2, 0, -sw / 2, sh / 2, 0],
            [u0, v0, u1, v0, u0, v1],
          ],
          [
            [sw / 2, -sh / 2, 0, sw / 2, sh / 2, 0, -sw / 2, sh / 2, 0],
            [u1, v0, u1, v1, u0, v1],
          ],
        ];

        triangles.forEach(([verts, uvs]) => {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
          geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
          geo.computeVertexNormals();

          const mat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(geo, mat);
          const jx = (Math.random() - 0.5) * 0.015;
          const jy = (Math.random() - 0.5) * 0.015;
          mesh.position.set(cx + jx, cy + jy, (Math.random() - 0.5) * 0.04);

          const originPos = mesh.position.clone();
          const originRot = { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z };

          const angle = Math.atan2(cy, cx);
          const dist = 1.5 + Math.random() * 2.5;
          const scatterPos = new THREE.Vector3(
            cx + Math.cos(angle) * dist * (0.5 + Math.random()),
            cy + Math.sin(angle) * dist * (0.5 + Math.random()),
            (Math.random() - 0.5) * 2.5
          );
          const scatterRot = {
            x: (Math.random() - 0.5) * 1.4,
            y: (Math.random() - 0.5) * 1.4,
            z: (Math.random() - 0.5) * 0.8,
          };

          group.add(mesh);
          shardsRef.current.push({ mesh, originPos, originRot, scatterPos, scatterRot });
        });
      }
    }
  }, [texture]);

  useFrame((_, delta) => {
    const target = scatteredRef.current ? 1 : 0;
    progressRef.current += (target - progressRef.current) * Math.min(delta * 3.5, 1);
    const p = progressRef.current;

    shardsRef.current.forEach((s) => {
      s.mesh.position.lerpVectors(s.originPos, s.scatterPos, p);
      s.mesh.rotation.x = s.originRot.x + (s.scatterRot.x - s.originRot.x) * p;
      s.mesh.rotation.y = s.originRot.y + (s.scatterRot.y - s.originRot.y) * p;
      s.mesh.rotation.z = s.originRot.z + (s.scatterRot.z - s.originRot.z) * p;
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => { scatteredRef.current = true; }}
      onPointerLeave={() => { scatteredRef.current = false; }}
    />
  );
}

interface ShatteredPortraitProps {
  imageSrc: string;
}

export function ShatteredPortrait({ imageSrc }: ShatteredPortraitProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 48 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.4} />
      <ShardField imageSrc={imageSrc} />
    </Canvas>
  );
}
