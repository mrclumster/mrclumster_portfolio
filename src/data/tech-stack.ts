export type TechItem = {
  name: string;
  color: string;
  version?: string;
};

export type TechCategory = {
  category: string;
  items: TechItem[];
};

export const techStack: TechCategory[] = [
  {
    category: "Frontend Development",
    items: [
      { name: "React", color: "#61dafb" },
      { name: "Next.js", color: "#ffffff" },
      { name: "Tailwind CSS", color: "#06b6d4" },
      { name: "Framer Motion", color: "#ff0055" },
      { name: "Three.js", color: "#ffffff" },
    ],
  },
  {
    category: "Backend & Databases",
    items: [
      { name: "Node.js", color: "#339933" },
      { name: "PostgreSQL", color: "#4169e1" },
      { name: "PHP", color: "#777bb4" },
      { name: "Supabase", color: "#3ecf8e" },
      { name: "REST APIs", color: "#00ff00" },
    ],
  },
  {
    category: "Mobile & Cross-Platform",
    items: [
      { name: "Flutter", color: "#02569b" },
      { name: "React Native", color: "#61dafb" },
      { name: "Dart", color: "#0175c2" },
    ],
  },
  {
    category: "Applied AI & Vision",
    items: [
      { name: "PyTorch", color: "#ee4c2c" },
      { name: "TensorFlow Lite", color: "#ff6f00" },
      { name: "YOLOv8", color: "#00ffff" },
      { name: "ResNet50", color: "#ffcc00" },
    ],
  },
  {
    category: "DevOps & Security",
    items: [
      { name: "Docker", color: "#2496ed" },
      { name: "CI/CD", color: "#ffffff" },
      { name: "Git", color: "#f05032" },
      { name: "OWASP Standards", color: "#ffffff" },
    ],
  },
];
