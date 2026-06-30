export type BioSegment =
  | { type: "text"; value: string }
  | { type: "keyword"; value: string }
  | { type: "secret"; value: string };

export type Bio = BioSegment[][];

export const personalInfo = {
  name: "Abdel-Aziz Tebbeng",
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
      { type: "text", value: "I am a " },
      { type: "keyword", value: "Fullstack Developer" },
      { type: "text", value: " dedicated to building software that solves real-world problems. From architecting " },
      { type: "keyword", value: "FishFresh" },
      { type: "text", value: " (AI-driven food safety) to scaling " },
      { type: "keyword", value: "Barangay Connect" },
      { type: "text", value: ", I thrive on turning complex logic into seamless experiences." },
      { type: "secret", value: " (Translation: I turn caffeine into working features and bugs into lessons.)" },
    ],
    [
      { type: "text", value: "I specialize in crafting robust, scalable architectures with a focus on impact and user-centric design. I believe technology should deliver meaningful value to communities." },
      { type: "secret", value: " (I also have a strangely deep relationship with console.log.)" },
    ],
    [
      { type: "text", value: "I could explain my entire tech stack, but you probably wouldn't read it anyway. Just " },
      { type: "keyword", value: "scroll down" },
      { type: "text", value: " and look at the pretty colors." },
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
