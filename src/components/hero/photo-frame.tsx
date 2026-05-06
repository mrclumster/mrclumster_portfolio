"use client";

import Image from "next/image";

interface Props {
  imageSrc: string;
}

export function PhotoFrame({ imageSrc }: Props) {
  return (
    <div className="photo-anim relative w-full h-full overflow-hidden border border-[color:var(--ink)]">
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top"
        priority
      />
    </div>
  );
}
