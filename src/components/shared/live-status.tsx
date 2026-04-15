interface LiveStatusProps {
  label: string;
}

export function LiveStatus({ label }: LiveStatusProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/25">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
        {label}
      </span>
    </div>
  );
}
