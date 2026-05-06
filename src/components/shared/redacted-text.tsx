"use client";

import { cn } from "@/lib/utils";

interface RedactedTextProps {
  bio: string[];
  className?: string;
}

/**
 * Highlight-to-reveal bio. Text is transparent by default with accent I-beam
 * markers running down the left edge of every visual line. OS selection
 * paints the chosen characters with the foreground color, so the text
 * reveals only as the cursor sweeps over it.
 *
 * Keyboard users can Tab onto the block — `:focus-visible` grants a full
 * reveal so screen-reader and keyboard paths aren't punished.
 */
export function RedactedText({ bio, className }: RedactedTextProps) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="About — select text to reveal"
      className={cn("redacted-text outline-none", className)}
    >
      {bio.map((p, i) => (
        <p
          key={i}
          className={cn("redacted-line text-base leading-[1.7]", i > 0 && "mt-4")}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
