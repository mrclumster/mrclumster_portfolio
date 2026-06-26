"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StackTable() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const categories = [
    {
      title: "Frontend Architecture",
      items: ["React 19", "Next.js App Router", "Tailwind CSS v4", "GSAP & Motion", "WebGL & Three.js"],
      color: "bg-background/20 backdrop-blur-2xl border-white/10 text-foreground",
    },
    {
      title: "Backend Systems",
      items: ["Node.js", "PostgreSQL", "Supabase", "Redis"],
      color: "bg-background/20 backdrop-blur-2xl border-white/10 text-foreground",
    },
    {
      title: "Applied AI",
      items: ["PyTorch", "TensorFlow", "YOLOv8", "Computer Vision"],
      color: "bg-background/20 backdrop-blur-2xl border-white/10 text-foreground",
    },
    {
      title: "DevOps & Mobile",
      items: ["Docker", "GitHub Actions", "React Native", "Flutter", "Swift"],
      color: "bg-background/20 backdrop-blur-2xl border-white/10 text-foreground",
    },
  ];

  useEffect(() => {
    if (reduce || !container.current || !cardsRef.current) return;
    
    const cards = gsap.utils.toArray<HTMLElement>('.flying-card');
    
    const ctx = gsap.context(() => {
      // Pin the whole container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "center center",
          end: `+=${cards.length * 100}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
        }
      });

      cards.forEach((card, i) => {
        // Skip the first card's entrance (it's already there)
        if (i > 0) {
          tl.from(card, {
            y: "150vh",
            scale: 1.5,
            rotateZ: i % 2 === 0 ? 15 : -15,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
          }, i * 1);
        }

        // Animate all previous cards down slightly to create a deck stacking effect
        if (i < cards.length - 1) {
          tl.to(cards.slice(0, i + 1), {
            y: (idx) => -((i + 1 - idx) * 30),
            scale: (idx) => 1 - ((i + 1 - idx) * 0.05),
            filter: "blur(2px)",
            opacity: 0.6,
            duration: 1,
            ease: "none"
          }, (i + 1) * 1 - 0.5); // Start slightly before the new card fully lands
        }
      });

    }, container);
    
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={container} className="w-full h-screen flex flex-col items-center justify-center overflow-hidden relative perspective-[1000px]">
      <h2 className="absolute top-12 md:top-24 text-[clamp(4rem,12vw,15rem)] font-extrabold tracking-tighter text-border/20 uppercase whitespace-nowrap select-none pointer-events-none mix-blend-overlay z-0">
        ARSENAL
      </h2>
      
      <div ref={cardsRef} className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center z-10">
        {categories.map((cat, i) => (
          <div 
            key={cat.title} 
            className={`flying-card absolute w-[90%] md:w-full h-full p-8 md:p-16 border-[4px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden origin-bottom ${cat.color}`}
            style={{ zIndex: i }}
          >
            {/* Grain/noise texture overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
            
            <h3 className="font-extrabold text-4xl md:text-7xl tracking-tighter leading-none mb-6 uppercase">
              {cat.title}
            </h3>
            
            <div className="flex flex-wrap gap-4 mt-auto">
              {cat.items.map((item) => (
                <span 
                  key={item} 
                  className="px-6 py-3 rounded-none bg-background/20 backdrop-blur-md border-[2px] border-current text-sm md:text-xl font-bold uppercase tracking-widest hover:bg-current hover:text-background transition-colors duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
