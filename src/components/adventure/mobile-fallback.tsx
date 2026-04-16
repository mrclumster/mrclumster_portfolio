"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const LOCATIONS = [
  { day: 1, name: "Intramuros",            img: "/images/trip/day-1/intramuros-01.jpg" },
  { day: 1, name: "Rizal Park",             img: "/images/trip/day-1/rizal-park.jpg" },
  { day: 2, name: "Hytec Power Inc.",       img: "/images/trip/day-2/hytec.jpg" },
  { day: 2, name: "OpenText / RCBC Plaza",  img: "/images/trip/day-2/rcbc.jpg" },
  { day: 3, name: "MMDA HQ",                img: "/images/trip/day-3/mmda.jpg" },
  { day: 3, name: "BGC High Street",        img: "/images/trip/day-3/bgc-night.jpg" },
  { day: 4, name: "Top Peg Animation",      img: "/images/trip/day-4/toppeg.jpg" },
  { day: 5, name: "People's Park in Sky",   img: "/images/trip/day-5/peoples-park.jpg" },
  { day: 5, name: "Sky Ranch Tagaytay",     img: "/images/trip/day-5/sky-ranch.jpg" },
  { day: 6, name: "Strawberry Farm",        img: "/images/trip/day-6/strawberry-farm.jpg" },
  { day: 6, name: "PMA Baguio",             img: "/images/trip/day-6/pma.jpg" },
  { day: 7, name: "Burnham Park",           img: "/images/trip/day-7/burnham-park.jpg" },
];

export function MobileFallback() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-black text-white p-4"
      style={{ fontFamily: "var(--font-press-start-2p, 'Press Start 2P'), monospace" }}
    >
      <div className="mx-auto max-w-lg">
        <h1 className="text-xs text-center leading-relaxed mb-1 text-yellow-300">
          ADVENTURE MODE
        </h1>
        <p className="text-[8px] text-center text-white/50 mb-6">
          DESKTOP ONLY FOR FULL EXPERIENCE
        </p>

        <div className="mb-6 border-2 border-white/20 p-3">
          <p className="text-[8px] text-white/70 leading-relaxed text-center">
            8-DAY MANILA EDUCATIONAL TOUR
            <br />
            <span className="text-white/40">Zamboanga → Manila → Baguio → Home</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className="relative border-2 border-white/20 overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-white/5">
                <Image
                  src={loc.img}
                  alt={loc.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/trip/placeholder.jpg";
                  }}
                />
              </div>
              <div className="p-1.5 bg-black/80">
                <p className="text-[7px] text-yellow-300">DAY {loc.day}</p>
                <p className="text-[7px] text-white/80 leading-tight mt-0.5">{loc.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full border-2 border-white/60 py-3 text-[9px] text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          ← BACK TO PORTFOLIO
        </button>
      </div>
    </div>
  );
}
