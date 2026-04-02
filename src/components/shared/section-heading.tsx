"use client";

import { AnimateIn } from "@/components/shared/animate-in";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <AnimateIn className="mb-4">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
      {subtitle && (
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      )}
    </AnimateIn>
  );
}
