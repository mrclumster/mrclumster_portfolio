"use client";

import { useRef } from "react";
import { ExternalLink, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { TerminalButton } from "@/components/terminal/terminal-button";
import type { Project } from "@/data/projects";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

interface Props {
  projects: Project[];
}

// Helper component to render icons by name
const ProjectIcon = ({ name }: { name?: string }) => {
  if (!name) return <LucideIcons.Folder className="w-6 h-6 opacity-60" />;
  
  const IconComponent = (LucideIcons as Record<string, LucideIcons.LucideIcon>)[name];
  if (!IconComponent) return <LucideIcons.Folder className="w-6 h-6 opacity-60" />;
  
  return <IconComponent className="w-6 h-6 opacity-80" />;
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Increased opacities for better visibility (0.05 -> 0.12 for bg, 0.25 -> 0.4 for border)
  const background = useMotionTemplate`radial-gradient(450px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.12), transparent 80%)`;
  const borderSpotlight = useMotionTemplate`radial-gradient(300px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.4), transparent 80%)`;

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col h-full bg-[var(--paper)] transition-all duration-300 overflow-hidden"
    >
      {/* The Spotlight Background Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      
      {/* The Spotlight Border Light */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{ 
          border: '1px solid transparent',
          backgroundImage: borderSpotlight,
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Outer static border */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden
        style={{
          boxShadow: "inset 0 0 0 1px var(--ink)",
          opacity: 0.1,
        }}
      />

      {/* Featured Vertical Accent */}
      {project.featured && project.gradientColor && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
          style={{ backgroundColor: project.gradientColor }}
        />
      )}

      {/* Content wrapper to stay above spotlight bg but below border light */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8">
              <ProjectIcon name={project.icon} />
            </div>
            <h3
              className="font-mono font-bold uppercase tracking-tight text-lg"
              style={{ color: "var(--ink)" }}
            >
              {project.title}
            </h3>
          </div>
          
          {project.featured && (
            <span 
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-bold rounded-full"
              style={{ 
                backgroundColor: project.gradientColor ? `${project.gradientColor}15` : 'rgba(var(--ink-rgb), 0.1)',
                color: project.gradientColor || 'var(--ink)',
                border: `1px solid ${project.gradientColor ? `${project.gradientColor}30` : 'rgba(var(--ink-rgb), 0.2)'}`
              }}
            >
              <Star className="w-3 h-3 fill-current" />
              Major Project
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 pb-5 flex-1">
          {/* Description */}
          <p
            className="font-mono text-[0.875rem] leading-relaxed flex-1"
            style={{ color: "var(--ink)", opacity: 0.75 }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm"
                style={{
                  backgroundColor: 'rgba(var(--ink-rgb), 0.05)',
                  color: "var(--ink)",
                  opacity: 0.8,
                }}
              >
                [{tag}]
              </span>
            ))}
          </div>

          {/* Links */}
          <div
            className="flex flex-wrap gap-3 pt-4 mt-2 border-t font-mono text-[0.8125rem]"
            style={{ borderColor: "var(--ink)", borderTopWidth: "1px", opacity: 0.2 }}
          />
          <div className="flex flex-wrap gap-3 font-mono text-[0.8125rem]">
            {project.githubUrl && (
              <TerminalButton
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-3.5 w-3.5" /> Source
              </TerminalButton>
            )}
            {project.liveUrl && (
              <TerminalButton
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Visit
              </TerminalButton>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      {projects.map((p, i) => (
        <ProjectCard 
          key={p.title} 
          project={p} 
          index={i} 
        />
      ))}
    </div>
  );
}
