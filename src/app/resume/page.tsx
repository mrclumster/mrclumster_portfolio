import type { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  ArrowLeft,
  MapPin,
  Mail,
  Briefcase,
  Calendar,
  GraduationCap,
  Award,
} from "lucide-react";
import { personalInfo } from "@/data/personal";
import { experiences } from "@/data/experience";
import { education, certifications } from "@/data/education";
import { techStack } from "@/data/tech-stack";
import { projects } from "@/data/projects";
import { EyebrowLabel } from "@/components/shared/eyebrow-label";
import { SectionHeading } from "@/components/shared/section-heading";
import { MagneticCta } from "@/components/shared/magnetic-cta";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${personalInfo.name} — ${personalInfo.headline}`,
};

export default function ResumePage() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 print:py-4 print:px-0">
      {/* Top actions — hidden in print */}
      <div className="flex items-center justify-between mb-10 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <a href="/UPDATED_RESUME.pdf" download className="inline-block">
          <MagneticCta variant="primary">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </MagneticCta>
        </a>
      </div>

      {/* Header */}
      <header className="space-y-5 print:space-y-2">
        <EyebrowLabel number="—" className="print:hidden">
          Resume
        </EyebrowLabel>
        <SectionHeading
          as="h1"
          size="display"
          accentWord="Tebbeng"
          className="print:!block"
        >
          Aziz
        </SectionHeading>
        <p
          className="text-lg sm:text-xl print:text-sm print:text-black"
          style={{ color: "var(--color-accent)" }}
        >
          {personalInfo.headline}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground print:text-[10px] print:text-black">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {personalInfo.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3 w-3" />
            {personalInfo.email}
          </span>
        </div>
      </header>

      {/* About */}
      <div className="mt-10 print:mt-4">
        <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground print:text-black">
          About
        </h2>
        <div className="space-y-3 text-base leading-relaxed text-muted-foreground print:text-xs print:text-black">
          {personalInfo.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 print:mt-6">
        <Tabs defaultValue="experience" className="">
          <TabsList ariaLabel="Resume sections">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certs">Certifications</TabsTrigger>
          </TabsList>

          {/* Experience */}
          <TabsContent value="experience" printHeading="Experience">
            <ul className="space-y-6">
              {experiences.map((exp, i) => (
                <li key={i} className="border-l border-foreground/10 pl-5 print:border-l-0 print:pl-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold print:text-xs">{exp.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground print:text-[10px] print:text-black">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground print:text-[10px] print:text-black">
                    <Briefcase className="h-3 w-3 shrink-0" />
                    {exp.company}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground print:text-[10px] print:text-black">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.highlights.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground print:text-[10px] print:text-black"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full print:bg-black"
                            style={{ background: "var(--color-accent)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" printHeading="Education">
            <ul className="space-y-5">
              {education.map((edu, i) => (
                <li key={i} className="flex items-start gap-3">
                  <GraduationCap
                    className="mt-1 h-4 w-4 shrink-0 print:text-black"
                    style={{ color: "var(--color-accent)" }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold print:text-xs">{edu.degree}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground print:text-[10px] print:text-black">
                      {edu.school}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground print:text-[10px] print:text-black">
                      {edu.period}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" printHeading="Technical Skills">
            <div className="space-y-4">
              {techStack.map((category) => (
                <div key={category.category}>
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground print:text-black">
                    {category.category}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90 print:text-[10px] print:text-black">
                    {category.items.map((item) => item.name).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" printHeading="Projects">
            <ul className="space-y-5">
              {featuredProjects.map((project) => (
                <li key={project.title}>
                  <div className="flex items-baseline gap-2">
                    {project.icon && <span className="text-lg leading-none">{project.icon}</span>}
                    <h3 className="text-base font-semibold print:text-xs">{project.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-[10px] print:text-black">
                    {project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* Certifications */}
          <TabsContent value="certs" printHeading="Certifications">
            <ul className="space-y-3">
              {certifications.map((cert, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Award
                    className="mt-1 h-4 w-4 shrink-0 print:text-black"
                    style={{ color: "var(--color-accent)" }}
                  />
                  <div>
                    <p className="text-sm font-semibold print:text-xs">{cert.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground print:text-[10px] print:text-black">
                      {cert.issuer} &middot; {cert.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      {/* Print-only footer with date */}
      <div className="hidden print:mt-6 print:block">
        <p className="font-mono text-[9px] uppercase tracking-widest text-black/60">
          Generated from aziztebbeng.vercel.app
        </p>
      </div>
    </section>
  );
}
