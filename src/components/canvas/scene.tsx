"use client";

import { Canvas } from "@react-three/fiber";
import { FloatingShape } from "./floating-shape";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function Scene() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-30] opacity-50">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }} 
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <FloatingShape />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
