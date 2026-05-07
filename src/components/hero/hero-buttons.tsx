import Link from "next/link";
import { personalInfo } from "@/data/personal";

interface BracketLinkProps {
  href: string;
  external?: boolean;
  children: string;
}

function BracketLink({ href, external, children }: BracketLinkProps) {
  const className =
    "font-mono whitespace-nowrap transition-colors duration-150 hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] focus-visible:bg-[color:var(--ink)] focus-visible:text-[color:var(--paper)] focus-visible:outline-none";

  const inner = (
    <>
      <span aria-hidden>[ </span>
      <span>{children}</span>
      <span aria-hidden> ]</span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function HeroButtons() {
  const { socialLinks } = personalInfo;
  return (
    <nav
      aria-label="Primary actions"
      className="flex flex-wrap gap-x-3 gap-y-2"
      style={{ fontSize: "clamp(0.78rem, 0.75rem + 0.15vw, 0.875rem)" }}
    >
      <BracketLink href="#projects">view_work</BracketLink>
      <BracketLink href="/resume">resume.pdf</BracketLink>
      {socialLinks.github && <BracketLink href={socialLinks.github} external>github</BracketLink>}
      {socialLinks.linkedin && <BracketLink href={socialLinks.linkedin} external>linkedin</BracketLink>}
      {socialLinks.facebook && <BracketLink href={socialLinks.facebook} external>facebook</BracketLink>}
      {socialLinks.instagram && <BracketLink href={socialLinks.instagram} external>instagram</BracketLink>}
    </nav>
  );
}
