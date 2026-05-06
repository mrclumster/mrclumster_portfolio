"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { TerminalButton } from "@/components/terminal/terminal-button";
import type { Project } from "@/data/projects";

interface Props {
  projects: Project[];
}

function useTilt() {
  const ref = useRef<HTMLElement>(null!);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg) scale(1.015)`;
    }
    function onLeave() {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const tiltRef = useTilt();

  return (
    <article
      ref={tiltRef as React.RefObject<HTMLElement>}
      className="group relative flex flex-col transition-transform duration-200 ease-out"
      style={{ willChange: "transform" }}
    >
      {/* Outer ruled border — two-line frame top */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden
        style={{
          boxShadow: "inset 0 0 0 1px var(--ink)",
          opacity: 0.25,
        }}
      />

      {/* Terminal frame header */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b font-mono text-[11px]"
        style={{ borderColor: "var(--ink)", opacity: 0.7, borderBottomWidth: "1px" }}
      >
        <span className="opacity-40">┌</span>
        <span
          className="opacity-50 tabular-nums tracking-wider"
          style={{ letterSpacing: "0.15em" }}
        >
          {num}
        </span>
        <span className="opacity-30 flex-1 overflow-hidden">
          {"─".repeat(30)}
        </span>
        <span className="opacity-40 text-[10px] uppercase tracking-widest">
          {project.tags[0] ?? "project"}
        </span>
        <span className="opacity-40">┐</span>
      </div>

      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover transition-all duration-700 ease-out"
              style={{
                filter: "grayscale(1) contrast(1.08) brightness(0.92)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(0) contrast(1) brightness(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(1) contrast(1.08) brightness(0.92)";
              }}
            />
            {/* Scanline overlay — fades on group hover */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
              }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl font-mono"
            style={{ color: "var(--ink)", opacity: 0.15 }}
          >
            {project.icon ?? "·"}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title row */}
        <div className="flex items-baseline gap-3">
          <h3
            className="font-mono font-bold uppercase tracking-tight leading-none"
            style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)", color: "var(--ink)" }}
          >
            {project.title}
          </h3>
          {/* Blinking cursor — only visible on hover */}
          <span
            aria-hidden
            className="font-mono text-[1rem] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              color: "var(--ink)",
              animation: "blink 1s steps(2,end) infinite",
            }}
          >
            ▌
          </span>
        </div>

        {/* Tags as bracketed tokens */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 border"
              style={{
                borderColor: "var(--ink)",
                color: "var(--ink)",
                opacity: 0.55,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p
          className="font-mono text-[0.8125rem] leading-relaxed flex-1"
          style={{ color: "var(--ink)", opacity: 0.7 }}
        >
          {project.description}
        </p>

        {/* Links */}
        <div
          className="flex flex-wrap gap-2 pt-1 border-t font-mono text-[0.8125rem]"
          style={{ borderColor: "var(--ink)", borderTopWidth: "1px", opacity: 1 }}
        >
          {project.githubUrl && (
            <TerminalButton
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-3 w-3" /> source_code
            </TerminalButton>
          )}
          {project.liveUrl && (
            <TerminalButton
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" /> view_demo
            </TerminalButton>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--ink)", opacity: 1 }}>
      {projects.map((p, i) => (
        <div key={p.title} style={{ background: "var(--paper)" }}>
          <ProjectCard project={p} index={i} />
        </div>
      ))}
    </div>
  );
}
