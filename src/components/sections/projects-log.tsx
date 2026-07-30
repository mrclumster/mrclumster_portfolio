"use client";

import { ExternalLink, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import type { Project } from "@/data/projects";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
}

const ProjectIcon = ({ name }: { name?: string }) => {
  if (!name) return <LucideIcons.Folder className="w-8 h-8 opacity-60" />;
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
  if (!IconComponent) return <LucideIcons.Folder className="w-8 h-8 opacity-60" />;
  return <IconComponent className="w-8 h-8 opacity-80" />;
};

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !cardRef.current) return;
    
    // Scale animation on scroll
    gsap.fromTo(cardRef.current,
      { scale: 0.95, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "left 85%",
          end: "left 30%",
          containerAnimation: ScrollTrigger.getById("horizontal-pan")?.animation,
          scrub: 1,
        }
      }
    );
  }, [reduce]);

  // Emil Kowalski Button Class
  const actionButtonClass = `
    flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] 
    bg-foreground text-background px-6 py-3
    transition-[transform,filter,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
    active:scale-[0.97] active:blur-[1px] active:opacity-80
    hover:opacity-90
  `;

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col h-[75vh] bg-background/20 backdrop-blur-xl text-foreground transition-all duration-300 overflow-hidden w-[85vw] md:w-[50vw] flex-shrink-0 border border-foreground/10 rounded-sm"
    >
      <div className="relative z-20 flex flex-col h-full p-8 md:p-12">
        <div className="flex items-center justify-between pb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-foreground/5 border border-foreground/10 rounded-sm">
            <ProjectIcon name={project.icon} />
          </div>
          
          {project.featured && (
            <span className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black bg-foreground/5 border border-foreground/10 text-foreground rounded-sm">
              <Star className="w-3 h-3 fill-current opacity-80" />
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-col gap-8 flex-1 justify-end">
          <h3 className="font-extrabold tracking-tighter text-4xl md:text-6xl text-foreground leading-[0.9] uppercase">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
               <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 border border-foreground/10 rounded-full text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-8 mt-4 border-t border-foreground/10">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionButtonClass}
              >
                <GithubIcon className="h-4 w-4" /> Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionButtonClass}
              >
                <ExternalLink className="h-4 w-4" /> Launch
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <div className="flex gap-16 md:gap-32 relative pr-32 pb-16">
      {projects.map((p, i) => (
        <ProjectCard 
          key={p.title} 
          project={p} 
          index={i} 
          total={projects.length}
        />
      ))}
    </div>
  );
}
