import type { ComponentProps } from "react";

const fieldBase =
  "w-full bg-transparent border-0 border-b border-[color:var(--ink)]/40 " +
  "px-0 py-2 text-[14px] font-mono text-[color:var(--ink)] " +
  "placeholder:text-[color:var(--ink)]/40 outline-none focus:border-[color:var(--ink)]";

export function TerminalInput(props: ComponentProps<"input">) {
  const { className, ...rest } = props;
  return <input className={`${fieldBase} ${className ?? ""}`.trim()} {...rest} />;
}

export function TerminalTextarea(props: ComponentProps<"textarea">) {
  const { className, ...rest } = props;
  return <textarea className={`${fieldBase} resize-none ${className ?? ""}`.trim()} rows={4} {...rest} />;
}

export function TerminalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block text-[11px] uppercase tracking-[0.08em] opacity-60 mb-1 ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
}
