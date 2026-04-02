interface TechBadgeProps {
  name: string;
  color: string;
}

export function TechBadge({ name, color }: TechBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full bg-black/[0.06] dark:bg-white/[0.06] px-3 py-1 text-xs text-gray-600 dark:text-gray-300 font-medium transition-all duration-200 hover:scale-105 cursor-default"
      style={{ borderWidth: "1px", borderStyle: "solid", borderColor: `${color}40` }}
    >
      {name}
    </span>
  );
}
