"use client";

import Lottie from "lottie-react";
import burstData from "./burst.json";

export function LottieBurst({ className }: { className?: string }) {
  return (
    <Lottie
      animationData={burstData}
      loop={false}
      autoplay
      className={className}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
