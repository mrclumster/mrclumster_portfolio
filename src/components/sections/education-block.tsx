import { education } from "@/data/education";

export function EducationBlock() {
  return (
    <div className="space-y-4 text-[13px] leading-[1.6]">
      <ul className="space-y-3">
        {education.map((edu, i) => (
          <li key={i}>
            <p className="font-semibold">{edu.degree}</p>
            <p className="opacity-80">{edu.school}</p>
            <p className="opacity-60 text-[12px]">{edu.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
