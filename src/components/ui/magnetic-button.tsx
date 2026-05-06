"use client";

import { forwardRef, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion as useFmReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  pullRadius?: number;
  maxDisplacement?: number;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    { children, className, pullRadius = 120, maxDisplacement = 12, onMouseMove, onMouseLeave, ...rest },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement>(null);
    const reduced = useFmReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

    const setRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <motion.button
        ref={setRef}
        className={cn(
          "relative inline-flex items-center justify-center select-none",
          className,
        )}
        style={reduced ? undefined : { x: sx, y: sy }}
        onMouseMove={(e) => {
          onMouseMove?.(e);
          if (reduced) return;
          const r = localRef.current?.getBoundingClientRect();
          if (!r) return;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > pullRadius) {
            x.set(0);
            y.set(0);
            return;
          }
          const t = 1 - dist / pullRadius;
          x.set((dx / pullRadius) * maxDisplacement * t);
          y.set((dy / pullRadius) * maxDisplacement * t);
        }}
        onMouseLeave={(e) => {
          onMouseLeave?.(e);
          x.set(0);
          y.set(0);
        }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);
