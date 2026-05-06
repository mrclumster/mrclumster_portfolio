import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Common = { children: ReactNode; className?: string };
type AnchorProps = Common & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const baseClass =
  "inline-flex items-center gap-1 px-1 transition-[background-color,color] duration-150 " +
  "border border-transparent hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] " +
  "focus-visible:outline-none focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)]";

export function TerminalButton(props: AnchorProps | ButtonProps) {
  const { children, className } = props;
  const inner = (
    <>
      <span aria-hidden>[</span>
      <span>{children}</span>
      <span aria-hidden>]</span>
    </>
  );
  if ("href" in props && props.href) {
    const { href, ...rest } = props as AnchorProps;
    const cls = `${baseClass} ${className ?? ""}`.trim();
    if (href.startsWith("/") && !href.includes(".pdf")) {
      return (
        <Link href={href} className={cls} {...(rest as ComponentProps<"a">)}>
          {inner}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} {...(rest as ComponentProps<"a">)}>
        {inner}
      </a>
    );
  }
  const rest = props as ButtonProps;
  return (
    <button type="button" className={`${baseClass} ${className ?? ""}`.trim()} {...rest}>
      {inner}
    </button>
  );
}
