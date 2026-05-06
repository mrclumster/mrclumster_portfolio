import { TerminalFrame } from "@/components/terminal/terminal-frame";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HeroTerminal } from "@/components/sections/hero-terminal";
import { UptimeLine } from "@/components/sections/uptime-line";
import { AboutTerminal } from "@/components/sections/about-terminal";
import { StackTree } from "@/components/sections/stack-tree";
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
            <StackTree />
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
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
