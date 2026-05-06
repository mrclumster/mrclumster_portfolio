import { EyebrowLabel } from "@/components/shared/eyebrow-label";
import { cn } from "@/lib/utils";

interface StickyEyebrowProps {
  number: string;
  label: string;
  className?: string;
}

/**
 * Eyebrow label that sticks to viewport top on desktop while its parent
 * section scrolls past. On mobile, behaves as static (CSS un-sticks via
 * `.sticky-eyebrow` media query in globals.css).
 */
export function StickyEyebrow({ number, label, className }: StickyEyebrowProps) {
  return (
    <div className={cn("sticky-eyebrow mb-4", className)}>
      <EyebrowLabel number={number}>{label}</EyebrowLabel>
    </div>
  );
}
