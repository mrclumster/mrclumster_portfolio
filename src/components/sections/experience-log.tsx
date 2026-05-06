import { experiences, type Experience } from "@/data/experience";

function shortHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(7, "0").slice(0, 7);
}

function ExperienceEntry({ entry, index, total }: { entry: Experience; index: number; total: number }) {
  const head = index === 0;
  return (
    <article className="space-y-1 text-[13px] leading-[1.6]">
      <p>
        <span className="opacity-60">commit </span>
        <span>{shortHash(entry.title + entry.company)}</span>
        {head ? <span className="ml-2 opacity-60">(HEAD -&gt; current)</span> : null}
        {!head && index === total - 1 ? <span className="ml-2 opacity-60">(initial)</span> : null}
      </p>
      <p>
        <span className="opacity-60">Author: </span>
        {entry.companyUrl ? (
          <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
            {entry.company}
          </a>
        ) : (
          entry.company
        )}
      </p>
      <p>
        <span className="opacity-60">Date:   </span>
        {entry.period}
      </p>
      <p className="pt-2 pl-4 font-semibold">{entry.title}</p>
      <p className="pl-4 opacity-80">{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="pl-4 list-none space-y-0.5">
          {entry.highlights.map((h, i) => (
            <li key={i}>
              <span className="opacity-60">- </span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ExperienceLog() {
  return (
    <div className="space-y-6">
      {experiences.map((entry, i) => (
        <ExperienceEntry key={i} entry={entry} index={i} total={experiences.length} />
      ))}
    </div>
  );
}
