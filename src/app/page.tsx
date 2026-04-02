"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Mail, MapPin, GraduationCap, ExternalLink, Download } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";
import { BentoCard } from "@/components/shared/bento-card";
import { BentoProjectCard } from "@/components/shared/bento-project-card";
import { TechBadge } from "@/components/shared/tech-badge";
import { ExperienceItem } from "@/components/shared/experience-item";
import { ContactForm } from "@/components/shared/contact-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/personal";
import { techStack } from "@/data/tech-stack";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { education, certifications } from "@/data/education";
import { useTyping } from "@/hooks/use-typing";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const totalTechItems = techStack.reduce((acc, cat) => acc + cat.items.length, 0);
  const { displayText: headline, isComplete: headlineComplete } = useTyping(personalInfo.headline, { speed: 45, startDelay: 400 });

  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      <div className="flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-6">
        {/* ── Group 1: Hero + Photo/Socials ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Hero Card */}
          <BentoCard
            className="md:col-span-2 lg:col-span-3"
            cardClassName="ring-[1.5px] ring-accent-brand/50"
            delay={0}
          >
            <div className="hero-stagger">
              <p className="text-sm text-muted-foreground">Hi, I&apos;m</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {personalInfo.name}
              </h1>
              <p className={cn("mt-2 text-lg text-accent-brand font-medium", !headlineComplete && "typing-cursor")}>
                {headline}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {personalInfo.location}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {personalInfo.email}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#projects"
                  className={cn(buttonVariants({ size: "lg" }), "group")}
                >
                  View My Work
                  <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                </a>
                <a
                  href="#contact"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  Get in Touch
                </a>
                <Link
                  href="/resume"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Link>
              </div>
            </div>
          </BentoCard>

          {/* Photo + Socials */}
          <BentoCard delay={80} animation="fade-in">
            <div className="flex flex-col items-center h-full">
              <div className="flex flex-1 items-center justify-center">
                <div
                  className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 rounded-full bg-background overflow-hidden ring-2 ring-accent-brand/30 transition-transform duration-300 hover:scale-105"
                  style={{ animation: "photo-glow 3s ease-in-out infinite" }}
                >
                  <Image
                    src={personalInfo.profileImage}
                    alt={personalInfo.name}
                    width={288}
                    height={288}
                    className="h-full w-full object-cover object-top scale-125"
                    priority
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_8px_rgba(0,0,0,0.4)] pointer-events-none" />
                </div>
              </div>
              <div className="mt-4 flex gap-1">
              {personalInfo.socialLinks.github && (
                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:text-accent-brand hover:shadow-[0_0_12px_rgba(80,130,255,0.3)] transition-all duration-300")}>
                  <GithubIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.linkedin && (
                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:text-accent-brand hover:shadow-[0_0_12px_rgba(80,130,255,0.3)] transition-all duration-300")}>
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.facebook && (
                <a href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:text-accent-brand hover:shadow-[0_0_12px_rgba(80,130,255,0.3)] transition-all duration-300")}>
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {personalInfo.socialLinks.instagram && (
                <a href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:text-accent-brand hover:shadow-[0_0_12px_rgba(80,130,255,0.3)] transition-all duration-300")}>
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              <a href={`mailto:${personalInfo.email}`} aria-label="Email" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:text-accent-brand hover:shadow-[0_0_12px_rgba(80,130,255,0.3)] transition-all duration-300")}>
                <Mail className="h-5 w-5" />
              </a>
            </div>
            </div>
          </BentoCard>
        </div>

        {/* ── Stats Bar ── */}
        <BentoCard delay={100} animation="fade-in">
          <div className="flex items-center justify-around divide-x divide-border">
            {[
              { value: String(projects.length), label: "Projects" },
              { value: `${totalTechItems}+`, label: "Technologies" },
              { value: String(experiences.length), label: "Internship" },
              { value: String(certifications.length), label: "Certifications" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col items-center px-4 py-1">
                <span className="text-2xl font-bold tracking-tight text-accent-brand">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* ── Group 2: About + Tech Stack ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* About — dot pattern texture */}
          <BentoCard id="about" delay={0}>
            <h2 className="text-xl font-bold tracking-tight">About Me</h2>
            <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
            <p className="mt-1.5 text-xs text-muted-foreground">A bit about who I am</p>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {personalInfo.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </BentoCard>

          {/* Tech Stack */}
          <BentoCard id="skills" delay={100}>
            <h2 className="text-xl font-bold tracking-tight">Tech Stack</h2>
            <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
            <p className="mt-1.5 text-xs text-muted-foreground">Technologies I work with</p>
            <div className="mt-3 space-y-3">
              {techStack.map((category) => (
                <div key={category.category}>
                  <h3 className="mb-1.5 text-sm font-semibold text-muted-foreground">
                    {category.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((item) => (
                      <TechBadge key={item.name} name={item.name} color={item.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        {/* ── Group 3: Experience / Education / Certifications — Bento Box ── */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {/* Experience — spans 2 rows on desktop */}
          <BentoCard
            className="lg:row-span-2"
            cardClassName="h-full"
            id="experience"
            delay={0}
          >
            <h2 className="text-xl font-bold tracking-tight">Experience</h2>
            <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
            <p className="mt-1.5 text-xs text-muted-foreground">Where I&apos;ve worked</p>
            <div className="mt-4">
              {experiences.map((exp, index) => (
                <ExperienceItem key={index} experience={exp} />
              ))}
            </div>
          </BentoCard>

          {/* Education — top right */}
          <BentoCard
            id="education"
            delay={100}
          >
            <h2 className="text-xl font-bold tracking-tight">Education</h2>
            <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
            <p className="mt-1.5 text-xs text-muted-foreground">My academic background</p>
            <div className="mt-4 space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <GraduationCap className="h-4 w-4 mt-0.5 shrink-0 text-accent-brand" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.school}</p>
                    <p className="text-[10px] text-muted-foreground">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Certifications — bottom right */}
          <BentoCard
            delay={200}
          >
            <h2 className="text-xl font-bold tracking-tight">Certifications</h2>
            <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
            <p className="mt-1.5 text-xs text-muted-foreground">Courses and achievements</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {certifications.map((cert, index) => (
                <Modal key={index}>
                  <ModalTrigger className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-3 ring-1 ring-foreground/5 transition-all duration-300 hover:ring-accent-brand/20 hover:bg-muted/50 text-left cursor-pointer w-full">
                    <span className="text-lg shrink-0">{cert.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{cert.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{cert.issuer}</p>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1">{cert.year}</Badge>
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
                          className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center mt-3 hover:border-accent-brand/40 hover:text-accent-brand transition-colors duration-200")}
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

        {/* ── Group 4: Projects ── */}
        <BentoCard id="projects" delay={0}>
          <h2 className="text-xl font-bold tracking-tight">Projects</h2>
          <div className="mt-1 h-1 w-10 rounded-full bg-gradient-to-r from-accent-brand to-accent-brand/40" />
          <p className="mt-1.5 text-xs text-muted-foreground">What I&apos;ve been building</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <BentoProjectCard key={project.title} project={project} />
            ))}
          </div>
        </BentoCard>

        {/* ── Group 5: Contact CTA ── */}
        <BentoCard
          cardClassName="bg-gradient-to-r from-accent-brand/10 via-accent-brand/5 to-accent-brand/10 dark:from-accent-brand/15 dark:via-accent-brand/5 dark:to-accent-brand/15 flex flex-col items-center justify-center text-center"
          id="contact"
          delay={0}
        >
          <h2 className="text-xl font-bold tracking-tight">Let&apos;s Connect</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Open to opportunities, collaborations, or a friendly chat.
          </p>
          <ContactForm />
        </BentoCard>
      </div>
    </section>
  );
}
