import { HeroTerminal } from "@/components/sections/hero-terminal";
import { AboutTerminal } from "@/components/sections/about-terminal";
import { StackTable } from "@/components/sections/stack-table";
import { ExperienceLog } from "@/components/sections/experience-log";
import { ProjectsLog } from "@/components/sections/projects-log";
import { ContactTerminal } from "@/components/sections/contact-terminal";
import { HorizontalPan } from "@/components/scroll/horizontal-pan";
import { StickyStack } from "@/components/scroll/sticky-stack";
import { Scene } from "@/components/canvas/scene";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full max-w-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic background tweener target */}
      <div id="dynamic-bg" className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-background transition-colors duration-1000 ease-out" />
      
      {/* 3D Scrollytelling Scene */}
      <Scene />

      {/* ATTENTION: Cinematic Hero (Pinned) */}
      <section className="w-full relative z-40 bg-transparent">
        <HeroTerminal />
      </section>

      {/* INTEREST: About & Scrubbing Reveal (Pinned) */}
      <section className="w-full relative z-40 bg-transparent">
        <AboutTerminal />
      </section>

      {/* INTEREST: Flying Card Stack */}
      <section className="w-full relative z-40 bg-transparent border-y border-white/5">
        <StackTable />
      </section>

      {/* DESIRE: Stacked Experience */}
      <section className="w-full relative z-40 bg-background py-32">
        <StickyStack cards={[
          <div key="career" className="w-full h-full max-w-5xl mx-auto p-10 md:p-16 rounded-none bg-card border-[0.5px] border-red-500/30 border-l-4 border-l-red-500 shadow-[0_0_80px_rgba(239,68,68,0.2)] flex flex-col relative overflow-hidden group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700" />
            <h2 className="text-xl font-bold tracking-widest text-red-500 mb-12 uppercase relative z-10">CAREER LOG</h2>
            <div className="relative z-10"><ExperienceLog /></div>
          </div>
        ]} />
      </section>

      {/* DESIRE: Horizontal Pan Projects */}
      <section className="w-full bg-foreground text-background relative z-40 overflow-hidden">
        <HorizontalPan>
          <div className="flex-shrink-0 w-[80vw] md:w-[40vw] flex flex-col justify-center pr-12 pl-12 md:pl-24 relative z-10">
             <h2 className="text-[clamp(3rem,8vw,8rem)] tracking-tighter font-extrabold leading-[0.9] mb-8 uppercase">
               SELECTED<br/><span className="text-primary stroke-text outline-primary">WORKS</span>
             </h2>
             <p className="text-xl text-muted max-w-md leading-relaxed font-bold uppercase tracking-widest">
               A showcase of high-impact digital products.
             </p>
          </div>
          <ProjectsLog projects={projects} />
        </HorizontalPan>
      </section>

      {/* ACTION: Normal Footer */}
      <section className="w-full relative z-50 flex flex-col justify-end items-center px-6 lg:px-12 pt-32 pb-12 bg-background border-t border-white/5 overflow-hidden">
        <ContactTerminal />
      </section>
    </main>
  );
}
