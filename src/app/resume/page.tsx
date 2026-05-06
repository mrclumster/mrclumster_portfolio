import type { Metadata } from "next";
import { personalInfo } from "@/data/personal";
import { TerminalFrame } from "@/components/terminal/terminal-frame";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { PrintButton } from "@/components/terminal/print-button";
import { ExperienceLog } from "@/components/sections/experience-log";
import { EducationBlock } from "@/components/sections/education-block";
import { CertificationsList } from "@/components/sections/certifications-list";
import { StackTree } from "@/components/sections/stack-tree";
import { HighlightReveal } from "@/components/shared/highlight-reveal";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${personalInfo.name} — ${personalInfo.headline}`,
};

export default function ResumePage() {
  return (
    <TerminalFrame prompt="less resume.txt">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-0 space-y-12">
        <header className="space-y-2">
          <h1 className="font-bold text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.05] tracking-[-0.02em]">
            {personalInfo.name}
          </h1>
          <p className="opacity-70 text-[14px]">{personalInfo.headline}</p>
          <KeyValueList>
            <KeyValue k="email">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">{personalInfo.email}</a>
            </KeyValue>
            <KeyValue k="location">{personalInfo.location}</KeyValue>
            {personalInfo.socialLinks.github && (
              <KeyValue k="github">
                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                  {personalInfo.socialLinks.github}
                </a>
              </KeyValue>
            )}
            {personalInfo.socialLinks.linkedin && (
              <KeyValue k="linkedin">
                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                  {personalInfo.socialLinks.linkedin}
                </a>
              </KeyValue>
            )}
          </KeyValueList>
          <div className="flex gap-3 pt-2 print:hidden">
            <TerminalButton href="/">back</TerminalButton>
            <PrintButton />
          </div>
        </header>

        <section>
          <AsciiDivider label="profile" />
          <div className="mt-4 space-y-3">
            {personalInfo.bio.map((paragraph, i) => (
              <HighlightReveal key={i} paragraph={paragraph} />
            ))}
          </div>
        </section>

        <section>
          <AsciiDivider label="experience" />
          <div className="mt-4">
            <ExperienceLog />
          </div>
        </section>

        <section>
          <AsciiDivider label="education" />
          <div className="mt-4">
            <EducationBlock />
          </div>
        </section>

        <section>
          <AsciiDivider label="skills" />
          <div className="mt-4">
            <StackTree />
          </div>
        </section>

        <section>
          <AsciiDivider label="certifications" />
          <div className="mt-4">
            <CertificationsList />
          </div>
        </section>
      </article>
    </TerminalFrame>
  );
}
