"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-sm shadow-foreground/[0.03] transition-all duration-300 hover:shadow-lg hover:shadow-accent-brand/10 hover:-translate-y-1 hover:ring-accent-brand/25">
      {project.image ? (
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-accent-brand/10 via-accent-brand/5 to-transparent dark:from-accent-brand/15 dark:via-accent-brand/5 dark:to-transparent">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="flex flex-col items-center gap-2">
            {project.icon && (
              <span className="text-4xl">{project.icon}</span>
            )}
            <span className="text-2xl font-bold text-accent-brand/30 dark:text-accent-brand/40 transition-colors duration-300 group-hover/card:text-accent-brand/50">
              {project.title}
            </span>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs transition-colors duration-200 hover:border-accent-brand/40">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hover:border-accent-brand/40 hover:text-accent-brand transition-colors duration-200")}
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hover:border-accent-brand/40 hover:text-accent-brand transition-colors duration-200")}
            >
              <GithubIcon className="mr-1 h-4 w-4" />
              Code
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
