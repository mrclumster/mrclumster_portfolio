export type BioSegment =
  | { type: "text"; value: string }
  | { type: "keyword"; value: string }
  | { type: "secret"; value: string };

export type Bio = BioSegment[][];

export const personalInfo = {
  name: "Aziz Tebbeng",
  headline: "Aspiring Full-Stack Developer & ML Enthusiast",
  headlines: [
    "Full-Stack Developer",
    "ML Enthusiast",
    "Professional Bug Creator",
    "Powered by Caffeine ☕",
  ],
  status: {
    label: "Available for opportunities",
  },
  location: "Zamboanga City, Philippines",
  bio: [
    [
      { type: "text", value: "I am a fourth-year " },
      { type: "keyword", value: "Bachelor of Science in Information Technology" },
      { type: "text", value: " student with a strong passion for web development and machine learning. I am currently completing my " },
      { type: "keyword", value: "internship at Nexzys Intelligence" },
      { type: "text", value: " under Vintazk Outsourcing, where I contribute to building full-stack digital solutions for local government systems." },
      { type: "secret", value: " (Translation: I write SQL on Mondays and pretend I understood it by Friday.)" },
    ],
    [
      { type: "text", value: "As the Machine Learning Engineer for our " },
      { type: "keyword", value: "Capstone Project" },
      { type: "text", value: ", " },
      { type: "keyword", value: "FishFresh" },
      { type: "text", value: ", I developed the computer vision model for real-time fish freshness assessment. I am also actively working on " },
      { type: "keyword", value: "Barangay Connect" },
      { type: "text", value: ", a comprehensive digital barangay system. I am driven by the goal of creating technology that delivers meaningful impact to communities." },
      { type: "secret", value: " (Also driven by 3 cups of coffee and a slowly degrading sleep schedule.)" },
    ],
  ] satisfies Bio,
  email: "aziztebbeng@gmail.com",
  socialLinks: {
    github: "https://github.com/mrclumster",
    linkedin: "https://www.linkedin.com/in/aziztebbengthemrclumster/",
    facebook: "https://www.facebook.com/goyyyyyy/",
    instagram: "https://www.instagram.com/aziztebbeng_/",
  },
  profileImage: "/images/profile.jpg",
} as const;
