interface AsciiDividerProps {
  number?: string;
  label: string;
  className?: string;
}

export function AsciiDivider({ number, label, className }: AsciiDividerProps) {
  return (
    <h2
      className={`flex items-center gap-3 text-[12px] uppercase tracking-[0.08em] font-semibold ${className ?? ""}`.trim()}
      style={{ color: "var(--ink)" }}
    >
      <span aria-hidden>──</span>
      <span>
        {number ? <span className="opacity-60">{number} / </span> : null}
        {label}
      </span>
      <span aria-hidden className="flex-1 border-t border-[color:var(--ink)]" />
    </h2>
  );
}
