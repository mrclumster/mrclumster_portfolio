import { education } from "@/data/education";

export function EducationBlock() {
  return (
    <div className="space-y-8">
      <ul className="space-y-8">
        {education.map((edu, i) => (
          <li key={i} className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
            <p className="text-primary font-medium">{edu.school}</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">{edu.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
