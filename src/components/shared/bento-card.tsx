"use client";

import { motion } from "framer-motion";
import { fadeInUp, VIEWPORT_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  id?: string;
  delay?: number;
  /** Legacy prop accepted for back-compat; ignored. */
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  /** Legacy prop accepted for back-compat; ignored after Phase 2 single-accent migration. */
  glowColor?: "both" | "brand" | "warm" | "none";
}

export function BentoCard({
  children,
  className,
  cardClassName,
  id,
  delay = 0,
}: BentoCardProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      transition={{ delay: delay / 1000 }}
    >
      <div
        id={id}
        data-bento-card=""
        className={cn(
          "group relative h-full p-4 md:p-6 lg:p-8 overflow-hidden",
          "rounded-2xl backdrop-blur-md",
          "ring-1 ring-foreground/8 transition-[ring-color] duration-300",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
          cardClassName,
        )}
        style={{ background: "var(--color-surface)" }}
      >
        {/* Hairline top sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </motion.div>
  );
}
