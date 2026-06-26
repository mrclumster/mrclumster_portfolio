import Link from "next/link";
import { personalInfo } from "@/data/personal";

interface ButtonLinkProps {
  href: string;
  external?: boolean;
  children: string;
  primary?: boolean;
}

function ButtonLink({ href, external, children, primary }: ButtonLinkProps) {
  const className = `
    inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium
    active:scale-[0.97] active:opacity-80 active:blur-[1px]
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
    disabled:pointer-events-none disabled:opacity-50
    h-10 px-6 py-2 border backdrop-blur-md
    transition-[transform,filter,opacity,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
    ${primary 
      ? "bg-foreground/5 border-foreground/20 text-foreground hover:bg-foreground/10" 
      : "bg-background/50 border-foreground/10 text-foreground/80 hover:bg-background/80 hover:text-foreground"}
  `;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function HeroButtons() {
  const { socialLinks } = personalInfo;
  return (
    <nav
      aria-label="Primary actions"
      className="flex flex-wrap gap-4 mt-8"
    >
      <ButtonLink href="#projects" primary>View Work</ButtonLink>
      <ButtonLink href="/resume" external>Resume</ButtonLink>
      {socialLinks.github && <ButtonLink href={socialLinks.github} external>GitHub</ButtonLink>}
      {socialLinks.linkedin && <ButtonLink href={socialLinks.linkedin} external>LinkedIn</ButtonLink>}
    </nav>
  );
}
