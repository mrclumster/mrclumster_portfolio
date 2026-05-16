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
  badgeUrl?: string;
  credentialUrl?: string; // Link to badge/profile
  subCertificates?: Certification[]; // Nested courses
  groupLabel?: string; // e.g. "Series Overview" instead of "Program Overview"
  itemLabel?: string; // e.g. "Events" instead of "Individual Courses"
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
    icon: "Landmark",
  },
  {
    title: "Google Developer Events",
    issuer: "GDG Zamboanga",
    year: "2023 - 2025",
    icon: "Sparkles",
    groupLabel: "Series Overview",
    itemLabel: "Individual Certificates",
    subCertificates: [
      {
        title: "Google DevFest Zamboanga Peninsula 2025",
        issuer: "GDG Zamboanga",
        year: "2025",
        icon: "Sparkles",
        pdfUrl: "/cert-devfest-2025.pdf",
      },
      {
        title: "Google I/O Extended 2024",
        issuer: "GDG Zamboanga",
        year: "2024",
        icon: "Terminal",
        pdfUrl: "/cert-google-io-2024.pdf",
      },
      {
        title: "DevFest 2023",
        issuer: "GDG Zamboanga",
        year: "2023",
        icon: "Lightbulb",
        pdfUrl: "/cert-devfest-2023.pdf",
      },
    ],
  },
  {
    title: "Google IT Support Professional Certificate",
    issuer: "Google (via Coursera)",
    year: "2026",
    icon: "Wrench",
    credentialUrl: "https://coursera.org/verify/professional-cert/6GP7ABY0JNUU",
    pdfUrl: "/google it professional certificate coursera/MAIN_Google IT Support Coursera 6GP7ABY0JNUU.pdf",
    subCertificates: [
      {
        title: "Technical Support Fundamentals",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/google it professional certificate coursera/Technical Support Fundamentals_Coursera 95CG1P9UFBFC.pdf",
        credentialUrl: "https://coursera.org/verify/95CG1P9UFBFC",
      },
      {
        title: "The Bits and Bytes of Computer Networking",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/google it professional certificate coursera/The Bits and Bytes of Computer Networking Coursera D32NW62WC3D8.pdf",
        credentialUrl: "https://coursera.org/verify/D32NW62WC3D8",
      },
      {
        title: "Operating Systems and You: Becoming a Power User",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/google it professional certificate coursera/Operating Systems and You Becoming a PowerCoursera FHJEPRL5RVZN.pdf",
        credentialUrl: "https://coursera.org/verify/FHJEPRL5RVZN",
      },
      {
        title: "System Administration and IT Infrastructure Services",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/google it professional certificate coursera/System Administration and IT Infrastructure Coursera 5BTWJDJW6B1S.pdf",
        credentialUrl: "https://coursera.org/verify/5BTWJDJW6B1S",
      },
      {
        title: "IT Security: Defense against the digital dark arts",
        issuer: "Google",
        year: "2026",
        pdfUrl: "/google it professional certificate coursera/IT Security Defense against the digital dark art Coursera YWLX8OWL2J35.pdf",
        credentialUrl: "https://coursera.org/verify/YWLX8OWL2J35",
      },
    ],
  },
  {
    title: "Cloud Digital Leader Certification",
    issuer: "Google Cloud",
    year: "2026",
    icon: "Cloud",
    groupLabel: "Path Overview",
    itemLabel: "Course Badges",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { 
        title: "Digital Transformation with Google Cloud", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23754955",
        badgeUrl: "https://cdn.qwiklabs.com/6xUK2PRpVXBXPfceAsFMtLwhoEfwpXtmN5ityJjCdjU%3D"
      },
      { 
        title: "Exploring Data Transformation with Google Cloud", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23755682",
        badgeUrl: "https://cdn.qwiklabs.com/cjGVnoF%2FOdfhTVoDqKjUZhwt7oXFDcBmdki6VS4jkUk%3D"
      },
      { 
        title: "Innovating with Google Cloud Artificial Intelligence", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23756004",
        badgeUrl: "https://cdn.qwiklabs.com/SC6UVmdeE73p3qS2iV3AqxIM1%2FuQ7ZsoStMBrtfZ6to%3D"
      },
      { 
        title: "Modernize Infrastructure and Applications with Google Cloud", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23757179",
        badgeUrl: "https://cdn.qwiklabs.com/jlifW5L5RBFmN7cKHUHRt0RzZCNwc7r1C8m4kAM7qMU%3D"
      },
      { 
        title: "Trust and Security with Google Cloud", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23757456",
        badgeUrl: "https://cdn.qwiklabs.com/40DWgR6ckA%2FXi0LsQN8eB%2FkNoiWgT0TxC6GTa00d%2Bj0%3D"
      },
      { 
        title: "Scaling with Google Cloud Operations", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23757673",
        badgeUrl: "https://cdn.qwiklabs.com/HeLDV1uMA6WhSaD50vdScxDqprXidaKJQGYYKWvn4aA%3D"
      },
    ],
  },
  {
    title: "Associate Cloud Engineer Certification",
    issuer: "Google Cloud",
    year: "2026",
    icon: "Terminal",
    groupLabel: "Path Overview",
    itemLabel: "Course Badges",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { 
        title: "Preparing for Your Associate Cloud Engineer Journey", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23754466",
        badgeUrl: "https://cdn.qwiklabs.com/syPw10WsSHyYbq%2FTxOHXMvrPwYxowGY20emm1AN3gew%3D"
      },
    ],
  },
  {
    title: "Google Cloud AI Infrastructure",
    issuer: "Google Cloud",
    year: "2026",
    icon: "Cpu",
    groupLabel: "Series Overview",
    itemLabel: "Course Badges",
    credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5",
    subCertificates: [
      { 
        title: "AI Infrastructure: Introduction to AI Hypercomputer", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23715745",
        badgeUrl: "https://cdn.qwiklabs.com/nK9hQxanudyuRC1BvmYXupqpxAadYMAJRjjehG%2FKsdc%3D"
      },
      { 
        title: "AI Infrastructure: Cloud GPUs", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23715843",
        badgeUrl: "https://cdn.qwiklabs.com/S3Fk0X5U9Xz76aXgmk4CAsmyzzHm4dsLx6Jic8OKQGU%3D"
      },
      { 
        title: "AI Infrastructure: Cloud TPUs", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23715972",
        badgeUrl: "https://cdn.qwiklabs.com/YU4aGcbO%2FwXYPN4M16ewenm%2FgE%2FhhZPMEwaY61eyar8%3D"
      },
      { 
        title: "AI Infrastructure: Deployment Types", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23716148",
        badgeUrl: "https://cdn.qwiklabs.com/GNTCHYxUsqpfgD3B9d1tjnI6giwuhhQz9dAF48tXzqg%3D"
      },
      { 
        title: "AI Infrastructure: Storage Options", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23716243",
        badgeUrl: "https://cdn.qwiklabs.com/dj3lgWO7VenGNfVOsJPlmoGIFOx%2B%2BV%2FHD85Y%2FbDCcd4%3D"
      },
      { 
        title: "AI Infrastructure: Networking Techniques", 
        issuer: "Google Cloud", 
        year: "2026", 
        credentialUrl: "https://www.skills.google/public_profiles/28681945-e84c-47c3-a1ed-0575f4d8b1a5/badges/23716893",
        badgeUrl: "https://cdn.qwiklabs.com/xLjCLC5dxOS%2Bwct6YawZVYik4%2BO%2BWzVAxc7SZuN%2FkoE%3D"
      },
    ],
  },
];
