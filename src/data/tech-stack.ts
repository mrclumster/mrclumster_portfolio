export type TechItem = {
  name: string;
  color: string;
};

export type TechCategory = {
  category: string;
  items: TechItem[];
};

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "JavaScript", color: "#f7df1e" },
      { name: "TypeScript", color: "#3178c6" },
      { name: "React", color: "#61dafb" },
      { name: "React Native", color: "#61dafb" },
      { name: "Next.js", color: "#a0a0a0" },
      { name: "Tailwind CSS", color: "#06b6d4" },
      { name: "HTML/CSS", color: "#e34f26" },
    ],
  },
  {
    category: "Backend & ML",
    items: [
      { name: "Python", color: "#3776ab" },
      { name: "Supabase", color: "#3ecf8e" },
      { name: "Machine Learning", color: "#ff6f00" },
      { name: "Computer Vision", color: "#76b900" },
      { name: "Face Recognition", color: "#e040fb" },
    ],
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", color: "#f05032" },
      { name: "GitHub", color: "#a0a0a0" },
      { name: "VS Code", color: "#007acc" },
      { name: "Vercel", color: "#a0a0a0" },
      { name: "Docker", color: "#2496ed" },
      { name: "Kaggle", color: "#20beff" },
      { name: "Roboflow", color: "#6706ce" },
    ],
  },
];
