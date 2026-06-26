"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        // Only animate scaling for all but the last card
        if (i < cardEls.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: cardEls[cardEls.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
          
          gsap.to(card, {
            scale: 0.85 - (cardEls.length - i) * 0.04,
            opacity: 0.3,
            filter: "blur(20px)",
            y: -50 * (cardEls.length - i),
            ease: "none",
            scrollTrigger: {
              trigger: cardEls[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        } else {
          // Last card just pins for a bit to hold the scroll
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            end: "+=150%",
            pin: true,
          });
        }
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center bg-transparent w-full origin-top"
          style={{ zIndex: i }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
