import { personalInfo } from "@/data/personal";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import { HighlightReveal } from "@/components/shared/highlight-reveal";
import { SidePet } from "@/components/shared/side-pet";

export function AboutTerminal() {
  return (
    <section id="about" aria-labelledby="about-heading" className="space-y-4">
      <AsciiDivider number="02" label="about" />
      <p className="text-[11px] opacity-50">{"// select to reveal hidden notes"}</p>
      <div className="space-y-4">
        {personalInfo.bio.map((paragraph, i) => (
          <HighlightReveal key={i} paragraph={paragraph} />
        ))}
      </div>
      <SidePet />
    </section>
  );
}
