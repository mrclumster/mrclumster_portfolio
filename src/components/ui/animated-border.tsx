"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  durationSeconds?: number;
  radius?: string;
  thickness?: number;
}

export function AnimatedBorder({
  children,
  className,
  durationSeconds = 8,
  radius = "1rem",
  thickness = 1,
}: AnimatedBorderProps) {
  return (
    <div
      className={cn("animated-border-host relative isolate", className)}
      style={
        {
          "--ab-duration": `${durationSeconds}s`,
          "--ab-radius": radius,
          "--ab-thickness": `${thickness}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
