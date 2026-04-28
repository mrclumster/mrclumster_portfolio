"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ADVENTURE_TRANSITION_DURATION } from "@/components/shared/adventure-transition";

export type AdventureTriggerState = "idle" | "triggered" | "animating" | "navigating";

/**
 * State machine for the adventure transition.
 *
 * idle → triggered  : transition mounts
 * triggered → animating : animation timeline begins
 * animating → navigating : router.push('/adventure') fires once timeline ends
 *
 * Total animation duration is controlled by the transition component itself
 * (see ADVENTURE_TRANSITION_DURATION). We schedule navigation 100ms before the
 * end so the destination is mounted by the time the whiteout finishes fading.
 */
export function useAdventureTrigger() {
  const router = useRouter();
  const [state, setState] = useState<AdventureTriggerState>("idle");
  const navigatingRef = useRef(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerNav = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setState("navigating");
    router.push("/adventure");
  }, [router]);

  const trigger = useCallback(() => {
    if (state !== "idle") return;

    sessionStorage.setItem("adventure-origin", "portfolio");
    setState("triggered");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      triggerNav();
      return;
    }

    requestAnimationFrame(() => {
      setState("animating");
      // Schedule nav for just before the whiteout completes
      const navDelay = Math.max(200, ADVENTURE_TRANSITION_DURATION - 100);
      navTimerRef.current = setTimeout(triggerNav, navDelay);
    });
  }, [state, triggerNav]);

  /** ESC handler — fast-forwards the navigation. The overlay still fades out. */
  const skip = useCallback(() => {
    if (state !== "animating") return;
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
    triggerNav();
  }, [state, triggerNav]);

  const reset = useCallback(() => {
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
    setState("idle");
    navigatingRef.current = false;
  }, []);

  return { state, trigger, skip, reset };
}
