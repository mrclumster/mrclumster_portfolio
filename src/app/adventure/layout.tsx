import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Adventure Mode | Aziz Tebbeng",
  description: "An interactive Pokemon-style world showcasing Aziz's 8-day Manila educational tour.",
  robots: { index: false },
};

export default function AdventureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${pressStart2P.variable} font-press-start`}>
      {children}
    </div>
  );
}
