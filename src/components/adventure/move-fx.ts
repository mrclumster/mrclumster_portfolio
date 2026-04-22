// Maps move names / types to Pokémon Showdown effect image URLs so the battle
// scene can overlay authentic-looking attack animations. If a URL 404s the
// <img onError> handler in battle-scene.tsx falls back to our own SVG VFX, so
// the worst case is: the attack still plays, just with the generic burst.

export type FxMode = "projectile" | "impact" | "beam";

export interface MoveFx {
  url: string;
  mode: FxMode;
  tint: string;        // attacker windup flash color
  spin?: boolean;      // projectile spins during travel
}

const FX_BASE = "https://play.pokemonshowdown.com/fx";

// Known Showdown fx assets we can rely on. Each entry was chosen so the
// overlay art roughly matches the move in both feel and Pokémon canon.
const MOVE_OVERRIDES: Record<string, MoveFx> = {
  // Electric
  "thunderbolt":    { url: `${FX_BASE}/electroball.png`, mode: "projectile", tint: "#ffee44", spin: true },
  "thunder-shock":  { url: `${FX_BASE}/electroball.png`, mode: "impact",     tint: "#ffee44" },
  "thunder":        { url: `${FX_BASE}/electroball.png`, mode: "beam",       tint: "#ffee44" },
  "thunder-wave":   { url: `${FX_BASE}/electroball.png`, mode: "impact",     tint: "#ffee44" },
  "zap-cannon":     { url: `${FX_BASE}/electroball.png`, mode: "projectile", tint: "#ffee44", spin: true },

  // Fire
  "flamethrower":   { url: `${FX_BASE}/fireball.png`,    mode: "beam",       tint: "#ff8030" },
  "fire-blast":     { url: `${FX_BASE}/fireball.png`,    mode: "projectile", tint: "#ff4010", spin: true },
  "ember":          { url: `${FX_BASE}/fireball.png`,    mode: "projectile", tint: "#ff8030" },
  "heat-wave":      { url: `${FX_BASE}/fireball.png`,    mode: "impact",     tint: "#ff8030" },
  "fire-punch":     { url: `${FX_BASE}/fireball.png`,    mode: "impact",     tint: "#ff8030" },

  // Water
  "hydro-pump":     { url: `${FX_BASE}/waterpledge.png`, mode: "beam",       tint: "#60a0ff" },
  "water-gun":      { url: `${FX_BASE}/waterpledge.png`, mode: "projectile", tint: "#60a0ff" },
  "surf":           { url: `${FX_BASE}/waterpledge.png`, mode: "beam",       tint: "#60a0ff" },
  "bubble":         { url: `${FX_BASE}/waterpledge.png`, mode: "projectile", tint: "#90d0ff" },
  "bubble-beam":    { url: `${FX_BASE}/waterpledge.png`, mode: "beam",       tint: "#90d0ff" },
  "aqua-tail":      { url: `${FX_BASE}/waterpledge.png`, mode: "impact",     tint: "#60a0ff" },

  // Grass
  "solar-beam":     { url: `${FX_BASE}/energyball.png`,  mode: "beam",       tint: "#d0e070" },
  "razor-leaf":     { url: `${FX_BASE}/energyball.png`,  mode: "projectile", tint: "#70c040", spin: true },
  "vine-whip":      { url: `${FX_BASE}/energyball.png`,  mode: "impact",     tint: "#70c040" },
  "energy-ball":    { url: `${FX_BASE}/energyball.png`,  mode: "projectile", tint: "#70c040", spin: true },
  "leaf-storm":     { url: `${FX_BASE}/energyball.png`,  mode: "beam",       tint: "#70c040" },

  // Ghost / Dark
  "shadow-ball":    { url: `${FX_BASE}/shadowball.png`,  mode: "projectile", tint: "#a040c0", spin: true },
  "shadow-punch":   { url: `${FX_BASE}/shadowball.png`,  mode: "impact",     tint: "#a040c0" },
  "shadow-claw":    { url: `${FX_BASE}/shadowball.png`,  mode: "impact",     tint: "#a040c0" },
  "night-shade":    { url: `${FX_BASE}/shadowball.png`,  mode: "beam",       tint: "#a040c0" },
  "dark-pulse":     { url: `${FX_BASE}/shadowball.png`,  mode: "beam",       tint: "#703090" },
  "lick":           { url: `${FX_BASE}/shadowball.png`,  mode: "impact",     tint: "#d060a0" },
  "hypnosis":       { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#a040c0" },

  // Psychic
  "psychic":        { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff4080" },
  "psybeam":        { url: `${FX_BASE}/mistball.png`,    mode: "beam",       tint: "#ff4080" },
  "confusion":      { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff4080" },
  "dream-eater":    { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff4080" },
  "zen-headbutt":   { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff80a0" },

  // Ice
  "ice-beam":       { url: `${FX_BASE}/iceball.png`,     mode: "beam",       tint: "#90dcff" },
  "blizzard":       { url: `${FX_BASE}/iceball.png`,     mode: "beam",       tint: "#90dcff" },
  "ice-punch":      { url: `${FX_BASE}/iceball.png`,     mode: "impact",     tint: "#90dcff" },
  "icy-wind":       { url: `${FX_BASE}/iceball.png`,     mode: "impact",     tint: "#b0e8ff" },

  // Rock / Ground
  "rock-slide":     { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#8a6040" },
  "rock-throw":     { url: `${FX_BASE}/rocks.png`,       mode: "projectile", tint: "#8a6040", spin: true },
  "stone-edge":     { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#8a6040" },
  "earthquake":     { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#c0a070" },
  "dig":            { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#8a6040" },
  "mud-slap":       { url: `${FX_BASE}/mudball.png`,     mode: "projectile", tint: "#a07040" },

  // Poison
  "sludge-bomb":    { url: `${FX_BASE}/poisonwisp.png`,  mode: "projectile", tint: "#b040d0", spin: true },
  "poison-jab":     { url: `${FX_BASE}/poisonwisp.png`,  mode: "impact",     tint: "#b040d0" },
  "toxic":          { url: `${FX_BASE}/poisonwisp.png`,  mode: "impact",     tint: "#b040d0" },
  "sludge":         { url: `${FX_BASE}/poisonwisp.png`,  mode: "projectile", tint: "#b040d0" },
  "acid":           { url: `${FX_BASE}/poisonwisp.png`,  mode: "impact",     tint: "#b040d0" },

  // Flying
  "air-slash":      { url: `${FX_BASE}/wisp.png`,        mode: "projectile", tint: "#a0d0ff" },
  "gust":           { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#a0d0ff" },
  "aerial-ace":     { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "wing-attack":    { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#a0d0ff" },
  "sky-attack":     { url: `${FX_BASE}/wisp.png`,        mode: "beam",       tint: "#ffe080" },

  // Normal / Fighting / misc — use impact bursts
  "hyper-beam":     { url: `${FX_BASE}/mistball.png`,    mode: "beam",       tint: "#ffffff" },
  "tackle":         { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "body-slam":      { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "headbutt":       { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "slash":          { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "mega-punch":     { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffdd80" },
  "mega-kick":      { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffdd80" },
  "hyper-fang":     { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "quick-attack":   { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  "double-edge":    { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffdd80" },
};

// One safe default per type, used when the specific move name isn't in the
// override table above.
const TYPE_DEFAULTS: Record<string, MoveFx> = {
  fire:     { url: `${FX_BASE}/fireball.png`,    mode: "projectile", tint: "#ff8030", spin: true },
  water:    { url: `${FX_BASE}/waterpledge.png`, mode: "projectile", tint: "#60a0ff" },
  electric: { url: `${FX_BASE}/electroball.png`, mode: "projectile", tint: "#ffee44", spin: true },
  grass:    { url: `${FX_BASE}/energyball.png`,  mode: "projectile", tint: "#70c040", spin: true },
  ice:      { url: `${FX_BASE}/iceball.png`,     mode: "beam",       tint: "#90dcff" },
  ghost:    { url: `${FX_BASE}/shadowball.png`,  mode: "projectile", tint: "#a040c0", spin: true },
  dark:     { url: `${FX_BASE}/shadowball.png`,  mode: "projectile", tint: "#703090", spin: true },
  psychic:  { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff4080" },
  rock:     { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#8a6040" },
  ground:   { url: `${FX_BASE}/mudball.png`,     mode: "impact",     tint: "#a07040" },
  poison:   { url: `${FX_BASE}/poisonwisp.png`,  mode: "impact",     tint: "#b040d0" },
  flying:   { url: `${FX_BASE}/wisp.png`,        mode: "projectile", tint: "#a0d0ff" },
  fighting: { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffdd80" },
  normal:   { url: `${FX_BASE}/wisp.png`,        mode: "impact",     tint: "#ffffff" },
  bug:      { url: `${FX_BASE}/energyball.png`,  mode: "projectile", tint: "#a0c040" },
  steel:    { url: `${FX_BASE}/rocks.png`,       mode: "impact",     tint: "#b0b0c0" },
  dragon:   { url: `${FX_BASE}/mistball.png`,    mode: "beam",       tint: "#8060ff" },
  fairy:    { url: `${FX_BASE}/mistball.png`,    mode: "impact",     tint: "#ff90d0" },
};

export function getMoveFx(moveName: string, type: string): MoveFx {
  const slug = moveName.trim().toLowerCase().replace(/\s+/g, "-");
  return (
    MOVE_OVERRIDES[slug] ||
    TYPE_DEFAULTS[type.toLowerCase()] ||
    TYPE_DEFAULTS["normal"]
  );
}

// All FX urls — used by battle-scene to preload images on mount so the first
// hit of each type doesn't show a 1-frame pop-in.
export function allFxUrls(): string[] {
  const urls = new Set<string>();
  for (const m of Object.values(MOVE_OVERRIDES)) urls.add(m.url);
  for (const t of Object.values(TYPE_DEFAULTS))  urls.add(t.url);
  return [...urls];
}
