// ──────────────────────────────────────────────────────────────────────────
// Six Pokémon roster — fan-art SVG sprites, canonical move names.
// ──────────────────────────────────────────────────────────────────────────

import type { ReactElement } from "react";
import {
  PikachuSprite, CharizardSprite, BulbasaurSprite,
  PsyduckSprite, GengarSprite, SnorlaxSprite, SquirtleSprite,
  type SpriteOpts,
} from "./creature-sprites";

export type CreatureType =
  | "normal" | "fire" | "water" | "electric" | "grass"
  | "ice" | "flying" | "rock" | "ghost" | "psychic" | "fairy" | "poison";

export interface Move {
  name: string;
  type: CreatureType;
  power: number;
  flavor: string;
}

export interface Creature {
  id: string;
  name: string;
  dexId: number;        // National Dex number — used for PokéAPI fetching
  level: number;
  maxHp: number;
  types: CreatureType[];
  description: string;
  moves: Move[];
  renderSprite: (size: number, opts?: SpriteOpts) => ReactElement;
  defaultDay: number | null;
}

export const CREATURES: Creature[] = [
  {
    id: "pikachu",
    dexId: 25,
    name: "PIKACHU",
    level: 99,
    maxHp: 220,
    types: ["electric"],
    description: "Cheeks store static. Sparks on greeting.",
    moves: [
      { name: "THUNDERBOLT",  type: "electric", power: 32, flavor: "A sharp bolt cracks out!" },
      { name: "QUICK ATTACK", type: "normal",   power: 20, flavor: "Too fast to dodge!" },
      { name: "IRON TAIL",    type: "rock",     power: 28, flavor: "Tail hardens to steel!" },
      { name: "THUNDER WAVE", type: "electric", power: 14, flavor: "A paralysing pulse." },
    ],
    renderSprite: PikachuSprite,
    defaultDay: 1,
  },
  {
    id: "charizard",
    dexId: 6,
    name: "CHARIZARD",
    level: 99,
    maxHp: 260,
    types: ["fire", "flying"],
    description: "Tail flame marks its life force. Breathes inferno.",
    moves: [
      { name: "FLAMETHROWER", type: "fire",   power: 40, flavor: "A torrent of orange flame!" },
      { name: "WING ATTACK",  type: "flying", power: 24, flavor: "Heavy wing beat!" },
      { name: "DRAGON CLAW",  type: "fire",   power: 32, flavor: "Claws glow red-hot!" },
      { name: "SLASH",        type: "normal", power: 22, flavor: "A sharp clean cut!" },
    ],
    renderSprite: CharizardSprite,
    defaultDay: 5,
  },
  {
    id: "bulbasaur",
    dexId: 1,
    name: "BULBASAUR",
    level: 99,
    maxHp: 260,
    types: ["grass", "poison"],
    description: "A seed on its back grows with sun.",
    moves: [
      { name: "VINE WHIP",    type: "grass",  power: 24, flavor: "Snaps like a whip!" },
      { name: "RAZOR LEAF",   type: "grass",  power: 28, flavor: "Sharpened leaves fly!" },
      { name: "TACKLE",       type: "normal", power: 18, flavor: "A full-body charge!" },
      { name: "SLEEP POWDER", type: "grass",  power: 10, flavor: "Drowsy spores drift out." },
    ],
    renderSprite: BulbasaurSprite,
    defaultDay: 4,
  },
  {
    id: "psyduck",
    dexId: 54,
    name: "PSYDUCK",
    level: 99,
    maxHp: 260,
    types: ["water"],
    description: "A constant headache fuels its psychic fits.",
    moves: [
      { name: "WATER GUN",  type: "water",   power: 22, flavor: "A cold jet of water!" },
      { name: "CONFUSION",  type: "psychic", power: 28, flavor: "Reality wobbles briefly!" },
      { name: "SCRATCH",    type: "normal",  power: 16, flavor: "Shallow but stinging." },
      { name: "DISABLE",    type: "normal",  power: 10, flavor: "Shuts down a move." },
    ],
    renderSprite: PsyduckSprite,
    defaultDay: 2,
  },
  {
    id: "gengar",
    dexId: 94,
    name: "GENGAR",
    level: 99,
    maxHp: 220,
    types: ["ghost", "poison"],
    description: "Hides in shadow. Steals warmth from rooms.",
    moves: [
      { name: "SHADOW BALL", type: "ghost",   power: 36, flavor: "A dark sphere swells!" },
      { name: "LICK",        type: "ghost",   power: 16, flavor: "Ghostly tongue strikes!" },
      { name: "HYPNOSIS",    type: "psychic", power: 10, flavor: "Eyelids feel heavy…" },
      { name: "NIGHT SHADE", type: "ghost",   power: 28, flavor: "Negative-space damage!" },
    ],
    renderSprite: GengarSprite,
    defaultDay: 3,
  },
  {
    id: "squirtle",
    dexId: 7,
    name: "SQUIRTLE",
    level: 99,
    maxHp: 260,
    types: ["water"],
    description: "A water starter. Retreats into its shell when scared.",
    moves: [
      { name: "WATER GUN",   type: "water",  power: 24, flavor: "A sharp jet of water!" },
      { name: "TACKLE",      type: "normal", power: 18, flavor: "A full-body charge!" },
      { name: "BUBBLE",      type: "water",  power: 16, flavor: "A stream of bubbles!" },
      { name: "WITHDRAW",    type: "water",  power: 0,  flavor: "Tucks into shell to brace." },
    ],
    renderSprite: SquirtleSprite,
    defaultDay: null,
  },
  {
    id: "snorlax",
    dexId: 143,
    name: "SNORLAX",
    level: 99,
    maxHp: 320,
    types: ["normal"],
    description: "Sleeps 20 hours a day. Eats almost everything.",
    moves: [
      { name: "BODY SLAM", type: "normal",  power: 38, flavor: "Immovable bulk!" },
      { name: "REST",      type: "psychic", power: 0,  flavor: "Starts snoring loudly…" },
      { name: "CRUNCH",    type: "normal",  power: 30, flavor: "Powerful jaws clamp!" },
      { name: "YAWN",      type: "normal",  power: 10, flavor: "A contagious yawn." },
    ],
    renderSprite: SnorlaxSprite,
    defaultDay: 6,
  },
];

export const getCreature = (id: string) => CREATURES.find((c) => c.id === id)!;

// Given the user's picked starter, assign wild opponents to each day.
// If the starter's default day slot is empty, the first remaining creature fills it.
export function assignDayBosses(starterId: string): Record<number, string> {
  const pool = CREATURES.filter((c) => c.id !== starterId);
  const map: Record<number, string> = {};
  const used = new Set<string>();

  // First pass: assign each creature to its default day
  for (const c of pool) {
    if (c.defaultDay && !map[c.defaultDay]) {
      map[c.defaultDay] = c.id;
      used.add(c.id);
    }
  }
  // Second pass: any empty day gets the first unused creature (prefers null-default "plug")
  for (let d = 1; d <= 6; d++) {
    if (!map[d]) {
      const substitute =
        pool.find((c) => !used.has(c.id) && c.defaultDay === null) ??
        pool.find((c) => !used.has(c.id));
      if (substitute) {
        map[d] = substitute.id;
        used.add(substitute.id);
      }
    }
  }
  return map;
}

// Type effectiveness — simplified
const EFFECTIVE: Record<string, string[]> = {
  electric: ["flying", "water"],
  water:    ["fire", "rock"],
  flying:   ["grass"],
  grass:    ["rock", "water"],
  fire:     ["grass", "ice"],
  ice:      ["grass", "flying"],
  rock:     ["flying", "fire"],
  ghost:    ["ghost", "psychic"],
  psychic:  ["poison"],
  poison:   ["grass", "fairy"],
  fairy:    ["ghost"],
};
const RESISTED: Record<string, string[]> = {
  electric: ["electric", "grass"],
  water:    ["water", "grass"],
  grass:    ["grass", "fire", "flying", "poison"],
  fire:     ["fire", "rock"],
  rock:     ["normal"],
  normal:   ["rock", "ghost"],
  ghost:    ["normal"],
  psychic:  ["psychic"],
  poison:   ["poison", "ghost"],
};

export function effectiveness(moveType: CreatureType, defenderTypes: CreatureType[]): {
  multiplier: number;
  message: string;
} {
  let mult = 1;
  for (const t of defenderTypes) {
    if (EFFECTIVE[moveType]?.includes(t)) mult *= 2;
    else if (RESISTED[moveType]?.includes(t)) mult *= 0.5;
    if (moveType === "normal" && t === "ghost") mult *= 0;
  }
  const message =
    mult === 0 ? "It had no effect…" :
    mult > 1  ? "It's super effective!" :
    mult < 1  ? "It's not very effective…" :
    "";
  return { multiplier: mult, message };
}

export function computeDamage(
  attacker: Creature,
  defender: Creature,
  move: Move,
): { damage: number; effectiveness: string } {
  if (move.power === 0) return { damage: 0, effectiveness: "" };
  const { multiplier, message } = effectiveness(move.type, defender.types);
  // Flat, level-independent scaling. All creatures are L99 so level is purely
  // cosmetic — balance lives entirely in move power, STAB, and type matchup.
  // Tuned so a full battle takes 4-8 turns: ~40 dmg per neutral hit vs 220-320 HP.
  const stab = attacker.types.includes(move.type) ? 1.3 : 1;
  const base = move.power * 1.4;
  const roll = 0.85 + Math.random() * 0.15;
  const damage = Math.max(1, Math.floor(base * multiplier * stab * roll));
  return { damage: multiplier === 0 ? 0 : damage, effectiveness: message };
}
