"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  as?: "div" | "span" | "section" | "p";
}

const animationClasses = {
  "fade-up": "animate-in fade-in slide-in-from-bottom-4",
  "fade-in": "animate-in fade-in",
  "fade-left": "animate-in fade-in slide-in-from-left-4",
  "fade-right": "animate-in fade-in slide-in-from-right-4",
};

export function AnimateIn({
  children,
  className,
  delay = 0,
  animation = "fade-up",
  as: Tag = "div",
}: AnimateInProps) {
  const { ref, isInView } = useInView();

  return (
    <Tag
      ref={ref}
      className={cn(
        "duration-600",
        isInView ? animationClasses[animation] : "opacity-0",
        className
      )}
      style={
        isInView && delay
          ? { animationDelay: `${delay}ms`, animationFillMode: "backwards" }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}