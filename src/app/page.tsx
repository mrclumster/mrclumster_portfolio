"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, Mail, MapPin, GraduationCap, ExternalLink, Download } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";
import { AnimatedBorder } from "@/components/ui/animated-border";
import { Spotlight } from "@/components/ui/spotlight";
import { BentoCard } from "@/components/shared/bento-card";
import { ProjectCard } from "@/components/shared/project-card";
import { ProjectList } from "@/components/shared/project-list";
import { TechBadge } from "@/components/shared/tech-badge";
import { ContactForm } from "@/components/shared/contact-form";
import { LiveStatus } from "@/components/shared/live-status";
import { TechTicker } from "@/components/shared/tech-ticker";
import { MagneticPhoto } from "@/components/shared/magnetic-photo";
import { CopyableEmail } from "@/components/shared/copyable-email";
import { GithubCalendarClient } from "@/components/shared/github-calendar-client";
import { EyebrowLabel } from "@/components/shared/eyebrow-label";
import { StickyEyebrow } from "@/components/shared/sticky-eyebrow";
import { SectionHeading } from "@/components/shared/section-heading";
import { RedactedText } from "@/components/shared/redacted-text";
import { AnimatedName } from "@/components/shared/animated-name";
import { StatsRibbon } from "@/components/shared/stats-ribbon";
import { ExperienceTimeline } from "@/components/shared/experience-timeline";
import { MagneticCta } from "@/components/shared/magnetic-cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/personal";
import { techStack } from "@/data/tech-stack";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { education, certifications } from "@/data/education";
import { useTypingLoop } from "@/hooks/use-typing";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, I'm";
  if (hour < 18) return "Good afternoon, I'm";
  return "Good evening, I'm";
}

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const totalTechItems = techStack.reduce((acc, cat) => acc + cat.items.length, 0);
  const { displayText: headline } = useTypingLoop(personalInfo.headlines, {
    typeSpeed: 55,
    deleteSpeed: 30,
    holdAfterType: 1600,
    holdAfterDelete: 250,
    startDelay: 500,
  });
  const [greeting, setGreeting] = useState("Hi, I'm");
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 space-y-[clamp(4rem,3rem+4vw,8rem)]">
      {/* ── 01 / INTRODUCTION — Hero + Photo ─────────────────────────── */}
      <section aria-labelledby="hero-heading" className="space-y-6">
        <StickyEyebrow number="01" label="Introduction" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Hero card with animated border */}
          <AnimatedBorder className="lg:col-span-3 rounded-2xl">
            <div
              className={cn(
                "relative h-full rounded-2xl backdrop-blur-md p-6 md:p-8 lg:p-10",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
              )}
              style={{ background: "var(--color-surface)" }}
            >
              <div className="space-y-5">
                <LiveStatus label={personalInfo.status.label} />
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {greeting}
                </p>
                <AnimatedName
                  name={personalInfo.name}
                  className="display-xl"
                />
                <p
                  className="text-lg sm:text-xl typing-cursor min-h-[1.75rem]"
                  style={{ color: "var(--color-accent)" }}
                >
                  {headline}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {personalInfo.location}
                  </span>
                  <CopyableEmail email={personalInfo.email} />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <MagneticCta href="#projects" variant="primary">
                    View My Work
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </MagneticCta>
                  <Link href="/resume" className="inline-block">
                    <MagneticCta variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                    </MagneticCta>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedBorder>

          {/* Photo + socials */}
          <div
            className={cn(
              "relative rounded-2xl backdrop-blur-md p-6 ring-1 ring-foreground/8",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
              "flex flex-col gap-5",
            )}
            style={{ background: "var(--color-surface)" }}
          >
            <div className="flex flex-1 items-center justify-center">
              <MagneticPhoto src={personalInfo.profileImage} alt={personalInfo.name} />
            </div>
            <div className="flex justify-center gap-1">
              {personalInfo.socialLinks.github && (
                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-colors duration-300 hover:text-foreground")}>
                  <GithubIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.linkedin && (
                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-colors duration-300 hover:text-foreground")}>
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.facebook && (
                <a href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-colors duration-300 hover:text-foreground")}>
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.instagram && (
                <a href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-colors duration-300 hover:text-foreground")}>
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              <a href={`mailto:${personalInfo.email}`} aria-label="Email" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-colors duration-300 hover:text-foreground")}>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ribbon ─────────────────────────────────────────────── */}
      <section>
        <StatsRibbon
          items={[
            { value: String(projects.length), label: "Projects" },
            { value: `${totalTechItems}+`, label: "Technologies" },
            { value: String(experiences.length), label: "Internship" },
            { value: String(certifications.length), label: "Certifications" },
          ]}
        />
      </section>

      {/* ── 02 / WHO — About + Tech Stack ───────────────────────────── */}
      <section aria-labelledby="about-heading" className="space-y-6">
        <StickyEyebrow number="02" label="Who" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BentoCard id="about">
            <EyebrowLabel className="mb-3">Redacted · Drag to reveal</EyebrowLabel>
            <SectionHeading as="h2" accentWord="reading" accentPunct=".">
              Between the
            </SectionHeading>
            <div className="mt-7">
              <RedactedText bio={personalInfo.bio} />
            </div>
            <div className="mt-8 overflow-x-auto">
              <GithubCalendarClient />
            </div>
          </BentoCard>

          <BentoCard id="skills">
            <SectionHeading as="h2" accentWord="stack" accentPunct=".">
              Tech
            </SectionHeading>
            <div className="mt-6 space-y-5">
              {techStack.map((category) => (
                <div key={category.category}>
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => (
                      <TechBadge key={item.name} name={item.name} color={item.color} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <TechTicker />
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ── 03 / EXPERIENCE — Experience / Education / Certs ───────── */}
      <section aria-labelledby="experience-heading" className="space-y-6">
        <StickyEyebrow number="03" label="Experience" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BentoCard className="lg:row-span-2" cardClassName="h-full" id="experience">
            <SectionHeading as="h2" accentWord="path" accentPunct=".">
              Career
            </SectionHeading>
            <div className="mt-6">
              <ExperienceTimeline experiences={experiences} />
            </div>
          </BentoCard>

          <BentoCard id="education">
            <SectionHeading as="h2" accentWord="education" accentPunct=".">
              Formal
            </SectionHeading>
            <ul className="mt-5 space-y-4">
              {education.map((edu, index) => (
                <li key={index} className="flex items-start gap-3">
                  <GraduationCap className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.school}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{edu.period}</p>
                  </div>
                </li>
              ))}
            </ul>
          </BentoCard>

          <BentoCard>
            <SectionHeading as="h2" accentWord="certifications" accentPunct=".">
              Earned
            </SectionHeading>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {certifications.map((cert, index) => (
                <Modal key={index}>
                  <ModalTrigger className="flex items-start gap-2.5 rounded-xl p-3 ring-1 ring-foreground/8 transition-[ring-color] duration-300 hover:ring-foreground/25 text-left cursor-pointer w-full">
                    <span className="text-lg shrink-0">{cert.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{cert.title}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{cert.issuer}</p>
                      <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0 mt-1">{cert.year}</Badge>
                    </div>
                  </ModalTrigger>
                  <ModalContent className="max-w-2xl">
                    <div className="flex items-center gap-3 pr-8">
                      <span className="text-3xl">{cert.icon}</span>
                      <div>
                        <ModalTitle>{cert.title}</ModalTitle>
                        <ModalDescription>{cert.issuer} &middot; {cert.year}</ModalDescription>
                      </div>
                    </div>
                    {cert.pdfUrl ? (
                      <div className="mt-4">
                        <iframe
                          src={cert.pdfUrl}
                          className="w-full h-[60vh] rounded-lg border border-border"
                          title={cert.title}
                        />
                        <a
                          href={cert.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center mt-3")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open PDF in New Tab
                        </a>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">
                        Certificate document not available for preview.
                      </p>
                    )}
                  </ModalContent>
                </Modal>
              ))}
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ── 04 / SELECTED WORK ──────────────────────────────────────── */}
      <section id="projects" aria-labelledby="projects-heading" className="space-y-10">
        <StickyEyebrow number="04" label="Selected Work" />
        <div className="flex items-end justify-between gap-6 border-b border-foreground/10 pb-6">
          <SectionHeading as="h2" accentWord="work" accentPunct=".">
            Selected
          </SectionHeading>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline-block">
            {featuredProjects.length} entries
          </span>
        </div>
        <ProjectList projects={featuredProjects} />
      </section>

      {/* ── 05 / CONTACT ────────────────────────────────────────────── */}
      <section id="contact" aria-labelledby="contact-heading" className="space-y-6">
        <StickyEyebrow number="05" label="Contact" />
        <div
          className={cn(
            "relative rounded-2xl backdrop-blur-md p-8 lg:p-12 ring-1 ring-foreground/8",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
            "flex flex-col items-center text-center",
          )}
          style={{ background: "var(--color-surface)" }}
        >
          <SectionHeading as="h2" accentWord="connect" accentPunct=".">
            Let&apos;s
          </SectionHeading>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Open to opportunities, collaborations, or a friendly chat.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
