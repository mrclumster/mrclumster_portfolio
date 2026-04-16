"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export type AdventureTriggerState = "idle" | "triggered" | "animating" | "navigating";

/**
 * State machine for the puzzle-break → adventure transition.
 *
 * idle → triggered  : snapshot bento cards, mount overlay
 * triggered → animating : overlay mounted, CSS animations running
 * animating → navigating : router.push('/adventure') after stagger + flash window
 */
export function useAdventureTrigger() {
  const router = useRouter();
  const [state, setState] = useState<AdventureTriggerState>("idle");
  const navigatingRef = useRef(false);

  const trigger = useCallback(() => {
    if (state !== "idle") return;

    // Set flag for adventure page to show arrival flash
    sessionStorage.setItem("adventure-origin", "portfolio");

    setState("triggered");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Skip animation, navigate immediately
      setState("navigating");
      router.push("/adventure");
      return;
    }

    // Allow one frame for overlay to mount, then mark as animating
    requestAnimationFrame(() => {
      setState("animating");

      // Navigate after physics settle (~2.2s) + flash duration (500ms) + small buffer
      if (!navigatingRef.current) {
        navigatingRef.current = true;
        setTimeout(() => {
          setState("navigating");
          router.push("/adventure");
        }, 2800);
      }
    });
  }, [state, router]);

  const reset = useCallback(() => {
    setState("idle");
    navigatingRef.current = false;
  }, []);

  return { state, trigger, reset };
}
