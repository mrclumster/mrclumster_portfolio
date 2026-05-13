"use client";

import { personalInfo } from "@/data/personal";
import { AsciiBanner } from "@/components/hero/ascii-banner";
import { HeroButtons } from "@/components/hero/hero-buttons";
import { AsciiFrame } from "@/components/hero/ascii-frame";
import { useTypingLoop } from "@/hooks/use-typing";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { ParticleConstellation } from "@/components/hero/particle-constellation";
import { UptimeLine } from "@/components/sections/uptime-line";

export function HeroTerminal() {
  const { displayText: headline } = useTypingLoop([...personalInfo.headlines], {
    typeSpeed: 55,
    deleteSpeed: 30,
    holdAfterType: 1600,
    holdAfterDelete: 250,
    startDelay: 500,
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative"
    >
      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:items-start">
        {/* Left column — identity */}
        <div className="space-y-5 py-4">
          <h1 id="hero-heading" className="sr-only">
            {personalInfo.name}
          </h1>

          <AsciiBanner />

          <p style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)" }}>
            <span aria-hidden>{"> "}</span>
            <span>{headline}</span>
            <span className="ml-0.5 inline-block w-[0.55em] h-[1em] align-[-0.1em] bg-[color:var(--ink)] animate-[blink_1s_steps(2,end)_infinite]" />
          </p>

          <KeyValueList>
            <KeyValue k="location">{personalInfo.location}</KeyValue>
            <KeyValue k="email">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">
                {personalInfo.email}
              </a>
            </KeyValue>
            <KeyValue k="status">{personalInfo.status.label}</KeyValue>
          </KeyValueList>

          <div className="pt-2 opacity-80">
            <UptimeLine />
          </div>

          <HeroButtons />
        </div>

        {/* Right column — ASCII frame around photo */}
        <AsciiFrame imageSrc={personalInfo.profileImage} />
      </div>
    </section>
  );
}
