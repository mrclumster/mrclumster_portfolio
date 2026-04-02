import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowLeft, MapPin, Mail, Briefcase, Calendar, GraduationCap, Award } from "lucide-react";
import { personalInfo } from "@/data/personal";
import { experiences } from "@/data/experience";
import { education, certifications } from "@/data/education";
import { techStack } from "@/data/tech-stack";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${personalInfo.name} — ${personalInfo.headline}`,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-accent-brand print:text-black">
        {children}
      </h2>
      <div className="mt-1 h-px w-full bg-border print:bg-black/20" />
    </div>
  );
}

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8 md:py-12 print:py-4 print:px-0">
      {/* Top actions — hidden when printing */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-brand transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
        <a
          href="/UPDATED_RESUME.pdf"
          download
          className="flex items-center gap-1.5 rounded-lg bg-accent-brand px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      {/* Resume card */}
      <div className="rounded-xl bg-card ring-1 ring-foreground/10 p-6 md:p-10 print:p-0 print:ring-0 print:bg-transparent">
        <div className="space-y-8 print:space-y-5">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl print:text-2xl">
              {personalInfo.name}
            </h1>
            <p className="mt-1 text-lg text-accent-brand font-medium print:text-sm print:text-black">
              {personalInfo.headline}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground print:text-xs print:text-black">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {personalInfo.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {personalInfo.email}
              </span>
            </div>
          </header>

          {/* About */}
          <div>
            <SectionTitle>About</SectionTitle>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground print:text-xs print:text-black">
              {personalInfo.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Experience + Education side by side */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 print:grid-cols-2 print:gap-4">
            {/* Experience */}
            <div>
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold print:text-xs">{exp.title}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 print:text-[10px] print:text-black">
                      <Briefcase className="h-3 w-3 shrink-0" />
                      {exp.company}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground print:text-[10px] print:text-black">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {exp.period}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed print:text-[10px] print:text-black">
                      {exp.description}
                    </p>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.highlights.map((item, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed print:text-[10px] print:text-black">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-brand print:bg-black" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold print:text-xs">{edu.degree}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 print:text-[10px] print:text-black">
                      <GraduationCap className="h-3 w-3 shrink-0" />
                      {edu.school}
                    </p>
                    <p className="text-xs text-muted-foreground print:text-[10px] print:text-black">
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <SectionTitle>Technical Skills</SectionTitle>
            <div className="space-y-2">
              {techStack.map((category) => (
                <div key={category.category} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-xs font-semibold text-foreground print:text-[10px] print:text-black">
                    {category.category}:
                  </span>
                  <span className="text-xs text-muted-foreground print:text-[10px] print:text-black">
                    {category.items.map((item) => item.name).join(" \u00b7 ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {projects.filter((p) => p.featured).map((project) => (
                <div key={project.title}>
                  <div className="flex items-center gap-2">
                    {project.icon && <span className="text-sm">{project.icon}</span>}
                    <h3 className="text-sm font-semibold print:text-xs">{project.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed print:text-[10px] print:text-black">
                    {project.description}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground print:bg-transparent print:border print:border-black/20 print:text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <SectionTitle>Certifications</SectionTitle>
            <div className="space-y-2.5">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Award className="h-4 w-4 mt-0.5 shrink-0 text-accent-brand print:text-black" />
                  <div>
                    <p className="text-sm font-medium print:text-xs">{cert.title}</p>
                    <p className="text-xs text-muted-foreground print:text-[10px] print:text-black">
                      {cert.issuer} &middot; {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
