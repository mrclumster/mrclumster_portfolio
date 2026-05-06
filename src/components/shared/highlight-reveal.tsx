import type { BioSegment } from "@/data/personal";

interface Props {
  paragraph: BioSegment[];
  className?: string;
}

export function HighlightReveal({ paragraph, className }: Props) {
  return (
    <p className={`leading-relaxed text-[15px] ${className ?? ""}`.trim()}>
      {paragraph.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        if (seg.type === "keyword") return <span key={i} className="hr-keyword">{seg.value}</span>;
        return <span key={i} className="hr-secret">{seg.value}</span>;
      })}
    </p>
  );
}
