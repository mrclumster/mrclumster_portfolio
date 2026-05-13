"use client";

import { PhotoFrame } from "@/components/hero/photo-frame";
import { TerminalEyeArc } from "@/components/hero/terminal-eye-arc";

interface AsciiFrameProps {
  imageSrc: string;
}

export function AsciiFrame({ imageSrc }: AsciiFrameProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 -mt-8">
      {/* Terminal Eye Arc centered above the photo */}
      <div className="flex justify-center -mb-8 h-[140px] z-10">
        <TerminalEyeArc />
      </div>

      {/* Photo Frame centered below the arc */}
      <div
        className="relative z-0"
        style={{
          width: 280,
          height: 364,
        }}
      >
        <PhotoFrame imageSrc={imageSrc} />
      </div>

      {/* Clean status footer replacing the complex one */}
      <div className="font-mono text-[11px] text-[color:var(--ink)] opacity-50 select-none mt-2">
        └─ aziz_v1.0 — online ─┘
      </div>
    </div>
  );
}
