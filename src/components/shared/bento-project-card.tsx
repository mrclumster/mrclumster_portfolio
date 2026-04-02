"use client";

import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

interface BentoProjectCardProps {
  project: Project;
}

export function BentoProjectCard({ project }: BentoProjectCardProps) {
  return (
    <Modal>
      {/* Minimal card */}
      <ModalTrigger className="flex h-full w-full flex-col rounded-lg bg-muted/30 ring-1 ring-foreground/5 transition-all duration-300 hover:ring-accent-brand/20 hover:bg-muted/50 text-left cursor-pointer overflow-hidden">
        {/* Gradient header with large emoji */}
        <div
          className="flex items-center justify-center py-6"
          style={
            project.gradientColor
              ? { background: `linear-gradient(135deg, ${project.gradientColor}15 0%, ${project.gradientColor}05 100%)` }
              : undefined
          }
        >
          {project.icon && (
            <span className="text-4xl drop-shadow-sm">{project.icon}</span>
          )}
        </div>
        {/* Card body */}
        <div className="flex flex-1 flex-col p-3 pt-2">
          <h3 className="text-sm font-semibold">{project.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{project.tags.length - 3}</Badge>
            )}
          </div>
        </div>
      </ModalTrigger>

      {/* Centered modal with full details */}
      <ModalContent>
        <div className="flex items-center gap-3 pr-8">
          {project.icon && <span className="text-3xl">{project.icon}</span>}
          <div>
            <ModalTitle>{project.title}</ModalTitle>
            <ModalDescription className="sr-only">
              Details about {project.title}
            </ModalDescription>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center hover:border-accent-brand/40 hover:text-accent-brand transition-colors duration-200")}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                View Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Demo
              </a>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
