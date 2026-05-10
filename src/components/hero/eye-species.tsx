import React from "react";

export type EyeSpeciesType =
  | "classic" | "observer" | "glitch" | "lash" | "cyber" | "feline" 
  | "hollow" | "binary" | "recursive" | "clockwork" | "ascii" | "pulse" 
  | "orbit" | "crosshair" | "static" | "shadow";

export interface EyeProps {
  pupilX: number;
  pupilY: number;
  isBlinking: boolean;
  idleOffset: number;
  isTracking: boolean;
}

export const EYE_SPECIES: Record<EyeSpeciesType, (props: EyeProps) => React.ReactNode> = {
  classic: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  observer: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-6 h-6 border-2 border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-2.5 h-2.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX * 0.7}px), calc(-50% + ${pupilY * 0.7}px))` }}
        />
      )}
    </div>
  ),
  glitch: ({ pupilX, pupilY, isBlinking }) => (
    <div className="font-mono text-[14px] flex items-center justify-center text-[color:var(--ink)] h-5 w-5">
      <span>[</span>
      <div className="w-2 h-2 bg-[color:var(--ink)] relative mx-0.5">
        {!isBlinking && (
          <div 
            className="w-1 h-1 bg-[color:var(--paper)] absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX * 1.5}px), calc(-50% + ${pupilY * 1.5}px))` }}
          />
        )}
      </div>
      <span>]</span>
    </div>
  ),
  lash: ({ pupilX, pupilY, isBlinking }) => (
    <div className="relative h-6 w-6 flex items-center justify-center">
      <div className="absolute -top-1 text-[10px] text-[color:var(--ink)] opacity-50 select-none">///</div>
      <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
        {!isBlinking && (
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
          />
        )}
      </div>
    </div>
  ),
  cyber: ({ pupilX, pupilY, isBlinking }) => (
    <div className="font-mono text-[12px] flex items-center justify-center text-[color:var(--ink)] h-5 w-5">
      <span>{"<"}</span>
      <div className="w-2 h-2 rounded-sm border border-[color:var(--ink)] relative mx-0.5">
        {!isBlinking && (
          <div 
            className="w-1 h-1 bg-[color:var(--ink)] absolute top-1/2 left-1/2"
            style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
          />
        )}
      </div>
      <span>{">"}</span>
    </div>
  ),
  feline: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1 h-3 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  hollow: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 relative flex items-center justify-center">
      {!isBlinking && (
        <div 
          className="w-2 h-2 bg-[color:var(--ink)] rounded-full"
          style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
        />
      )}
    </div>
  ),
  binary: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-6 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center gap-0.5">
      {!isBlinking && (
        <>
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)` }}
          />
          <div 
            className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX * 0.5}px, ${pupilY * 0.5}px)` }}
          />
        </>
      )}
    </div>
  ),
  recursive: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
       <div 
          className="w-2 h-2 border border-[color:var(--ink)] rounded-full relative overflow-hidden"
          style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
        >
           {!isBlinking && <div className="w-0.5 h-0.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
    </div>
  ),
  clockwork: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div 
      className="w-5 h-5 border border-[color:var(--ink)] border-dashed rounded-full bg-[color:var(--paper)] relative overflow-hidden"
      style={{ transform: `rotate(${idleOffset * 10}deg)` }}
    >
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  ascii: ({ isBlinking }) => (
    <div className="font-mono text-[12px] text-[color:var(--ink)] select-none">
      {isBlinking ? "( -_- )" : "( o_O )"}
    </div>
  ),
  pulse: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div 
      className="w-4 h-4 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden"
      style={{ transform: `scale(${1 + Math.sin(idleOffset * 2) * 0.1})` }}
    >
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  orbit: ({ pupilX, pupilY, isBlinking, idleOffset }) => (
    <div className="w-6 h-6 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
      {!isBlinking && (
        <>
          <div 
            className="w-2 h-2 bg-[color:var(--ink)] rounded-full"
            style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
          />
          <div 
            className="w-0.5 h-0.5 bg-[color:var(--ink)] rounded-full absolute"
            style={{ 
              transform: `rotate(${idleOffset * 20}deg) translate(8px) rotate(-${idleOffset * 20}deg)` 
            }}
          />
        </>
      )}
    </div>
  ),
  crosshair: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full bg-[color:var(--paper)] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 border-t border-[color:var(--ink)] top-1/2 -translate-y-1/2 opacity-30" />
      <div className="absolute inset-0 border-l border-[color:var(--ink)] left-1/2 -translate-x-1/2 opacity-30" />
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-[color:var(--ink)] absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  static: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-5 h-5 border border-[color:var(--ink)] rounded-full relative overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }} />
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
  shadow: ({ pupilX, pupilY, isBlinking }) => (
    <div className="w-4 h-4 border border-white/20 rounded-full bg-black relative overflow-hidden">
      {!isBlinking && (
        <div 
          className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))` }}
        />
      )}
    </div>
  ),
};
