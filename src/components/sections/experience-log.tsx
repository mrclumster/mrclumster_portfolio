"use client";

import { experiences, type Experience } from "@/data/experience";

function ExperienceEntry({ entry }: { entry: Experience }) {
  return (
    <article className="space-y-1 text-[13px] leading-[1.6]">
      <div className="flex gap-2">
        <span className="opacity-60 shrink-0">{">"} Role: </span>
        <span className="font-semibold">{entry.title}</span>
      </div>
      <div className="flex gap-2">
        <span className="opacity-60 shrink-0">{">"} Org:  </span>
        {entry.companyUrl ? (
          <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
            {entry.company}
          </a>
        ) : (
          entry.company
        )}
      </div>
      <div className="flex gap-2">
        <span className="opacity-60 shrink-0">{">"} Date: </span>
        <span>{entry.period}</span>
      </div>
      
      <div className="mt-4 pl-4 space-y-2 border-l border-[color:var(--ink)]/10">
        <p className="opacity-80">{entry.description}</p>
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="list-none space-y-1">
            {entry.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="opacity-40">-</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ExperienceLog() {
  return (
    <div className="space-y-10">
      {experiences.map((entry, i) => (
        <ExperienceEntry key={i} entry={entry} />
      ))}
      <p className="font-mono text-[10px] mt-6 select-none" style={{ opacity: 0.3 }}>
        └─ end of log ─┘
      </p>
    </div>
  );
}
