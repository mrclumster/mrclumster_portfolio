export type Experience = {
  title: string;
  company: string;
  companyUrl?: string;
  period: string;
  description: string;
  highlights?: string[];
};

export const experiences: Experience[] = [
  {
    title: "Intern Software Developer",
    company: "Nexzys Intelligence (Vintazk Outsourcing)",
    period: "2026 - Present",
    description:
      "Backend developer for Barangay Connect — a digital barangay system for Barangay Calarian with a mobile app, admin panel, and face-recognition kiosk, all powered by a shared Supabase backend.",
    highlights: [
      "Manage Supabase database migrations and schema design for the entire system",
      "Build and maintain Edge Functions for server-side logic and API endpoints",
      "Contributed to the face-recognition kiosk at the barangay entrance",
      "Ensure real-time data sync across mobile app, admin panel, and kiosk",
    ],
  },
];