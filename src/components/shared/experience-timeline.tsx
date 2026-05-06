"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/components/shared/experience-item";
import { VIEWPORT_ONCE, EASE_OUT_EXPO } from "@/lib/motion";
import type { Experience } from "@/data/experience";

interface ExperienceTimelineProps {
  experiences: Experience[];
  className?: string;
}

/**
 * Vertical hairline timeline. Wraps existing ExperienceItem (which still owns
 * the modal-with-details behavior). Adds an accent dot that scales in on
 * viewport entry per row.
 */
export function ExperienceTimeline({ experiences, className }: ExperienceTimelineProps) {
  return (
    <ol className={className}>
      {experiences.map((exp, i) => (
        <motion.li
          key={i}
          className="relative pl-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{
            duration: 0.5,
            ease: EASE_OUT_EXPO,
            delay: i * 0.06,
          }}
        >
          {/* hairline rail */}
          <span
            aria-hidden
            className="absolute left-[5px] top-3 bottom-0 w-px"
            style={{ background: "color-mix(in oklch, var(--color-fg) 12%, transparent)" }}
          />
          {/* dot */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-2 block h-3 w-3 rounded-full ring-2"
            style={{
              background: "var(--color-accent)",
              boxShadow: "0 0 0 3px var(--color-bg)",
            }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{
              duration: 0.45,
              ease: EASE_OUT_EXPO,
              delay: i * 0.06 + 0.1,
            }}
          />
          <ExperienceItem experience={exp} />
        </motion.li>
      ))}
    </ol>
  );
}
