// Uploads public/images/trip/ to a Cloudflare R2 bucket using R2's
// S3-compatible API. Skips files that already exist (HEAD check) so
// re-running after dropping a few new photos only pushes the deltas.
//
// Setup (one time):
//   npm install --save-dev @aws-sdk/client-s3
//
// Required env vars (put in .env.local):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET
//
// Run:
//   node --env-file=.env.local scripts/upload-to-r2.mjs
//   (or: npm run trip:upload)

import { readdirSync, statSync, createReadStream, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const TRIP_ROOT = join(REPO_ROOT, "public", "images", "trip");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error(
    "[upload-to-r2] Missing env vars. Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.\n" +
    "Tip: run with `node --env-file=.env.local scripts/upload-to-r2.mjs` or via `npm run trip:upload`."
  );
  process.exit(1);
}

if (!existsSync(TRIP_ROOT)) {
  console.error(`[upload-to-r2] ${TRIP_ROOT} not found.`);
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".gif":  "image/gif",
  ".avif": "image/avif",
  ".svg":  "image/svg+xml",
  ".mp4":  "video/mp4",
  ".m4v":  "video/mp4",
  ".mov":  "video/quicktime",
  ".webm": "video/webm",
};

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (st.isFile()) yield full;
  }
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") return false;
    throw err;
  }
}

async function upload(localPath, key) {
  const ext = extname(localPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: createReadStream(localPath),
    ContentType: contentType,
    ContentLength: statSync(localPath).size,
  }));
}

async function main() {
  const files = [...walk(TRIP_ROOT)];
  console.log(`[upload-to-r2] Found ${files.length} files. Checking which need upload…`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const local = files[i];
    // Key is "day-1/airport/foo.webp" — relative to TRIP_ROOT, forward slashes
    const key = relative(TRIP_ROOT, local).split(/[\\/]/).join("/");

    try {
      if (await exists(key)) {
        skipped++;
        continue;
      }
      await upload(local, key);
      uploaded++;
      const sizeMB = (statSync(local).size / 1024 / 1024).toFixed(2);
      console.log(`  ↑ [${uploaded}] ${key} (${sizeMB} MB)`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${key}: ${err.message ?? err}`);
    }

    if ((i + 1) % 25 === 0) {
      console.log(`  …progress: ${i + 1}/${files.length} (uploaded ${uploaded}, skipped ${skipped}, failed ${failed})`);
    }
  }

  console.log(`\n[upload-to-r2] Done. Uploaded ${uploaded}, skipped ${skipped} (already present), failed ${failed}.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[upload-to-r2] Fatal:", err);
  process.exit(1);
});
