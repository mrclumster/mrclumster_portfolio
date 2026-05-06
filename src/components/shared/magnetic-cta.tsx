"use client";

import { forwardRef, type ReactNode } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

interface MagneticCtaProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  asChild?: boolean;
  href?: string;
}

const styles = {
  base:
    "h-11 px-5 rounded-full font-mono text-[11px] tracking-widest uppercase transition-[background-color,color,box-shadow,border-color] duration-300",
  primary:
    "bg-foreground text-background hover:shadow-[0_8px_32px_-12px_color-mix(in_oklch,var(--color-accent)_60%,transparent)]",
  outline:
    "border border-foreground/15 text-foreground hover:border-foreground/40 bg-transparent",
};

export const MagneticCta = forwardRef<HTMLButtonElement, MagneticCtaProps>(
  function MagneticCta(
    { children, className, variant = "primary", href, ...rest },
    ref,
  ) {
    if (href) {
      return (
        <a href={href} className="inline-block">
          <MagneticButton
            ref={ref}
            className={cn(styles.base, styles[variant], className)}
            {...rest}
          >
            {children}
          </MagneticButton>
        </a>
      );
    }
    return (
      <MagneticButton
        ref={ref}
        className={cn(styles.base, styles[variant], className)}
        {...rest}
      >
        {children}
      </MagneticButton>
    );
  },
);
