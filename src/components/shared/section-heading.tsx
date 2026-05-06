import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Plain text portion of the headline. */
  children: React.ReactNode;
  /** Optional italic-serif accent word rendered after the main text. */
  accentWord?: string;
  /** Trailing punctuation after the accent word (e.g. "."). */
  accentPunct?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  size?: "h2" | "display";
  /** Legacy back-compat — old call sites pass title; routed through children. */
  title?: string;
  /** Legacy back-compat — old call sites pass subtitle; rendered as muted line under headline. */
  subtitle?: string;
}

/**
 * Editorial section headline. Pairs a sans display word with one optional
 * italic-serif accent word — e.g.  Selected *work.*
 */
export function SectionHeading({
  children,
  accentWord,
  accentPunct,
  className,
  as: Tag = "h2",
  size = "h2",
  title,
  subtitle,
}: SectionHeadingProps) {
  const content = children ?? title;
  return (
    <div className={cn("space-y-2", className)}>
      <Tag
        className={cn(
          size === "display" ? "display-xl" : "display-headline",
        )}
      >
        {content}
        {accentWord && (
          <>
            {" "}
            <span className="accent-italic">{accentWord}{accentPunct}</span>
          </>
        )}
      </Tag>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
