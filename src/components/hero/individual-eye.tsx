"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { EYE_SPECIES, EyeSpeciesType } from "./eye-species";

interface IndividualEyeProps {
  species: EyeSpeciesType;
  x: number | string;
  y: number | string;
  isTracking: boolean;
  mousePos: { x: number; y: number };
}

export function IndividualEye({ species, x, y, isTracking, mousePos }: IndividualEyeProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [idleOffset, setIdleOffset] = useState(0);
  const [randomScan, setRandomScan] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  // Pupil movement springs for smooth tracking
  const springConfig = { damping: 20, stiffness: 150 };
  const pupilX = useSpring(0, springConfig);
  const pupilY = useSpring(0, springConfig);

  // Idle floating animation
  useEffect(() => {
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setIdleOffset(elapsed);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  // Random blinking and scanning
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    const scanInterval = setInterval(() => {
      if (!isTracking && Math.random() > 0.7) {
        setRandomScan({
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        });
      }
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(scanInterval);
    };
  }, [isTracking]);

  // Tracking logic
  useEffect(() => {
    if (isTracking && eyeRef.current) {
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mousePos.x - cx;
      const dy = mousePos.y - cy;
      const dist = Math.hypot(dx, dy);
      const ratio = Math.min(1, dist / 300);
      const maxOffset = species === "observer" ? 4 : 5;
      
      pupilX.set((dx / (dist || 1)) * maxOffset * ratio);
      pupilY.set((dy / (dist || 1)) * maxOffset * ratio);
    } else {
      pupilX.set(randomScan.x);
      pupilY.set(randomScan.y);
    }
  }, [isTracking, mousePos, randomScan, species, pupilX, pupilY]);

  const RenderEye = EYE_SPECIES[species];

  // Helper to get number for calculations
  const xNum = typeof x === "number" ? x : 0;

  return (
    <motion.div
      ref={eyeRef}
      className="absolute"
      style={{
        left: x,
        top: y,
        y: Math.sin(idleOffset * 2 + xNum * 0.05) * 3, // Float effect
      }}
    >
      <RenderEye 
        pupilX={pupilX.get()} 
        pupilY={pupilY.get()} 
        isBlinking={isBlinking} 
        idleOffset={idleOffset}
        isTracking={isTracking}
      />
    </motion.div>
  );
}
