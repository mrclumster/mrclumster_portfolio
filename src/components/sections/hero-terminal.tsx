"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { personalInfo } from "@/data/personal";
import { useTypingLoop } from "@/hooks/use-typing";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";

export function HeroTerminal() {
  const { displayText: headline } = useTypingLoop(personalInfo.headlines, {
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
    <section aria-labelledby="hero-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_5fr] lg:items-start">
      <div className="space-y-5">
        <div>
          <p className="text-[12px] opacity-60">$ whoami</p>
          <h1 id="hero-heading" className="font-bold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4.25rem)" }}>
            {personalInfo.name}
          </h1>
        </div>

        <div>
          <p className="text-[12px] opacity-60">$ cat ~/headline.txt</p>
          <p className="text-[18px]">
            <span aria-hidden>{"> "}</span>
            <span>{headline}</span>
            <span className="ml-0.5 inline-block w-[0.55em] h-[1em] align-[-0.1em] bg-[color:var(--ink)] animate-[blink_1s_steps(2,end)_infinite]" />
          </p>
        </div>

        <KeyValueList>
          <KeyValue k="location">{personalInfo.location}</KeyValue>
          <KeyValue k="email">
            <a href={`mailto:${personalInfo.email}`} className="hover:underline underline-offset-4">{personalInfo.email}</a>
          </KeyValue>
          <KeyValue k="status">{personalInfo.status.label}</KeyValue>
          {now && <KeyValue k="last-build">{now}</KeyValue>}
        </KeyValueList>

        <div className="flex flex-wrap gap-3 pt-3 text-[14px]">
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
        </div>
      </div>

      <div className="border border-[color:var(--ink)]">
        <Image
          src={personalInfo.profileImage}
          alt={personalInfo.name}
          width={520}
          height={680}
          priority
          className="block w-full h-auto"
          style={{ filter: "grayscale(1) contrast(1.05)" }}
        />
      </div>
    </section>
  );
}
