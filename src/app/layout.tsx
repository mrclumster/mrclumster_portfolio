import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aziztebbeng.vercel.app"),
  title: {
    default: "Aziz Tebbeng | Aspiring Full-Stack Developer & ML Enthusiast",
    template: "%s | Aziz Tebbeng",
  },
  description:
    "Portfolio of Aziz Tebbeng — BSIT student at WMSU, web developer intern at Nexzys Intelligence, ML engineer behind FishFresh, and Civil Service Professional Passer.",
  openGraph: {
    title: "Aziz Tebbeng | Aspiring Full-Stack Developer & ML Enthusiast",
    description:
      "Portfolio of Aziz Tebbeng — BSIT student at WMSU, web developer intern at Nexzys Intelligence, ML engineer behind FishFresh, and Civil Service Professional Passer.",
    type: "website",
    url: "https://aziztebbeng.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aziz Tebbeng | Aspiring Full-Stack Developer & ML Enthusiast",
    description:
      "Portfolio of Aziz Tebbeng — BSIT student at WMSU, web developer intern, ML engineer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased terminal-route">
        <Script
          id="ld-json-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aziz Tebbeng",
              url: "https://aziztebbeng.vercel.app",
              email: "aziztebbeng@gmail.com",
              jobTitle: "Web Developer Intern",
              worksFor: { "@type": "Organization", name: "Nexzys Intelligence" },
              alumniOf: { "@type": "CollegeOrUniversity", name: "Western Mindanao State University" },
              knowsAbout: ["Web Development", "Machine Learning", "Computer Vision", "React", "Next.js", "Python"],
              sameAs: [
                "https://github.com/mrclumster",
                "https://www.linkedin.com/in/aziztebbengthemrclumster/",
              ],
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <main className="flex-1">{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
