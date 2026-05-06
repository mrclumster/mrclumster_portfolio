import { TerminalFrame } from "@/components/terminal/terminal-frame";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HeroTerminal } from "@/components/sections/hero-terminal";
import { UptimeLine } from "@/components/sections/uptime-line";
import { AboutTerminal } from "@/components/sections/about-terminal";
import { StackTable } from "@/components/sections/stack-table";
import { ExperienceLog } from "@/components/sections/experience-log";
import { EducationBlock } from "@/components/sections/education-block";
import { CertificationsList } from "@/components/sections/certifications-list";
import { ProjectsLog } from "@/components/sections/projects-log";
import { ContactTerminal } from "@/components/sections/contact-terminal";
import { projects } from "@/data/projects";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <TerminalFrame prompt="cat index.md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-16">
        <AsciiDivider number="01" label="introduction" />
        <HeroTerminal />

        <UptimeLine />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <AboutTerminal />
          <section aria-labelledby="stack-heading" className="space-y-4">
            <AsciiDivider label="stack" />
            <StackTable />
          </section>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
          {/* Vertical divider with ASCII ticks — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "calc(60% - 0.75rem)",
              width: 1,
              background: "var(--ink)",
              opacity: 0.3,
            }}
          >
            <span
              className="absolute -top-2 -left-1.5 font-mono text-[10px] leading-none"
              style={{ color: "var(--ink)", opacity: 0.6 }}
            >
              ┤
            </span>
            <span
              className="absolute -bottom-2 -left-1.5 font-mono text-[10px] leading-none"
              style={{ color: "var(--ink)", opacity: 0.6 }}
            >
              ├
            </span>
          </div>
          {/* Left column: career then education stacked */}
          <div className="space-y-10">
            <section aria-labelledby="career-heading" className="space-y-4">
              <AsciiDivider number="03" label="career" />
              <ExperienceLog />
            </section>
            <section aria-labelledby="education-heading" className="space-y-4">
              <AsciiDivider label="education" />
              <EducationBlock />
            </section>
          </div>

          {/* Right column: certifications */}
          <section aria-labelledby="certifications-heading" className="space-y-4">
            <AsciiDivider label="certifications" />
            <CertificationsList />
          </section>
        </div>

        <section id="projects" aria-labelledby="projects-heading" className="space-y-6">
          <AsciiDivider number="04" label="selected_work" />
          <ProjectsLog projects={featuredProjects} />
        </section>

        <section id="contact" aria-labelledby="contact-heading" className="space-y-4">
          <AsciiDivider number="05" label="contact" />
          <ContactTerminal />
        </section>
      </div>
    </TerminalFrame>
  );
}
