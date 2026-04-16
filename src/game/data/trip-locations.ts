export interface TripPhoto {
  src: string;
  caption: string;
}

export interface TripLocation {
  id: string;
  name: string;
  day: number;
  description: string;
  mapTileX: number;
  mapTileY: number;
  photos: TripPhoto[];
}

// Fallback for any missing photo
export const PLACEHOLDER_PHOTO = "/images/trip/placeholder.jpg";

export const tripLocations: TripLocation[] = [
  // ── DAY 1 ──────────────────────────────────────────────────────────────
  {
    id: "naia",
    name: "NAIA Terminal",
    day: 1,
    description: "Arrived from Zamboanga at 8am. The adventure begins here!",
    mapTileX: 28, mapTileY: 62,
    photos: [{ src: "/images/trip/day-1/naia.jpg", caption: "Landing in Manila" }],
  },
  {
    id: "intramuros",
    name: "Intramuros",
    day: 1,
    description: "The Walled City — 500-year-old Spanish colonial streets and Fort Santiago.",
    mapTileX: 22, mapTileY: 58,
    photos: [{ src: "/images/trip/day-1/intramuros-01.jpg", caption: "Fort Santiago" }],
  },
  {
    id: "rizal-park",
    name: "Rizal Park",
    day: 1,
    description: "Luneta Park. Learned about Dr. Jose Rizal — the national hero of the Philippines.",
    mapTileX: 25, mapTileY: 55,
    photos: [{ src: "/images/trip/day-1/rizal-park.jpg", caption: "Rizal Monument" }],
  },

  // ── DAY 2 ──────────────────────────────────────────────────────────────
  {
    id: "hytec",
    name: "Hytec Power Inc.",
    day: 2,
    description: "Industrial tech company in Caloocan. Saw real-world engineering systems up close.",
    mapTileX: 30, mapTileY: 35,
    photos: [{ src: "/images/trip/day-2/hytec.jpg", caption: "Hytec facility" }],
  },
  {
    id: "opentext",
    name: "OpenText / RCBC Plaza",
    day: 2,
    description: "OpenText office in Makati at the iconic RCBC Plaza. Global tech company visit.",
    mapTileX: 55, mapTileY: 62,
    photos: [{ src: "/images/trip/day-2/rcbc.jpg", caption: "RCBC Plaza, Makati" }],
  },

  // ── DAY 3 ──────────────────────────────────────────────────────────────
  {
    id: "mmda",
    name: "MMDA Headquarters",
    day: 3,
    description: "Metro Manila Development Authority in Pasig. Saw how Metro Manila's traffic is managed.",
    mapTileX: 68, mapTileY: 50,
    photos: [{ src: "/images/trip/day-3/mmda.jpg", caption: "MMDA control center" }],
  },
  {
    id: "teleperformance",
    name: "Teleperformance BGC",
    day: 3,
    description: "Global BPO company at BGC Taguig. Massive office with incredible city views.",
    mapTileX: 62, mapTileY: 68,
    photos: [{ src: "/images/trip/day-3/teleperformance.jpg", caption: "BGC skyline view" }],
  },
  {
    id: "bgc-highstreet",
    name: "BGC High Street",
    day: 3,
    description: "Night out at BGC High Street. Neon lights, street art, and the whole squad.",
    mapTileX: 60, mapTileY: 70,
    photos: [{ src: "/images/trip/day-3/bgc-night.jpg", caption: "BGC at night" }],
  },

  // ── DAY 4 ──────────────────────────────────────────────────────────────
  {
    id: "top-peg",
    name: "Top Peg Animation",
    day: 4,
    description: "Animation company in Las Piñas. I drew a cute cat here — proudest moment of the trip. 🐱",
    mapTileX: 35, mapTileY: 78,
    photos: [
      { src: "/images/trip/day-4/toppeg.jpg",     caption: "Top Peg studio" },
      { src: "/images/trip/day-4/my-cat-art.jpg", caption: "My cat drawing! 🐱" },
    ],
  },
  {
    id: "microsourcing",
    name: "Microsourcing Eastwood",
    day: 4,
    description: "BPO company at Eastwood City, QC. Sleek modern office with a great company culture.",
    mapTileX: 72, mapTileY: 42,
    photos: [{ src: "/images/trip/day-4/microsourcing.jpg", caption: "Eastwood City" }],
  },

  // ── DAY 5 ──────────────────────────────────────────────────────────────
  {
    id: "peoples-park",
    name: "People's Park in the Sky",
    day: 5,
    description: "Tagaytay. Stood on a cliff with a breathtaking view of Taal Volcano.",
    mapTileX: 42, mapTileY: 92,
    photos: [
      { src: "/images/trip/day-5/peoples-park.jpg", caption: "View from the top" },
      { src: "/images/trip/day-5/taal-volcano.jpg", caption: "Taal Volcano" },
    ],
  },
  {
    id: "sky-ranch",
    name: "Sky Ranch Tagaytay",
    day: 5,
    description: "Rides and fun with the group. The ferris wheel view over Taal Lake was unreal.",
    mapTileX: 45, mapTileY: 94,
    photos: [{ src: "/images/trip/day-5/sky-ranch.jpg", caption: "Sky Ranch ferris wheel" }],
  },

  // ── DAY 6 ──────────────────────────────────────────────────────────────
  {
    id: "strawberry-farm",
    name: "La Trinidad Strawberry Farm",
    day: 6,
    description: "First stop in Baguio after a 6-hour overnight bus from QC at 1am. Fresh strawberries!",
    mapTileX: 48, mapTileY: 8,
    photos: [{ src: "/images/trip/day-6/strawberry-farm.jpg", caption: "Strawberry fields" }],
  },
  {
    id: "bell-church",
    name: "Bell Church",
    day: 6,
    description: "Chinese-Filipino temple in Baguio. Peaceful, colorful, and beautiful architecture.",
    mapTileX: 52, mapTileY: 10,
    photos: [{ src: "/images/trip/day-6/bell-church.jpg", caption: "Bell Church entrance" }],
  },
  {
    id: "pma",
    name: "Philippine Military Academy",
    day: 6,
    description: "PMA Baguio — the most prestigious military school in the Philippines.",
    mapTileX: 50, mapTileY: 14,
    photos: [{ src: "/images/trip/day-6/pma.jpg", caption: "PMA parade grounds" }],
  },
  {
    id: "mansion-house",
    name: "Mansion House",
    day: 6,
    description: "The Philippine President's Baguio residence. Iconic white gate photo stop.",
    mapTileX: 55, mapTileY: 12,
    photos: [{ src: "/images/trip/day-6/mansion-house.jpg", caption: "Mansion House gate" }],
  },
  {
    id: "mines-view",
    name: "Mines View Park",
    day: 6,
    description: "Overlooking the Cordillera mountains. Last stop — loaded up on pasalubong.",
    mapTileX: 57, mapTileY: 9,
    photos: [{ src: "/images/trip/day-6/mines-view.jpg", caption: "Mountain panorama" }],
  },

  // ── DAY 7 ──────────────────────────────────────────────────────────────
  {
    id: "burnham-park",
    name: "Burnham Park",
    day: 7,
    description: "Last morning in Baguio. Rowboats on the lake, shopping on Session Road.",
    mapTileX: 50, mapTileY: 16,
    photos: [{ src: "/images/trip/day-7/burnham-park.jpg", caption: "Burnham Lake" }],
  },
];
