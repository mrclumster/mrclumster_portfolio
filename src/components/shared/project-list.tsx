"use client";

import { ProjectCard } from "@/components/shared/project-card";
import type { Project } from "@/data/projects";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) return null;

  const [first, ...rest] = projects;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ProjectCard project={first} feature />
      {rest.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}
