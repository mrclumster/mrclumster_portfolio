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
  credentialUrl?: string; // Link to badge/profile
  subCertificates?: Certification[]; // Nested courses
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
  {
    title: "Google IT Support Professional Certificate",
    issuer: "Google (via Coursera)",
    year: "2026",
    icon: "🛠️",
    credentialUrl: "https://www.coursera.org/professional-certificates/google-it-support",
    subCertificates: [
      {
        title: "Technical Support Fundamentals",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-1.pdf",
      },
      {
        title: "The Bits and Bytes of Computer Networking",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-2.pdf",
      },
      {
        title: "Operating Systems and You: Becoming a Power User",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-3.pdf",
      },
      {
        title: "System Administration and IT Infrastructure Services",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-4.pdf",
      },
      {
        title: "IT Security: Defense against the digital dark arts",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/certs/it-support-5.pdf",
      },
    ],
  },
  {
    title: "Google Cloud Learning Path",
    issuer: "Google Cloud",
    year: "2026",
    icon: "☁️",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { title: "Digital Transformation with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Exploring Data Transformation with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Innovating with Google Cloud Artificial Intelligence", issuer: "Google Cloud", year: "2026" },
      { title: "Modernize Infrastructure and Applications with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Trust and Security with Google Cloud", issuer: "Google Cloud", year: "2026" },
      { title: "Scaling with Google Cloud Operations", issuer: "Google Cloud", year: "2026" },
      { title: "Preparing for Your Associate Cloud Engineer Journey", issuer: "Google Cloud", year: "2026" },
    ],
  },
  {
    title: "AI Infrastructure Series",
    issuer: "Google Cloud",
    year: "2026",
    icon: "🤖",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { title: "AI Infrastructure: Introduction to AI Hypercomputer", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Cloud GPUs", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Cloud TPUs", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Deployment Types", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Storage Options", issuer: "Google Cloud", year: "2026" },
      { title: "AI Infrastructure: Networking Techniques", issuer: "Google Cloud", year: "2026" },
    ],
  },
];
