"use client";

import Image from "next/image";

interface Props {
  imageSrc: string;
}

export function AnimatedPhoto({ imageSrc }: Props) {
  return (
    <div className="photo-anim relative w-full h-full overflow-hidden">
      <Image
        src={imageSrc}
        alt="Aziz Tebbeng"
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover object-top grayscale"
        priority
      />
    </div>
  );
}
