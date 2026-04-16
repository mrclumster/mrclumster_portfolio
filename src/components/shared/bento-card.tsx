"use client";

import { AnimateIn } from "@/components/shared/animate-in";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  id?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  glowColor?: "both" | "brand" | "warm" | "none";
}

export function BentoCard({
  children,
  className,
  cardClassName,
  id,
  delay = 0,
  animation = "fade-up",
  glowColor = "both",
}: BentoCardProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMousePosition();
  const showBrandGlow = glowColor === "both" || glowColor === "brand";
  const showWarmGlow = glowColor === "both" || glowColor === "warm";

  return (
    <AnimateIn animation={animation} delay={delay} className={className}>
      <div
        ref={ref}
        id={id}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-bento-card=""
        className={cn(
          "group relative h-full rounded-xl bg-card/70 backdrop-blur-md text-card-foreground ring-1 ring-foreground/10 p-4 md:p-6 lg:p-8 overflow-hidden transition-[ring-color,box-shadow,transform] duration-300 hover:ring-accent-brand/25 hover:shadow-lg hover:shadow-accent-brand/10 hover:-translate-y-0.5",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          cardClassName
        )}
      >
        {/* Subtle top gradient sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
        />
        {/* Corner glow accent (top-left only — keep it subtle) */}
        {showBrandGlow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-accent-brand/15 dark:bg-accent-brand/25 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {/* Mouse-tracking glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={
            position.isHovering
              ? {
                  opacity: 1,
                  background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, var(--accent-brand) 0%, transparent 70%)`,
                  mixBlendMode: "soft-light",
                }
              : undefined
          }
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </AnimateIn>
  );
}
