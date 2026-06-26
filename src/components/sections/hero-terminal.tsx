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

gsap.registerPlugin(ScrollTrigger);

export function HeroTerminal() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [firstName, lastName] = personalInfo.name.split(" ");

  useEffect(() => {
    if (reduce || !container.current || !textRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from(".hero-item", {
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

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

      tl.to(bgRef.current, {
        opacity: 0,
        filter: "blur(20px)",
        ease: "none"
      }, 0);

      tl.to(textRef.current, {
        scale: 1.5,
        opacity: 0,
        filter: "blur(20px)",
        y: -100,
        ease: "power2.inOut"
      }, 0);

    }, container);
    
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={container} className="w-full h-screen relative flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Interactive 3D Background specifically for Hero */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="city" />
          <HeroShapes />
        </Canvas>
      </div>

      <div
        ref={textRef}
        className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center origin-center pointer-events-none"
      >
        
        <h1 className="hero-item text-[clamp(4rem,12vw,14rem)] font-extrabold tracking-tighter leading-[0.8] text-foreground w-full max-w-full pb-8 mix-blend-difference dark:mix-blend-normal">
          <span className="block">{firstName?.toUpperCase() || "ABDEL-AZIZ"}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">{lastName?.toUpperCase() || "TEBBENG"}</span>
        </h1>

        <div className="hero-item mt-4 pointer-events-auto">
          <HeroButtons />
        </div>
      </div>
    </div>
  );
}
