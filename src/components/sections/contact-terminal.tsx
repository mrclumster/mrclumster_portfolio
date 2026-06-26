"use client";
import { personalInfo } from "@/data/personal";

export function ContactTerminal() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <h2 className="text-[clamp(4rem,12vw,14rem)] font-extrabold tracking-tighter leading-[0.8] mb-12 text-foreground">
        LET'S
        <br/>
        TALK.
      </h2>
      
      <a 
        href={`mailto:${personalInfo.email}`}
        className="text-2xl md:text-5xl font-bold tracking-tight hover:italic transition-all duration-300 text-muted-foreground hover:text-foreground mb-16"
      >
        {personalInfo.email}
      </a>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {personalInfo.socialLinks.github && (
          <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">
            GitHub
          </a>
        )}
        {personalInfo.socialLinks.linkedin && (
          <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">
            LinkedIn
          </a>
        )}
        {personalInfo.socialLinks.facebook && (
          <a href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">
            Facebook
          </a>
        )}
        {personalInfo.socialLinks.instagram && (
          <a href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest font-bold hover:opacity-50 transition-opacity">
            Instagram
          </a>
        )}
      </div>
      
      <div className="mt-32 w-full flex justify-between items-center text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground border-t border-border pt-8">
        <span>© {new Date().getFullYear()}</span>
        <span>{personalInfo.location}</span>
      </div>
    </div>
  );
}
