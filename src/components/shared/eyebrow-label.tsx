import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  number?: string;
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}

export function EyebrowLabel({
  number,
  children,
  className,
  as: Tag = "div",
}: EyebrowLabelProps) {
  return (
    <Tag className={cn("eyebrow-label", className)}>
      {number && <span className="eyebrow-num">{number}</span>}
      {children}
    </Tag>
  );
}
