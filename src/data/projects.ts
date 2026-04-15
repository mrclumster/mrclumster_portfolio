export type Project = {
  title: string;
  description: string;
  image: string;
  icon?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  gradientColor?: string;
};

export const projects: Project[] = [
  {
    title: "FishFresh",
    description:
      "A mobile-based computer vision system for real-time fish freshness assessment in Zamboanga City. Served as the Machine Learning Engineer, building the model and handling the computer vision component to help address uncertain fish freshness checks in post-harvest quality.",
    image: "/images/projects/fishfresh.jpg",
    icon: "🐟",
    tags: ["Python", "Computer Vision", "Machine Learning", "React Native"],
    githubUrl: "https://github.com/chirdnek/2025-CP_Fishfresh",
    featured: true,
    gradientColor: "#3b82f6",
  },
  {
    title: "Barangay Connect",
    description:
      "The official digital system of Barangay Calarian — a mobile app for residents, an admin panel for barangay staff, and a face-recognition kiosk at the barangay entrance, all connected to the same live database. Reduces wait times and automates paperwork.",
    image: "",
    icon: "🏘️",
    tags: ["Next.js", "React Native", "TypeScript", "Supabase", "Face Recognition"],
    githubUrl: "https://github.com/kent-vintazk/barangayConnect",
    featured: true,
    gradientColor: "#10b981",
  },
  {
    title: "Portfolio Website",
    description:
      "Personal developer portfolio built with modern web technologies, featuring dark mode, responsive design, and SEO optimization.",
    image: "/images/projects/portfolio.bmp",
    icon: "💻",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/mrclumster",
    featured: true,
    gradientColor: "#8b5cf6",
  },
];
