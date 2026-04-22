"use client";

import { useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────────────────
// PokéAPI client — fetches live Pokémon data and caches it in memory +
// localStorage (24h TTL). Exposes a simple React hook.
// ──────────────────────────────────────────────────────────────────────────

const POKEMON_URL  = (id: number) => `https://pokeapi.co/api/v2/pokemon/${id}`;
const SPECIES_URL  = (id: number) => `https://pokeapi.co/api/v2/pokemon-species/${id}`;
const CACHE_KEY    = (id: number) => `poke-cache-${id}`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// Keep the subset of PokéAPI data we actually use
export interface CreatureData {
  id: number;
  name: string;
  types: string[];
  maxHp: number;        // derived from base stats.hp
  level: number;        // we don't fetch this, keep a reasonable default per creature
  cryUrl: string | null;
  moves: Array<{ name: string; type: string; power: number; flavor: string }>;
  description: string;
}

// Preferred move selection per dex id — 4 signature damage moves per creature
// Names must match PokéAPI (lowercase, hyphens). Power is looked up per move.
const PREFERRED_MOVES: Record<number, string[]> = {
  1:   ["vine-whip", "razor-leaf", "tackle", "sleep-powder"],       // Bulbasaur
  6:   ["flamethrower", "wing-attack", "dragon-claw", "slash"],     // Charizard
  7:   ["water-gun", "tackle", "bubble", "withdraw"],               // Squirtle
  25:  ["thunderbolt", "quick-attack", "iron-tail", "thunder-wave"],// Pikachu
  54:  ["water-gun", "confusion", "scratch", "disable"],            // Psyduck
  94:  ["shadow-ball", "lick", "hypnosis", "night-shade"],          // Gengar
  143: ["body-slam", "rest", "crunch", "yawn"],                     // Snorlax
};

// Hardcoded "level" per creature (what shows on HP bars) — matches the original feel
const LEVELS: Record<number, number> = {
  1: 12, 6: 22, 7: 10, 25: 10, 54: 14, 94: 25, 143: 28,
};

// In-memory cache
const memCache = new Map<number, CreatureData>();
const inflight = new Map<number, Promise<CreatureData>>();

function readLocalCache(id: number): CreatureData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; data: CreatureData };
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch { return null; }
}
function writeLocalCache(id: number, data: CreatureData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY(id), JSON.stringify({ at: Date.now(), data }));
  } catch { /* quota or disabled — ignore */ }
}

async function fetchMovePower(moveName: string): Promise<{ power: number; type: string; flavor: string }> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    if (!res.ok) throw new Error("move fetch failed");
    const json = await res.json();
    const flavor =
      (json.flavor_text_entries ?? []).find((e: { language: { name: string } }) => e.language.name === "en")
        ?.flavor_text ?? "";
    return {
      power: typeof json.power === "number" ? json.power : 0,
      type: json.type?.name ?? "normal",
      flavor: flavor.replace(/\n/g, " ").trim(),
    };
  } catch {
    return { power: 0, type: "normal", flavor: "" };
  }
}

export async function fetchCreatureData(dexId: number): Promise<CreatureData> {
  if (memCache.has(dexId)) return memCache.get(dexId)!;
  const cached = readLocalCache(dexId);
  if (cached) {
    memCache.set(dexId, cached);
    return cached;
  }
  if (inflight.has(dexId)) return inflight.get(dexId)!;

  const p = (async () => {
    const [pokeRes, speciesRes] = await Promise.all([
      fetch(POKEMON_URL(dexId)),
      fetch(SPECIES_URL(dexId)),
    ]);
    if (!pokeRes.ok || !speciesRes.ok) throw new Error("pokeapi fetch failed");
    const poke = await pokeRes.json();
    const species = await speciesRes.json();

    const hpStat =
      poke.stats.find((s: { stat: { name: string } }) => s.stat.name === "hp")?.base_stat ?? 40;
    const types: string[] = poke.types.map((t: { type: { name: string } }) => t.type.name);
    const cryUrl: string | null = poke.cries?.latest ?? null;

    const moveNames = PREFERRED_MOVES[dexId] ?? [];
    const moves = await Promise.all(
      moveNames.map(async (mn) => {
        const m = await fetchMovePower(mn);
        return {
          name: mn.toUpperCase().replace(/-/g, " "),
          type: m.type,
          power: m.power || 20,
          flavor: m.flavor || "A solid hit!",
        };
      })
    );

    const description: string =
      (species.flavor_text_entries ?? [])
        .find((e: { language: { name: string } }) => e.language.name === "en")
        ?.flavor_text?.replace(/[\n\f]/g, " ")
        .replace(/\s+/g, " ")
        .trim() ?? "";

    const data: CreatureData = {
      id: dexId,
      name: poke.name.toUpperCase(),
      types,
      maxHp: hpStat * 2,          // scale base stat to feel like Pokémon HP
      level: LEVELS[dexId] ?? 15,
      cryUrl,
      moves,
      description,
    };

    memCache.set(dexId, data);
    writeLocalCache(dexId, data);
    return data;
  })();

  inflight.set(dexId, p);
  try {
    return await p;
  } finally {
    inflight.delete(dexId);
  }
}

// React hook — returns { loading, data, error }. Falls back to null on failure.
export function useCreatureData(dexId: number) {
  const [data, setData]   = useState<CreatureData | null>(() => memCache.get(dexId) ?? readLocalCache(dexId));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memCache.has(dexId)) {
      setData(memCache.get(dexId)!);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetchCreatureData(dexId)
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch((e) => { if (alive) { setError(String(e)); setLoading(false); } });
    return () => { alive = false; };
  }, [dexId]);

  return { loading, data, error };
}

// Pre-warm the cache for all 7 creatures on boot (fire-and-forget)
export function prewarmCreatureCache(dexIds: number[]) {
  for (const id of dexIds) {
    fetchCreatureData(id).catch(() => { /* swallow — SVG/local fallbacks still work */ });
  }
}
