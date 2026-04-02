export type Education = {
  degree: string;
  school: string;
  period: string;
  level: "university" | "senior-high" | "junior-high";
};

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  icon?: string;
  pdfUrl?: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Science in Information Technology",
    school: "Western Mindanao State University",
    period: "2022 - 2026",
    level: "university",
  },
  {
    degree: "Senior High School",
    school: "Western Mindanao State University",
    period: "2020 - 2022",
    level: "senior-high",
  },
  {
    degree: "Junior High School",
    school: "Western Mindanao State University",
    period: "2016 - 2020",
    level: "junior-high",
  },
];

export const certifications: Certification[] = [
  {
    title: "Civil Service Professional Passer",
    issuer: "Civil Service Commission, Philippines",
    year: "2025",
    icon: "🏛️",
  },
  {
    title: "Google DevFest Zamboanga Peninsula 2025",
    issuer: "GDG Zamboanga",
    year: "2025",
    icon: "🔥",
    pdfUrl: "/cert-devfest-2025.pdf",
  },
  {
    title: "Google I/O Extended",
    issuer: "GDG Zamboanga",
    year: "2024",
    icon: "🚀",
    pdfUrl: "/cert-google-io-2024.pdf",
  },
  {
    title: "DevFest 2023",
    issuer: "GDG Zamboanga",
    year: "2023",
    icon: "💡",
    pdfUrl: "/cert-devfest-2023.pdf",
  },
];
