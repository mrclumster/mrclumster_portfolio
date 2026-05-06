import { projects } from "@/data/projects";
import { techStack } from "@/data/tech-stack";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/education";

export function UptimeLine() {
  const techCount = techStack.reduce((acc, cat) => acc + cat.items.length, 0);
  const parts = [
    `${projects.length} projects`,
    `${techCount} technologies`,
    `${experiences.length} internship${experiences.length === 1 ? "" : "s"}`,
    `${certifications.length} certifications`,
  ];
  return (
    <p className="text-[13px] opacity-70">
      <span className="opacity-50">uptime ──</span> {parts.join(" · ")}
    </p>
  );
}
