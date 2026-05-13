"use client";

import React, { useRef, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArcEyeProps {
  leftBracket: string;
  rightBracket: string;
  x: number;
  y: number;
  rotation: number;
  mousePos: { x: number; y: number };
  shape: string;
}

export function ArcEye({ leftBracket, rightBracket, x, y, rotation, mousePos, shape }: ArcEyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 20, stiffness: 150 };
  const pupilX = useSpring(0, springConfig);
  const pupilY = useSpring(0, springConfig);

  useEffect(() => {
    if (eyeRef.current) {
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mousePos.x - cx;
      const dy = mousePos.y - cy;
      const dist = Math.hypot(dx, dy);
      const ratio = Math.min(1, dist / 200);
      const maxOffset = 4; // Increased from 3 for larger eye
      
      // Calculate local coordinates for the pupil to follow mouse correctly despite rotation
      const angleRad = (rotation * Math.PI) / 180;
      const localX = dx * Math.cos(angleRad) + dy * Math.sin(angleRad);
      const localY = -dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
      const localDist = Math.hypot(localX, localY);
      
      pupilX.set((localX / (localDist || 1)) * maxOffset * ratio);
      pupilY.set((localY / (localDist || 1)) * maxOffset * ratio);
    }
  }, [mousePos, pupilX, pupilY, rotation]);

  return (
    <div
      ref={eyeRef}
      className="absolute flex items-center justify-center font-mono text-[16px]"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        color: "var(--ink)",
      }}
    >
      <span className="w-2.5 text-center">{leftBracket}</span>
      <div className="flex gap-0.5 mx-1">
        {[0, 1].map((i) => (
          <div 
            key={i}
            className={cn(
              "w-3 h-3 border border-[color:var(--ink)] bg-[color:var(--paper)] relative overflow-hidden",
              shape === "circle" && "rounded-full",
              shape === "square" && "rounded-none",
              shape === "diamond" && "rounded-none rotate-45"
            )}
          >
            <motion.div 
              className="w-1 h-1 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
              style={{ 
                x: pupilX, 
                y: pupilY,
                translateX: "-50%",
                translateY: "-50%" 
              }}
            />
          </div>
        ))}
      </div>
      <span className="w-2.5 text-center">{rightBracket}</span>
    </div>
  );
}
