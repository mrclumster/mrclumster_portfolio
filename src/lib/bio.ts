import type { Bio } from "@/data/personal";

export function bioAsPlainText(bio: Bio): string {
  return bio
    .map((paragraph) => paragraph.map((seg) => seg.value).join(""))
    .join("\n\n");
}
