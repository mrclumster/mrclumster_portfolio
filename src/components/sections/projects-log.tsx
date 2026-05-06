"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { GithubIcon } from "@/components/shared/icons";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { KeyValue, KeyValueList } from "@/components/terminal/key-value";
import { AsciiDivider } from "@/components/terminal/ascii-divider";
import type { Project } from "@/data/projects";

interface Props {
  projects: Project[];
}

export function ProjectsLog({ projects }: Props) {
  if (projects.length === 0) return null;
  return (
    <div className="space-y-10">
      {projects.map((p, i) => {
        const idx = String(i + 1).padStart(2, "0");
        return (
          <article key={p.title} className="space-y-3">
            <AsciiDivider label={`project_${idx} — ${p.title.toLowerCase().replace(/\s+/g, "_")}`} />
            <KeyValueList>
              <KeyValue k="name">{p.title}</KeyValue>
              <KeyValue k="stack">{p.tags.join(" · ")}</KeyValue>
              <KeyValue k="desc">{p.description}</KeyValue>
              <KeyValue k="links">
                <span className="inline-flex flex-wrap gap-3">
                  {p.githubUrl && (
                    <TerminalButton href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="h-3.5 w-3.5" /> github
                    </TerminalButton>
                  )}
                  {p.liveUrl && (
                    <TerminalButton href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" /> demo
                    </TerminalButton>
                  )}
                </span>
              </KeyValue>
            </KeyValueList>
            <Modal>
              <ModalTrigger className="block w-full max-w-xl border border-[color:var(--ink)] cursor-pointer hover:bg-[color:var(--ink)]/5 transition-colors">
                {p.image ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.image}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 540px, 100vw"
                      className="object-cover"
                      style={{ filter: "grayscale(1) contrast(1.05)" }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] flex items-center justify-center text-3xl">{p.icon ?? "·"}</div>
                )}
              </ModalTrigger>
              <ModalContent>
                <ModalTitle>{p.title}</ModalTitle>
                <ModalDescription className="sr-only">Details about {p.title}</ModalDescription>
                <div className="mt-4 space-y-4 text-[14px]">
                  <p className="opacity-80">{p.description}</p>
                  <p className="opacity-60 text-[12px]">stack: {p.tags.join(" · ")}</p>
                </div>
              </ModalContent>
            </Modal>
          </article>
        );
      })}
    </div>
  );
}
