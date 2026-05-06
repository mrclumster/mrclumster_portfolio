"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { ConsoleGreeting } from "@/components/shared/console-greeting";
import { FishRain } from "@/components/shared/fish-rain";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { GrainOverlay } from "@/components/ui/grain-overlay";

/**
 * Renders the full portfolio shell (header, footer, scroll progress, easter eggs).
 * Wraps children so Footer always comes after the page content.
 * Returns children unwrapped on /adventure so the game gets a clean full-screen canvas.
 */
export function PortfolioChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/adventure")) return <>{children}</>;

  return (
    <>
      <LenisProvider />
      <GrainOverlay />
      <CursorFollower />
      <ConsoleGreeting />
      <FishRain />
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
    </>
  );
}
