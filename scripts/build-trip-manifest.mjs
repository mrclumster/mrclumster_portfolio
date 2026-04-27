// Walks public/images/trip/day-*/<folder>/ and writes a manifest of every
// photo and video, grouped by day + folder. Run before dev/build so the
// adventure photo viewer can show the full contents of each location's
// folder without us hand-listing every file.
//
// URLs in the manifest are prefixed with NEXT_PUBLIC_MEDIA_BASE so dev
// (no env var → "/images/trip") and prod (R2 public URL) stay aligned with
// the same prefix the runtime p() helper uses in trip-locations.ts.
//
// Safety: when the local trip folder is missing (e.g. on Vercel where the
// bytes live in R2 and aren't checked into git), the script EARLY-EXITS
// and leaves any pre-committed JSON untouched rather than overwriting it
// with an empty object.

import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const TRIP_ROOT = join(REPO_ROOT, "public", "images", "trip");
const OUT_FILE  = join(REPO_ROOT, "src", "game", "data", "trip-manifest.generated.json");

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? "/images/trip").replace(/\/+$/, "");

const PHOTO_RE = /\.(webp|jpe?g|png|gif|avif|svg)$/i;
const VIDEO_RE = /\.(mov|mp4|m4v|webm)$/i;

function listDirs(p) {
  if (!existsSync(p)) return [];
  return readdirSync(p).filter((name) => {
    try { return statSync(join(p, name)).isDirectory(); } catch { return false; }
  });
}

function listFiles(p) {
  if (!existsSync(p)) return [];
  return readdirSync(p).filter((name) => {
    try { return statSync(join(p, name)).isFile(); } catch { return false; }
  });
}

function hasAnyDayFolder() {
  return listDirs(TRIP_ROOT).some((name) => /^day-\d+$/i.test(name));
}

function build() {
  if (!existsSync(TRIP_ROOT) || !hasAnyDayFolder()) {
    if (existsSync(OUT_FILE)) {
      console.log(`[trip-manifest] ${relative(REPO_ROOT, TRIP_ROOT)} missing or empty — keeping committed manifest`);
    } else {
      console.warn(`[trip-manifest] ${relative(REPO_ROOT, TRIP_ROOT)} missing and no committed manifest exists — writing empty`);
      writeManifest({});
    }
    return;
  }

  /** @type {Record<string, Record<string, Array<{src:string,type:"photo"|"video"}>>>} */
  const manifest = {};

  for (const dayDir of listDirs(TRIP_ROOT)) {
    const m = /^day-(\d+)$/i.exec(dayDir);
    if (!m) continue;
    const dayKey = String(parseInt(m[1], 10));
    manifest[dayKey] = {};

    const dayPath = join(TRIP_ROOT, dayDir);
    for (const folder of listDirs(dayPath)) {
      const folderPath = join(dayPath, folder);
      const items = [];
      for (const file of listFiles(folderPath)) {
        const isVideo = VIDEO_RE.test(file);
        const isPhoto = PHOTO_RE.test(file);
        if (!isVideo && !isPhoto) continue;
        // Build the URL relative to the trip root (day-X/folder/file), then
        // prefix with MEDIA_BASE so local dev stays at /images/trip and prod
        // points at R2.
        const rel = relative(TRIP_ROOT, join(folderPath, file));
        const url = MEDIA_BASE + "/" + rel.split(/[\\/]/).map(encodeURIComponent).join("/");
        items.push({ src: url, type: isVideo ? "video" : "photo" });
      }
      // Stable sort so order is deterministic
      items.sort((a, b) => a.src.localeCompare(b.src));
      manifest[dayKey][folder] = items;
    }
  }

  writeManifest(manifest);
}

function writeManifest(manifest) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  const totalFolders = Object.values(manifest).reduce((n, day) => n + Object.keys(day).length, 0);
  const totalItems   = Object.values(manifest).reduce(
    (n, day) => n + Object.values(day).reduce((m, files) => m + files.length, 0),
    0
  );
  console.log(`[trip-manifest] wrote ${totalItems} items across ${totalFolders} folders → ${relative(REPO_ROOT, OUT_FILE)} (base: ${MEDIA_BASE})`);
}

build();
