"use client";

import { personalInfo } from "@/data/personal";
import { HeroButtons } from "@/components/hero/hero-buttons";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { HeroShapes } from "@/components/canvas/hero-shapes";
import { Environment } from "@react-three/drei";
import { useTheme } from "next-themes";

gsap.registerPlugin(ScrollTrigger);

export function HeroTerminal() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [firstName, lastName] = personalInfo.name.split(" ");
  const { resolvedTheme } = useTheme();

  const firstNameLetters = (firstName?.toUpperCase() || "ABDEL-AZIZ").split("");
  const lastNameLetters = (lastName?.toUpperCase() || "TEBBENG").split("");

  useEffect(() => {
    if (reduce || !container.current || !textRef.current) return;
    
    const ctx = gsap.context(() => {

      // Single scroll-scrubbed timeline (fully reversible on scroll up)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        }
      });

      // The black hole is perfectly centered in the Canvas (which fills the container)
      const containerRect = container.current!.getBoundingClientRect();
      const suctionX = containerRect.left + containerRect.width / 2;
      const suctionY = containerRect.top + containerRect.height / 2;

      // Each letter flies to the center of the h1 (black hole position)
      const letters = textRef.current!.querySelectorAll(".hero-letter");
      
      const maxExpectedDistance = containerRect.width / 2;
      
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        
        // How far this letter needs to travel to reach the black hole
        const dx = suctionX - letterCenterX;
        const dy = suctionY - letterCenterY;
        
        // Distance from center determines when it gets sucked in
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        const normalizedDistance = Math.min(1, distanceToCenter / maxExpectedDistance);
        
        // Center letters (L, B) start at 0, outer letters (A, G) start up to 0.4s later in the timeline
        const staggerDelay = normalizedDistance * 0.4;

        tl.to(letter, {
          x: dx,
          y: dy,
          scale: 0,
          opacity: 0,
          rotation: (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 60),
          ease: "power2.in",
          duration: 1,
        }, staggerDelay);
      });

      // Background fades out cleanly
      tl.to(bgRef.current, {
        opacity: 0,
        ease: "none",
        duration: 0.5,
      }, 0.8);

    }, container);
    
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={container} className="w-full h-screen relative flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Interactive 3D Background specifically for Hero */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={resolvedTheme === "dark" ? 0.3 : 0.8} />
          <directionalLight position={[10, 10, 10]} intensity={resolvedTheme === "dark" ? 1.5 : 0.8} />
          <Environment preset="city" />
          <HeroShapes theme={resolvedTheme} />
        </Canvas>
      </div>

      <div
        ref={textRef}
        className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center origin-center pointer-events-none"
      >
        
        <h1 className="text-[clamp(4rem,12vw,14rem)] font-extrabold tracking-tighter leading-[0.8] text-black dark:text-white w-full max-w-full">
          <span className="hero-row block whitespace-nowrap">
            {firstNameLetters.map((letter, i) => (
              <span 
                key={`first-${i}`} 
                className="hero-letter"
                style={{ display: "inline-block", transformOrigin: "center center" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </span>
          <span className="hero-row block whitespace-nowrap">
            {lastNameLetters.map((letter, i) => (
              <span 
                key={`last-${i}`} 
                className="hero-letter"
                style={{ display: "inline-block", transformOrigin: "center center" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </span>
        </h1>

      </div>
    </div>
  );
}
