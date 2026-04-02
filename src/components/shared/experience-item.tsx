"use client";

import { Briefcase, Calendar } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import type { Experience } from "@/data/experience";

interface ExperienceItemProps {
  experience: Experience;
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <Modal>
      {/* Minimal timeline entry */}
      <ModalTrigger className="relative w-full pl-6 pb-3 last:pb-0 text-left cursor-pointer group/timeline">
        {/* Gradient timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b from-accent-brand/40 via-border to-transparent transition-colors duration-300 group-hover/timeline:from-accent-brand/60" />
        {/* Timeline dot with pulse */}
        <div
          className="absolute -left-[5px] top-0 h-3 w-3 rounded-full border-2 border-accent-brand bg-background transition-colors duration-300"
          style={{ animation: "timeline-pulse 2.5s ease-in-out infinite" }}
        />
        <div className="rounded-lg p-2 -ml-1 transition-colors duration-300 hover:bg-muted/50 dark:hover:bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{experience.title}</h3>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{experience.period}</span>
          </div>
          <p className="text-xs text-muted-foreground">{experience.company}</p>
        </div>
      </ModalTrigger>

      {/* Centered modal with full details */}
      <ModalContent>
        <div className="pr-8">
          <ModalTitle>{experience.title}</ModalTitle>
          <ModalDescription className="sr-only">
            Details about {experience.title} role
          </ModalDescription>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 shrink-0 text-accent-brand" />
              {experience.companyUrl ? (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-brand hover:underline transition-colors"
                >
                  {experience.company}
                </a>
              ) : (
                experience.company
              )}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-accent-brand" />
              {experience.period}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {experience.description}
            </p>
            {experience.highlights && experience.highlights.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {experience.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
