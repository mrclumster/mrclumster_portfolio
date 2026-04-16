"use client";

import { useEffect, useRef, useState } from "react";

interface CardSnapshot {
  key: number;
  top: number;
  left: number;
  width: number;
  height: number;
  html: string;
}

interface PuzzleBreakOverlayProps {
  active: boolean;
}

export function PuzzleBreakOverlay({ active }: PuzzleBreakOverlayProps) {
  const [cards, setCards] = useState<CardSnapshot[]>([]);
  const [flash, setFlash] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cleanupRef = useRef<(() => void) | null>(null);
  const snapshotTaken = useRef(false);

  // Step 1 — snapshot card positions when triggered
  useEffect(() => {
    if (!active || snapshotTaken.current) return;
    snapshotTaken.current = true;

    const elements = document.querySelectorAll<HTMLElement>("[data-bento-card]");
    const snapshots: CardSnapshot[] = [];

    elements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      snapshots.push({
        key: i,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        html: el.innerHTML,
      });
    });

    setCards(snapshots);
  }, [active]);

  // Step 2 — start Matter.js physics after cards are rendered in DOM
  useEffect(() => {
    if (cards.length === 0) return;

    // Dynamically import so Matter.js (~200KB) never loads on the main portfolio
    import("matter-js").then((Matter) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const T = 80; // boundary thickness

      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 2.5 },
      });

      // One rigid body per card, placed at its exact screen position
      const bodies = cards.map((snap, i) => {
        const body = Matter.Bodies.rectangle(
          snap.left + snap.width / 2,
          snap.top + snap.height / 2,
          snap.width,
          snap.height,
          {
            restitution: 0.25,  // slight bounce on landing
            friction: 0.55,
            frictionAir: 0.014,
            label: `card-${i}`,
          }
        );
        // Give each card a random tumble + gentle horizontal nudge
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.14);
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 5,
          y: 0.8,
        });
        return body;
      });

      // Static walls + floor — cards collide with viewport edges
      const floor = Matter.Bodies.rectangle(W / 2,      H + T / 2,   W + T * 2, T, { isStatic: true });
      const wallL = Matter.Bodies.rectangle(-T / 2,     H / 2,       T, H * 4,  { isStatic: true });
      const wallR = Matter.Bodies.rectangle(W + T / 2,  H / 2,       T, H * 4,  { isStatic: true });

      Matter.Composite.add(engine.world, [...bodies, floor, wallL, wallR]);

      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      // Sync physics positions → DOM on every engine step (no React re-renders)
      const syncPositions = () => {
        bodies.forEach((body, i) => {
          const el = cardRefs.current[i];
          if (!el) return;
          const snap = cards[i];
          el.style.left      = `${body.position.x - snap.width / 2}px`;
          el.style.top       = `${body.position.y - snap.height / 2}px`;
          el.style.transform = `rotate(${body.angle}rad)`;
        });
      };

      Matter.Events.on(engine, "afterUpdate", syncPositions);

      // White flash once cards have settled, then navigate (timer in trigger hook)
      const flashTimer = setTimeout(() => setFlash(true), 2200);

      cleanupRef.current = () => {
        clearTimeout(flashTimer);
        Matter.Events.off(engine, "afterUpdate", syncPositions);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
      };
    });

    return () => cleanupRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  if (!active && cards.length === 0) return null;

  return (
    // bg-background hides the original page so only the physics cards are visible
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] bg-background">
      {cards.map((card, i) => (
        <div
          key={card.key}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden"
          style={{
            top: card.top,
            left: card.left,
            width: card.width,
            height: card.height,
            willChange: "transform",
          }}
          dangerouslySetInnerHTML={{ __html: card.html }}
        />
      ))}

      {flash && (
        <div
          className="fixed inset-0 bg-white"
          style={{
            animationName: "flash-white",
            animationDuration: "500ms",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-out",
          }}
        />
      )}
    </div>
  );
}
