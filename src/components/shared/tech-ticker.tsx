import { techStack } from "@/data/tech-stack";

export function TechTicker() {
  // Flatten all tech names from every category into one list
  const allTech = techStack.flatMap((cat) => cat.items.map((i) => i.name));
  // Duplicate for seamless loop
  const items = [...allTech, ...allTech];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max gap-2 py-1"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 rounded-full bg-muted/40 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-foreground/5"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
