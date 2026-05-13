"use client";

export function StackTable() {
  const categories = [
    {
      title: "Frontend Development",
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
    },
    {
      title: "Backend & Databases",
      items: ["Node.js", "PostgreSQL", "PHP", "Supabase", "REST APIs"],
    },
    {
      title: "Mobile & Cross-Platform",
      items: ["Flutter", "React Native", "Dart"],
    },
    {
      title: "Applied AI & Vision",
      items: ["PyTorch", "TensorFlow Lite", "YOLOv8", "ResNet50"],
    },
    {
      title: "DevOps & Security",
      items: ["Docker", "CI/CD", "Git", "OWASP Standards"],
    },
  ];

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat) => (
          <div key={cat.title} className="border border-[color:var(--ink)] p-4 relative group hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] transition-colors duration-200">
            <span className="absolute -top-2.5 left-2 bg-[color:var(--paper)] px-1.5 text-[10px] font-bold uppercase tracking-widest border border-[color:var(--ink)] group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--paper)]">
              {cat.title}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {cat.items.map((item) => (
                <span key={item} className="opacity-80 after:content-['/'] after:ml-2 after:opacity-30 last:after:content-['']">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
