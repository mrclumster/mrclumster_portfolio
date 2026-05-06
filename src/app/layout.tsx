import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { PortfolioChrome } from "@/components/layout/portfolio-chrome";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-italic",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased bg-noise bg-page-gradient overflow-x-hidden">
        <script
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* Atmosphere — single-accent drifting blobs */}
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div
              className="absolute -top-32 -left-20 h-[500px] w-[500px] rounded-full blur-3xl will-change-transform"
              style={{
                background: "color-mix(in oklch, var(--color-accent) 6%, transparent)",
                animation: "blob-drift-1 25s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full blur-3xl will-change-transform"
              style={{
                background: "color-mix(in oklch, var(--color-accent) 4%, transparent)",
                animation: "blob-drift-2 30s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full blur-3xl will-change-transform"
              style={{
                background: "color-mix(in oklch, var(--color-accent) 3%, transparent)",
                animation: "blob-drift-3 28s ease-in-out infinite",
              }}
            />
          </div>
          <PortfolioChrome>
            <main className="flex-1">{children}</main>
          </PortfolioChrome>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
