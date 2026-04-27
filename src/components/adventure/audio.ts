"use client";

import { Howl, Howler } from "howler";

// ──────────────────────────────────────────────────────────────────────────
// AudioManager — crossfades BGM between screens and plays one-shot SFX.
//
// Drop tracks into /public/audio/:
//   menu.mp3      (title / day select / starter select / arena)
//   overworld.mp3 (walking around)
//   battle.mp3    (battle scene)
//
// If a file is missing, it simply won't play — the rest of the game
// works silently.
// ──────────────────────────────────────────────────────────────────────────

export type BgmKey = "menu" | "overworld" | "battle";

interface Track {
  howl: Howl | null;
  loaded: boolean;
  errored: boolean;
}

class AudioManager {
  private bgmTracks = new Map<BgmKey, Track>();
  private currentBgm: BgmKey | null = null;
  private muted = true; // start muted; UI toggles it on user gesture
  private volume = 0.35;

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.muted) return;
    // Crossfade all playing tracks to the new target volume
    for (const [key, t] of this.bgmTracks) {
      if (!t.howl) continue;
      if (key === this.currentBgm) {
        t.howl.fade(t.howl.volume(), this.volume, 200);
      }
    }
  }
  getVolume() { return this.volume; }

  private ensureTrack(key: BgmKey): Track {
    const existing = this.bgmTracks.get(key);
    if (existing) return existing;
    const track: Track = { howl: null, loaded: false, errored: false };
    try {
      track.howl = new Howl({
        src: [`/audio/${key}.mp3`],
        loop: true,
        volume: 0,
        // Let Howler pick Web Audio; html5 mode had autoplay restrictions
        onload: () => { track.loaded = true; },
        onloaderror: () => { track.errored = true; },
      });
    } catch {
      track.errored = true;
    }
    this.bgmTracks.set(key, track);
    return track;
  }

  playBgm(key: BgmKey) {
    if (this.currentBgm === key) return;
    const prev = this.currentBgm;
    this.currentBgm = key;

    const track = this.ensureTrack(key);
    if (!track.howl || track.errored) return;

    if (!this.muted) {
      // If the track was paused earlier, play() resumes from its position.
      // If it was never started, play() starts from the beginning. Either way works.
      if (!track.howl.playing()) {
        track.howl.volume(0);
        track.howl.play();
      }
      track.howl.fade(track.howl.volume(), this.volume, 600);
    }

    if (prev) {
      const prevTrack = this.bgmTracks.get(prev);
      if (prevTrack?.howl) {
        prevTrack.howl.fade(prevTrack.howl.volume(), 0, 600);
        // PAUSE rather than stop — preserves playback state so rapid
        // back-and-forth navigation doesn't leave audio stuck.
        setTimeout(() => prevTrack.howl?.pause(), 650);
      }
    }
  }

  stopBgm() {
    if (!this.currentBgm) return;
    const track = this.bgmTracks.get(this.currentBgm);
    if (track?.howl) {
      track.howl.fade(track.howl.volume(), 0, 400);
      setTimeout(() => track.howl?.pause(), 450);
    }
    this.currentBgm = null;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      // Fade all active tracks to 0 but keep their playback state
      for (const [, t] of this.bgmTracks) {
        if (!t.howl) continue;
        t.howl.fade(t.howl.volume(), 0, 200);
      }
    } else if (this.currentBgm) {
      // Unmuting — wake the AudioContext if a previous user gesture left it
      // suspended, then resume the current track and fade in.
      try {
        const ctx = (Howler as { ctx?: AudioContext }).ctx;
        if (ctx && ctx.state === "suspended") ctx.resume();
      } catch { /* ignore — html5 mode has no ctx */ }

      const t = this.bgmTracks.get(this.currentBgm);
      if (t?.howl) {
        if (!t.howl.playing()) {
          t.howl.volume(0);
          // Howler returns a sound id, but its underlying Web Audio play()
          // can throw NotAllowedError if the gesture lock is still active.
          // Swallow it — the next click will succeed.
          try { t.howl.play(); } catch { /* ignore */ }
        }
        t.howl.fade(t.howl.volume(), this.volume, 400);
      }
    }
  }

  playSfx(url: string, volume = 0.4) {
    if (this.muted) return;
    try {
      // Use Web Audio (default) — matches BGM backend so mobile doesn't stutter
      // when switching between html5 and Web Audio contexts.
      const h = new Howl({ src: [url], volume });
      h.play();
    } catch { /* ignore */ }
  }
}

export const audio = new AudioManager();
