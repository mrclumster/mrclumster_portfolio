"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { Spotlight } from "@/components/ui/spotlight";
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

interface ProjectCardProps {
  project: Project;
  /** Larger feature card spans 2 cols on desktop. */
  feature?: boolean;
}

export function ProjectCard({ project, feature = false }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  return (
    <Modal>
      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setCursor(null)}
        className={cn("relative h-full", feature && "lg:col-span-2")}
      >
        <Spotlight className="h-full rounded-2xl">
          <ModalTrigger
            className={cn(
              "group/card flex h-full w-full flex-col overflow-hidden rounded-2xl text-left cursor-pointer",
              "ring-1 ring-foreground/8 transition-[ring-color] duration-300 hover:ring-foreground/20",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)]",
            )}
            style={{ background: "var(--color-surface)" }}
          >
            {/* Thumbnail header */}
            {project.image ? (
              <div className={cn("relative w-full overflow-hidden", feature ? "aspect-[16/8]" : "aspect-[16/10]")}>
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes={feature ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.02]"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex w-full items-center justify-center",
                  feature ? "aspect-[16/8]" : "aspect-[16/10]",
                )}
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklch, var(--color-accent) 8%, transparent) 0%, color-mix(in oklch, var(--color-accent) 2%, transparent) 100%)",
                }}
              >
                {project.icon && (
                  <span className={feature ? "text-6xl" : "text-4xl"}>{project.icon}</span>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-5 lg:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className={cn("font-sans font-semibold tracking-tight", feature ? "text-2xl" : "text-lg")}>
                  {project.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {project.tags.slice(0, feature ? 5 : 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </ModalTrigger>
        </Spotlight>

        {/* Cursor-following label */}
        {cursor && (
          <div
            aria-hidden
            className="project-cursor-label pointer-events-none absolute z-30"
            style={{ left: cursor.x, top: cursor.y, opacity: 1 }}
          >
            VIEW PROJECT →
          </div>
        )}
      </div>

      {/* Modal */}
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
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              About
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }), "flex-1 justify-center")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live
              </a>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
