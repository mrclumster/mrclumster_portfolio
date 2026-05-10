"use client";

import React, { useRef, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

interface ArcEyeProps {
  leftBracket: string;
  rightBracket: string;
  x: number;
  y: number;
  rotation: number;
  mousePos: { x: number; y: number };
}

export function ArcEye({ leftBracket, rightBracket, x, y, rotation, mousePos }: ArcEyeProps) {
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
      const maxOffset = 3;
      
      pupilX.set((dx / (dist || 1)) * maxOffset * ratio);
      pupilY.set((dy / (dist || 1)) * maxOffset * ratio);
    }
  }, [mousePos, pupilX, pupilY]);

  return (
    <div
      ref={eyeRef}
      className="absolute flex items-center justify-center font-mono text-[14px]"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        color: "var(--ink)",
      }}
    >
      <span className="w-2 text-center">{leftBracket}</span>
      <div className="w-3.5 h-3.5 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden mx-1">
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
      <span className="w-2 text-center">{rightBracket}</span>
    </div>
  );
}
