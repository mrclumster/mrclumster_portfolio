"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function AboutTerminal() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !container.current || !textRef.current) return;
    
    const words = textRef.current.querySelectorAll('.scrub-word');
    
    const ctx = gsap.context(() => {
      gsap.fromTo(words, 
        { opacity: 0.1, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "center center",
            end: "+=150%", // Pin and scrub
            scrub: 1,      
            pin: true,
            pinSpacing: true, 
          }
        }
      );
    }, container);
    
    return () => ctx.revert();
  }, [reduce]);

  // Keep it ultra minimal to focus purely on the scrollytelling effect
  const minimalText = "I build for impact. Less talk, more action. Scroll down to see my work.";
  const wordsArray = minimalText.split(" ");

  return (
    <div ref={container} className="w-full flex flex-col items-center justify-center min-h-screen text-center py-20">
      <div 
        ref={textRef}
        className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[1.1] max-w-5xl text-foreground"
      >
        {wordsArray.map((word, i) => (
          <span key={i}>
            <span className="scrub-word inline-block">{word}</span>
            {i < wordsArray.length - 1 && " "}
          </span>
        ))}
      </div>
    </div>
  );
}
