"use client";

import { experiences, type Experience } from "@/data/experience";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

function ExperienceEntry({ entry, index }: { entry: Experience; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !cardRef.current) return;
    
    gsap.fromTo(cardRef.current, 
      { 
        y: 100, 
        opacity: 0,
        filter: "blur(10px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        }
      }
    );
  }, [reduce]);

  return (
    <article 
      ref={cardRef} 
      className="group relative w-full flex flex-col lg:flex-row gap-8 p-8 md:p-12 bg-background/20 backdrop-blur-xl border border-foreground/10 hover:border-foreground/30 hover:bg-background/40 transition-all duration-500 mb-8 overflow-hidden"
    >
      {/* Massive subtle year watermark */}
      <div className="absolute -right-8 -top-12 text-[12rem] font-black text-foreground/[0.03] select-none pointer-events-none group-hover:text-primary/[0.05] transition-colors duration-500">
        {entry.period.split(" ")[entry.period.split(" ").length - 1]}
      </div>

      <div className="lg:w-1/3 flex flex-col gap-2 relative z-10">
        <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-primary mb-2">
          {entry.period}
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
          {entry.title}
        </h3>
        <div>
          {entry.companyUrl ? (
            <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="text-xl text-muted-foreground hover:text-primary transition-colors font-medium">
              {entry.company} ↗
            </a>
          ) : (
            <span className="text-xl text-muted-foreground font-medium">{entry.company}</span>
          )}
        </div>
      </div>
      
      <div className="lg:w-2/3 relative z-10 flex flex-col justify-center">
        <p className="text-lg text-foreground/80 leading-relaxed mb-6">
          {entry.description}
        </p>
        
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.highlights.map((h, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="text-primary font-black text-xl leading-none mt-1 shrink-0">+</span>
                <span className="text-muted-foreground font-medium leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ExperienceLog() {
  return (
    <div className="w-full flex flex-col">
      {experiences.map((entry, i) => (
        <ExperienceEntry key={i} entry={entry} index={i} />
      ))}
    </div>
  );
}
