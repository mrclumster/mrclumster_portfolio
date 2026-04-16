"use client";

import { QRCodeSVG } from "qrcode.react";
import { personalInfo } from "@/data/personal";

const vcard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `FN:${personalInfo.name}`,
  `EMAIL:${personalInfo.email}`,
  `URL:${personalInfo.socialLinks.github}`,
  `NOTE:Full-Stack Developer & ML Enthusiast`,
  "END:VCARD",
].join("\n");

export function VCardQR() {
  return (
    <div className="group flex flex-col items-center gap-1.5">
      <div className="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-foreground/10 transition-transform duration-200 group-hover:scale-105">
        <QRCodeSVG
          value={vcard}
          size={64}
          bgColor="#ffffff"
          fgColor="#4f46e5"
          level="M"
        />
      </div>
      <p className="text-[10px] text-muted-foreground">Scan to save contact</p>
    </div>
  );
}
