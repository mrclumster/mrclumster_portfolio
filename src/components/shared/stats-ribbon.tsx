"use client";

import { cn } from "@/lib/utils";

export interface StatItem {
  value: string;
  label: string;
}

interface StatsRibbonProps {
  items: StatItem[];
  className?: string;
}

export function StatsRibbon({ items, className }: StatsRibbonProps) {
  return (
    <div
      className={cn(
        "rounded-full backdrop-blur-md ring-1 ring-foreground/8",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
        "px-6 py-4 sm:px-8 sm:py-5",
        className,
      )}
      style={{ background: "var(--color-surface)" }}
    >
      <dl className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-foreground/8">
        {items.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col items-center gap-1 px-3",
              i === 0 && "border-l-0",
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-mono text-2xl sm:text-3xl tabular-nums tracking-tight text-foreground">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
