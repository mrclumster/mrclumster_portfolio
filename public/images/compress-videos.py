"""
Compress every .mov / .mp4 under ./trip recursively to web-friendly H.264 mp4.

Usage:
    1. Install ffmpeg and make sure it's on PATH.
    2. From this folder (public/images/), run:
         python compress-videos.py
    3. Compressed files land in ./optimized_trip mirroring the source structure.
       Originals are NOT touched — review the output, then move/replace yourself.

Tunables:
    MAX_HEIGHT      720  (downscale anything taller; keeps aspect ratio)
    CRF             26   (18=visually lossless, 23=default, 28=acceptable, higher=smaller)
    AUDIO_BITRATE   "96k"

Typical results: 22 MB .MOV → 3-5 MB .mp4 with no visible quality loss on a phone screen.
"""

import os
import subprocess
import sys
from pathlib import Path

INPUT_ROOT  = Path("./trip")
OUTPUT_ROOT = Path("./optimized_trip")

MAX_HEIGHT     = 720
CRF            = 26
AUDIO_BITRATE  = "96k"
PRESET         = "medium"   # slow=smaller, fast=quicker, medium=balanced

VIDEO_EXTS = {".mov", ".mp4", ".m4v", ".webm"}


def compress(src: Path, dst: Path) -> bool:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        print(f"  skip (already exists): {dst.name}")
        return True

    # -vf scale: downscale only if input is taller than MAX_HEIGHT.
    # -movflags +faststart: lets the browser start playback before full download.
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel", "error",
        "-y",
        "-i", str(src),
        "-vf", f"scale=-2:'min({MAX_HEIGHT},ih)'",
        "-c:v", "libx264",
        "-preset", PRESET,
        "-crf", str(CRF),
        "-c:a", "aac",
        "-b:a", AUDIO_BITRATE,
        "-movflags", "+faststart",
        str(dst),
    ]
    try:
        subprocess.run(cmd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ERROR on {src.name}: {e}")
        if dst.exists():
            dst.unlink()
        return False


def main():
    if not INPUT_ROOT.exists():
        print(f"Input folder not found: {INPUT_ROOT.resolve()}")
        sys.exit(1)

    videos = [p for p in INPUT_ROOT.rglob("*") if p.suffix.lower() in VIDEO_EXTS]
    if not videos:
        print("No videos found.")
        return

    total_in  = sum(p.stat().st_size for p in videos)
    print(f"Found {len(videos)} videos, total {total_in / 1024 / 1024:.1f} MB")
    print(f"Compressing → {OUTPUT_ROOT.resolve()}\n")

    ok = 0
    for src in videos:
        rel = src.relative_to(INPUT_ROOT)
        # Always emit .mp4 regardless of source extension
        dst = OUTPUT_ROOT / rel.with_suffix(".mp4")
        size_mb = src.stat().st_size / 1024 / 1024
        print(f"[{ok+1}/{len(videos)}] {rel}  ({size_mb:.1f} MB)")
        if compress(src, dst):
            new_mb = dst.stat().st_size / 1024 / 1024
            print(f"  → {new_mb:.1f} MB ({100 * new_mb / size_mb:.0f}% of original)")
            ok += 1

    total_out = sum(p.stat().st_size for p in OUTPUT_ROOT.rglob("*.mp4"))
    print(f"\nDone. {ok}/{len(videos)} compressed.")
    print(f"Total in:  {total_in / 1024 / 1024:.1f} MB")
    print(f"Total out: {total_out / 1024 / 1024:.1f} MB")
    print(f"Saved:     {(total_in - total_out) / 1024 / 1024:.1f} MB "
          f"({100 * (1 - total_out / total_in):.0f}% reduction)")


if __name__ == "__main__":
    main()
