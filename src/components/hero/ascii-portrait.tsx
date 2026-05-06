"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const RAMP = " .:-=+*#%@";
const COLS = 60;
const ROWS = 75;

interface Props {
  imageSrc: string;
}

export function AsciiPortrait({ imageSrc }: Props) {
  const [ascii, setAscii] = useState("");
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = ROWS;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, COLS, ROWS);
      const data = ctx.getImageData(0, 0, COLS, ROWS).data;
      let out = "";
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = (y * COLS + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const idx = Math.floor(lum * (RAMP.length - 1));
          out += RAMP[idx];
        }
        out += "\n";
      }
      setAscii(out);
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top transition-opacity duration-500"
        style={{ opacity: hovering ? 1 : 0 }}
        priority
      />
      <pre
        aria-hidden
        className="absolute inset-0 w-full h-full overflow-hidden m-0 p-0 leading-[1] transition-opacity duration-500 select-none pointer-events-none flex items-center justify-center"
        style={{
          color: "var(--ink)",
          fontFamily: '"Courier New", ui-monospace, monospace',
          fontSize: "5px",
          letterSpacing: 0,
          opacity: hovering ? 0 : 0.95,
          fontWeight: 700,
          whiteSpace: "pre",
          textAlign: "center",
        }}
      >
        {ascii}
      </pre>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)",
        }}
      />
    </div>
  );
}
