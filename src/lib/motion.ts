import type { Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export const DURATION = {
  fast: 0.15,
  normal: 0.32,
  slow: 0.6,
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const charReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.025,
      duration: DURATION.slow,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const VIEWPORT_ONCE = { once: true, margin: "-10%" } as const;
