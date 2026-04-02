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
}

export function BentoCard({
  children,
  className,
  cardClassName,
  id,
  delay = 0,
  animation = "fade-up",
}: BentoCardProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMousePosition();

  return (
    <AnimateIn animation={animation} delay={delay} className={className}>
      <div
        ref={ref}
        id={id}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative h-full rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 p-4 md:p-6 lg:p-8 overflow-hidden transition-[ring-color,box-shadow,transform] duration-300 hover:ring-accent-brand/25 hover:shadow-lg hover:shadow-accent-brand/10 hover:-translate-y-0.5",
          cardClassName
        )}
      >
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
