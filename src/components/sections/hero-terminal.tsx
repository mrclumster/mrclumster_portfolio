"use client";

import { useEffect, useState } from "react";
import { personalInfo } from "@/data/personal";
import { AnimatedPhoto } from "@/components/hero/animated-photo";
import { useTypingLoop } from "@/hooks/use-typing";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";
import { ParticleConstellation } from "@/components/hero/particle-constellation";

export function HeroTerminal() {
  const { displayText: headline } = useTypingLoop([...personalInfo.headlines], {
    typeSpeed: 55,
    deleteSpeed: 30,
    holdAfterType: 1600,
    holdAfterDelete: 250,
    startDelay: 500,
  });
  const [now, setNow] = useState("");
  useEffect(() => {
    setNow(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative"
    >
      {/* B — Particle constellation: full-section background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ParticleConstellation />
      </div>

      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:items-start">
        {/* Left column — identity */}
        <div className="space-y-6 py-4">

          <div>
            <h1
              id="hero-heading"
              className="font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.8rem, 2rem + 3.5vw, 4.75rem)" }}
            >
              {personalInfo.name}
            </h1>
            <p className="mt-2" style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)" }}>
              <span aria-hidden>{"> "}</span>
              <span>{headline}</span>
              <span className="ml-0.5 inline-block w-[0.55em] h-[1em] align-[-0.1em] bg-[color:var(--ink)] animate-[blink_1s_steps(2,end)_infinite]" />
            </p>
          </div>

          <KeyValueList>
            <KeyValue k="location">{personalInfo.location}</KeyValue>
            <KeyValue k="email">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">
                {personalInfo.email}
              </a>
            </KeyValue>
            <KeyValue k="status">{personalInfo.status.label}</KeyValue>
            {now && <KeyValue k="last-build">{now}</KeyValue>}
          </KeyValueList>

          <div
            className="flex flex-wrap gap-3 pt-1"
            style={{ fontSize: "clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem)" }}
          >
            <TerminalButton href="#projects">view_work</TerminalButton>
            <TerminalButton href="/resume">resume.pdf</TerminalButton>
            {personalInfo.socialLinks.github && (
              <TerminalButton href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-3.5 w-3.5" /> github
              </TerminalButton>
            )}
            {personalInfo.socialLinks.linkedin && (
              <TerminalButton href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-3.5 w-3.5" /> linkedin
              </TerminalButton>
            )}
            {personalInfo.socialLinks.facebook && (
              <TerminalButton href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="h-3.5 w-3.5" /> facebook
              </TerminalButton>
            )}
            {personalInfo.socialLinks.instagram && (
              <TerminalButton href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="h-3.5 w-3.5" /> instagram
              </TerminalButton>
            )}
          </div>
        </div>

        {/* Right column — AnimatedPhoto: Float + border breathe */}
        <div
          className="overflow-hidden relative"
          style={{ height: 400 }}
        >
          <AnimatedPhoto imageSrc={personalInfo.profileImage} />
        </div>
      </div>
    </section>
  );
}
