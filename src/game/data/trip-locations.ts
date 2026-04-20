export interface TripPhoto {
  src: string;
  caption: string;
  type?: "photo" | "video"; // default "photo"
}

export interface TripLocation {
  id: string;
  name: string;
  day: number;
  dayLabel: string; // e.g. "DAY 1"
  description: string;
  mapTileX: number;
  mapTileY: number;
  photos: TripPhoto[]; // __ highlighted photos shown first in the viewer
}

// Fallback for any missing photo
export const PLACEHOLDER_PHOTO = "/images/trip/placeholder.svg";

// ─── Helper ──────────────────────────────────────────────────────────────────
// Builds a TripPhoto with the correct subfolder URL.
// Folder names with spaces are encoded so browsers can fetch them.
function p(day: number, folder: string, file: string, caption = "", type?: "photo" | "video"): TripPhoto {
  return {
    src: `/images/trip/day-${day}/${encodeURIComponent(folder)}/${file}`,
    caption,
    type: type ?? (file.toUpperCase().endsWith(".MOV") ? "video" : "photo"),
  };
}

// ─── ALL PHOTOS per day (highlights first, then dump) ────────────────────────
// Used for the TAB "ALL DAY X PHOTOS" gallery in PhotoViewerScene.
// DNG raw files are excluded — browsers cannot display them.
export const dayGalleries: Record<number, TripPhoto[]> = {
  1: [
    // ── Highlights ──
    p(1, "airport",    "__2026_04_05_06_26_IMG_5982.JPG", "Early morning — departure day"),
    p(1, "airport",    "__2026_04_05_08_14_IMG_6015.JPG", "Arriving in Manila"),
    p(1, "intramuros", "__2026_04_05_14_06_IMG_6022.JPG", "Intramuros"),
    p(1, "intramuros", "__2026_04_05_15_27_IMG_6043.JPG", "The Walled City"),
    p(1, "MOA",        "__IMG_20260405_172123.jpg",        "Mall of Asia"),
    // ── Dump ──
    p(1, "airport",    "IMG_20260405_042739.jpg"),
    p(1, "intramuros", "2026_04_05_15_11_IMG_6027.JPG"),
    p(1, "intramuros", "2026_04_05_15_11_IMG_6029.JPG"),
    p(1, "intramuros", "2026_04_05_15_17_IMG_6032.JPG"),
    p(1, "intramuros", "2026_04_05_15_18_IMG_6034.JPG"),
    p(1, "intramuros", "2026_04_05_15_25_IMG_6039.JPG"),
    p(1, "intramuros", "2026_04_05_15_31_IMG_6046.MOV", "Video"),
    p(1, "intramuros", "IMG_20260405_140329.jpg"),
    p(1, "intramuros", "IMG_20260405_140840.jpg"),
    p(1, "intramuros", "IMG_20260405_140922.jpg"),
    p(1, "intramuros", "IMG_20260405_141138.jpg"),
    p(1, "intramuros", "IMG_20260405_141956.jpg"),
    p(1, "intramuros", "IMG_20260405_142019.jpg"),
    p(1, "intramuros", "IMG_20260405_144319.jpg"),
    p(1, "intramuros", "IMG_20260405_151131.jpg"),
  ],
  2: [
    // ── Highlights ──
    p(2, "DJM DORM",       "__2026_04_06_07_06_IMG_6055.JPG", "Morning at DJM Dorm"),
    p(2, "Hytec Power Inc", "__2026_04_06_08_52_IMG_6059.JPG", "Hytec Power Inc."),
    p(2, "Hytec Power Inc", "__2026_04_06_09_25_IMG_6067.JPG", "Engineering systems"),
    p(2, "Hytec Power Inc", "__2026_04_06_09_30_IMG_6069.JPG", "The facility"),
    p(2, "Hytec Power Inc", "__IMG_20260406_093209.jpg",        "Hytec visit"),
    // ── Dump ──
    p(2, "Hytec Power Inc", "2026_04_06_09_15_IMG_6060.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_17_IMG_6061.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_17_IMG_6062.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_18_IMG_6063.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_18_IMG_6064.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_20_IMG_6065.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_20_IMG_6066.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_29_IMG_6068.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_36_IMG_6073.JPG"),
    p(2, "Hytec Power Inc", "2026_04_06_09_47_IMG_6075.JPG"),
    p(2, "Hytec Power Inc", "IMG_20260406_091821.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_091935.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092006.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092108.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092129.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092239.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092259.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092515.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_092617.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_093215.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_093225.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_093603.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_095110.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_095450.jpg"),
    p(2, "Hytec Power Inc", "IMG_20260406_095725.jpg"),
    p(2, "OpenText",        "2026_04_06_16_35_IMG_6085.JPG"),
    p(2, "OpenText",        "2026_04_06_16_35_IMG_6088.JPG"),
    p(2, "OpenText",        "2026_04_06_16_51_IMG_6089.JPG"),
    p(2, "OpenText",        "IMG_20260406_133843.jpg"),
    p(2, "OpenText",        "IMG_20260406_164656.jpg"),
    p(2, "OpenText",        "IMG_20260406_164902.jpg"),
    p(2, "OpenText",        "IMG_20260406_165125.jpg"),
  ],
  3: [
    // ── Highlights ──
    p(3, "MMDA", "__2026_04_07_10_21_IMG_6124.JPG", "MMDA Headquarters"),
    p(3, "BGC",  "__2026_04_07_21_16_IMG_6160.JPG", "BGC at night"),
    p(3, "BGC",  "__2026_04_07_21_17_IMG_6388.JPG", "BGC High Street"),
    p(3, "BGC",  "__2026_04_07_21_25_IMG_6163.JPG", "The squad at BGC"),
    p(3, "BGC",  "__2026_04_07_21_30_IMG_6165.MOV", "BGC vibes"),
    // ── Dump ──
    p(3, "MMDA",                  "2026_04_07_10_20_IMG_6118.JPG"),
    p(3, "MMDA",                  "2026_04_07_10_24_IMG_6140.JPG"),
    p(3, "MMDA",                  "2026_04_07_10_25_IMG_6142.JPG"),
    p(3, "sight seeing in day 3", "2026_04_07_13_01_IMG_6148.JPG"),
    p(3, "sight seeing in day 3", "2026_04_07_15_16_IMG_6153.JPG"),
    p(3, "BGC",                   "2026_04_07_20_58_IMG_6158.JPG"),
    p(3, "BGC",                   "2026_04_07_21_09_IMG_6159.JPG"),
    p(3, "BGC",                   "2026_04_07_21_17_IMG_6161.JPG"),
  ],
  4: [
    // ── Highlights ──
    p(4, "photoDUMP only", "__IMG_20260408_004253.jpg",        "Late night"),
    p(4, "photoDUMP only", "__2026_04_08_10_38_IMG_6168.JPG",  "Top Peg Animation Studio"),
    p(4, "photoDUMP only", "__2026_04_08_15_18_IMG_6171.JPG",  "Microsourcing Eastwood"),
    // ── Dump ──
    p(4, "photoDUMP only", "IMG_20260408_095642.jpg"),
    p(4, "photoDUMP only", "IMG_20260408_204825.jpg"),
  ],
  5: [
    // ── Highlights ──
    p(5, "Tagaytay", "__2026_04_09_08_05_IMG_6191.MOV", "People's Park — the view!"),
    p(5, "Tagaytay", "__2026_04_09_08_14_IMG_6217.MOV", "Taal Volcano video"),
    p(5, "Tagaytay", "__2026_04_09_08_46_IMG_6352.JPG", "People's Park in the Sky"),
    p(5, "Skyranch", "__IMG_20260409_102235.jpg",        "Sky Ranch Tagaytay"),
    // ── Dump (skip DNG) ──
    p(5, "Tagaytay", "2026_04_09_08_04_IMG_6187.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_06_IMG_6194.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_08_IMG_6208.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_32_IMG_6303.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_34_IMG_6315.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_34_IMG_6317.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_40_IMG_6330.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_44_IMG_6335.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_44_IMG_6336.JPG"),
    p(5, "Tagaytay", "2026_04_09_08_45_IMG_6344.JPG"),
    p(5, "Tagaytay", "2026_04_09_12_12_IMG_6366.JPG"),
    p(5, "Skyranch", "2026_04_09_13_42_IMG_6370.JPG"),
    p(5, "Skyranch", "665115097_825203343341851_4661964269419167193_n.jpg"),
    p(5, "Skyranch", "IMG_20260409_101144.jpg"),
    p(5, "Skyranch", "IMG_20260409_102616.jpg"),
  ],
  6: [
    // ── Highlights ──
    p(6, "PHOTO DUMP",               "__2026_04_10_02_04_IMG_6399.JPG", "1am — on the overnight bus to Baguio"),
    p(6, "La Trinidad Strawberry Farm", "__2026_04_10_05_52_IMG_6402.MOV", "Arriving in Baguio"),
    p(6, "La Trinidad Strawberry Farm", "__2026_04_10_06_54_IMG_6414.JPG", "Strawberry Farm — La Trinidad"),
    p(6, "Bell Church",              "__2026_04_10_07_30_IMG_6446.JPG", "Bell Church entrance"),
    p(6, "Bell Church",              "__2026_04_10_07_31_IMG_6448.JPG", "Bell Church"),
    p(6, "Bell Church",              "__2026_04_10_07_39_IMG_6465.JPG", "Bell Church grounds"),
    p(6, "Bell Church",              "__2026_04_10_07_51_IMG_6491.JPG", "Philippine Military Academy approach"),
    p(6, "PMA",                      "__2026_04_10_13_45_IMG_6544.MOV", "Mines View Park"),
    p(6, "PMA",                      "__2026_04_10_13_49_IMG_6579.JPG", "Cordillera mountain view"),
    p(6, "PHOTO DUMP",               "__2026_04_10_15_16_IMG_6654.JPG", "Burnham Park — last day in Baguio"),
    // ── Dump ──
    p(6, "La Trinidad Strawberry Farm", "2026_04_10_05_52_IMG_6401.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_30_IMG_6447.MOV"),
    p(6, "Bell Church",              "2026_04_10_07_32_IMG_6449.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_34_IMG_6454.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_40_IMG_6473.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_43_IMG_6477.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_45_IMG_6485.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_53_IMG_6493.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_57_IMG_6496.JPG"),
    p(6, "Bell Church",              "2026_04_10_07_59_IMG_6506.JPG"),
    p(6, "Bell Church",              "IMG_20260410_074641.jpg"),
    p(6, "Bell Church",              "IMG_20260410_075726.jpg"),
    p(6, "PMA",                      "2026_04_10_13_35_IMG_6513.JPG"),
    p(6, "PMA",                      "2026_04_10_13_37_IMG_6515.JPG"),
    p(6, "PMA",                      "2026_04_10_13_37_IMG_6516.JPG"),
    p(6, "PMA",                      "2026_04_10_13_38_IMG_6519.JPG"),
    p(6, "PMA",                      "2026_04_10_13_38_IMG_6520.JPG"),
    p(6, "PMA",                      "2026_04_10_13_39_IMG_6521.MOV"),
    p(6, "PMA",                      "2026_04_10_13_39_IMG_6522.JPG"),
    p(6, "PMA",                      "2026_04_10_13_39_IMG_6523.JPG"),
    p(6, "PMA",                      "2026_04_10_13_40_IMG_6531.JPG"),
    p(6, "PMA",                      "2026_04_10_13_41_IMG_6536.JPG"),
    p(6, "PMA",                      "2026_04_10_13_43_IMG_6537.JPG"),
    p(6, "PMA",                      "2026_04_10_13_47_IMG_6561.JPG"),
    p(6, "PMA",                      "2026_04_10_13_53_IMG_6615.JPG"),
    p(6, "PMA",                      "2026_04_10_13_56_IMG_6628.JPG"),
    p(6, "PHOTO DUMP",               "IMG_20260410_095619.jpg"),
  ],
};

// ─── Trip Locations ───────────────────────────────────────────────────────────
// 16 stops along the linear road map, alternating left (tile x=6) and
// right (tile x=14) as the player walks south through each day zone.
export const tripLocations: TripLocation[] = [
  // ── DAY 1 — Manila / Airport ───────────────────────────────────────────────
  {
    id: "airport",
    name: "Airport",
    day: 1,
    dayLabel: "DAY 1",
    description: "Departed Zamboanga early morning, arrived in Manila. The trip officially starts!",
    mapTileX: 13, mapTileY: 8,
    photos: [
      p(1, "airport", "__2026_04_05_06_26_IMG_5982.JPG", "Early morning — departure day"),
      p(1, "airport", "__2026_04_05_08_14_IMG_6015.JPG", "Arriving in Manila"),
    ],
  },
  {
    id: "intramuros",
    name: "Intramuros",
    day: 1,
    dayLabel: "DAY 1",
    description: "The Walled City — 500-year-old Spanish colonial streets and Fort Santiago.",
    mapTileX: 23, mapTileY: 8,
    photos: [
      p(1, "intramuros", "__2026_04_05_14_06_IMG_6022.JPG", "Intramuros"),
      p(1, "intramuros", "__2026_04_05_15_27_IMG_6043.JPG", "The Walled City"),
    ],
  },
  {
    id: "moa",
    name: "Mall of Asia",
    day: 1,
    dayLabel: "DAY 1",
    description: "One of Asia's largest malls, right on Manila Bay.",
    mapTileX: 33, mapTileY: 8,
    photos: [
      p(1, "MOA", "__IMG_20260405_172123.jpg", "Mall of Asia"),
    ],
  },

  // ── DAY 2 — QC / Urban ────────────────────────────────────────────────────
  {
    id: "djm-dorm",
    name: "DJM Dorm",
    day: 2,
    dayLabel: "DAY 2",
    description: "Home base for the trip — a dorm in QC where everyone stayed.",
    mapTileX: 43, mapTileY: 17,
    photos: [
      p(2, "DJM DORM", "__2026_04_06_07_06_IMG_6055.JPG", "Morning at DJM Dorm"),
    ],
  },
  {
    id: "hytec",
    name: "Hytec Power Inc.",
    day: 2,
    dayLabel: "DAY 2",
    description: "Industrial tech company in Caloocan. Saw real-world engineering systems up close.",
    mapTileX: 37, mapTileY: 20,
    photos: [
      p(2, "Hytec Power Inc", "__2026_04_06_08_52_IMG_6059.JPG", "Hytec Power Inc."),
      p(2, "Hytec Power Inc", "__2026_04_06_09_25_IMG_6067.JPG", "Engineering systems"),
      p(2, "Hytec Power Inc", "__2026_04_06_09_30_IMG_6069.JPG", "The facility"),
      p(2, "Hytec Power Inc", "__IMG_20260406_093209.jpg",        "Hytec visit"),
    ],
  },
  {
    id: "opentext",
    name: "OpenText",
    day: 2,
    dayLabel: "DAY 2",
    description: "OpenText office in Makati at the iconic RCBC Plaza. Global tech company visit.",
    mapTileX: 27, mapTileY: 21,
    photos: [], // no highlights — viewer opens in ALL PHOTOS mode
  },

  // ── DAY 3 — Government / BGC Night ────────────────────────────────────────
  {
    id: "mmda",
    name: "MMDA",
    day: 3,
    dayLabel: "DAY 3",
    description: "Metro Manila Development Authority in Pasig. Saw how Metro Manila's traffic is managed.",
    mapTileX: 14, mapTileY: 32,
    photos: [
      p(3, "MMDA", "__2026_04_07_10_21_IMG_6124.JPG", "MMDA Headquarters"),
    ],
  },
  {
    id: "bgc",
    name: "BGC",
    day: 3,
    dayLabel: "DAY 3",
    description: "Night out at BGC High Street. Neon lights, street art, and the whole squad.",
    mapTileX: 10, mapTileY: 36,
    photos: [
      p(3, "BGC", "__2026_04_07_21_16_IMG_6160.JPG", "BGC at night"),
      p(3, "BGC", "__2026_04_07_21_17_IMG_6388.JPG", "BGC High Street"),
      p(3, "BGC", "__2026_04_07_21_25_IMG_6163.JPG", "The squad at BGC"),
      p(3, "BGC", "__2026_04_07_21_30_IMG_6165.MOV", "BGC vibes"),
    ],
  },

  // ── DAY 4 — Photo Dump ────────────────────────────────────────────────────
  {
    id: "day4-dump",
    name: "Day 4 Photo Dump",
    day: 4,
    dayLabel: "DAY 4",
    description: "Top Peg Animation Studio + Microsourcing Eastwood. Drew a cute cat. Proudest moment.",
    mapTileX: 29, mapTileY: 45,
    photos: [
      p(4, "photoDUMP only", "__IMG_20260408_004253.jpg",        "Late night"),
      p(4, "photoDUMP only", "__2026_04_08_10_38_IMG_6168.JPG",  "Top Peg Animation Studio"),
      p(4, "photoDUMP only", "__2026_04_08_15_18_IMG_6171.JPG",  "Microsourcing Eastwood"),
    ],
  },

  // ── DAY 5 — Tagaytay ─────────────────────────────────────────────────────
  {
    id: "tagaytay",
    name: "People's Park, Tagaytay",
    day: 5,
    dayLabel: "DAY 5",
    description: "Tagaytay. Stood on a cliff with a breathtaking view of Taal Volcano.",
    mapTileX: 44, mapTileY: 28,
    photos: [
      p(5, "Tagaytay", "__2026_04_09_08_05_IMG_6191.MOV", "People's Park — the view!"),
      p(5, "Tagaytay", "__2026_04_09_08_14_IMG_6217.MOV", "Taal Volcano video"),
      p(5, "Tagaytay", "__2026_04_09_08_46_IMG_6352.JPG", "People's Park in the Sky"),
    ],
  },
  {
    id: "skyranch",
    name: "Sky Ranch",
    day: 5,
    dayLabel: "DAY 5",
    description: "Rides and fun with the group. The ferris wheel view over Taal Lake was unreal.",
    mapTileX: 40, mapTileY: 24,
    photos: [
      p(5, "Skyranch", "__IMG_20260409_102235.jpg", "Sky Ranch Tagaytay"),
    ],
  },

  // ── DAY 6 — Baguio ───────────────────────────────────────────────────────
  {
    id: "baguio",
    name: "Baguio Arrival",
    day: 6,
    dayLabel: "DAY 6",
    description: "1am overnight bus from QC. 6 hours of mountains. Arrived in Baguio at dawn.",
    mapTileX: 33, mapTileY: 15,
    photos: [
      p(6, "PHOTO DUMP", "__2026_04_10_02_04_IMG_6399.JPG", "1am — on the overnight bus to Baguio"),
    ],
  },
  {
    id: "strawberry-farm",
    name: "La Trinidad Strawberry Farm",
    day: 6,
    dayLabel: "DAY 6",
    description: "First stop in Baguio after arriving at dawn. Fresh strawberries straight from the field!",
    mapTileX: 35, mapTileY: 12,
    photos: [
      p(6, "La Trinidad Strawberry Farm", "__2026_04_10_05_52_IMG_6402.MOV", "Arriving in Baguio"),
      p(6, "La Trinidad Strawberry Farm", "__2026_04_10_06_54_IMG_6414.JPG", "Strawberry Farm — La Trinidad"),
    ],
  },
  {
    id: "bell-church",
    name: "Bell Church",
    day: 6,
    dayLabel: "DAY 6",
    description: "Chinese-Filipino temple in Baguio. Peaceful, colorful, and beautiful architecture.",
    mapTileX: 38, mapTileY: 11,
    photos: [
      p(6, "Bell Church", "__2026_04_10_07_30_IMG_6446.JPG", "Bell Church entrance"),
      p(6, "Bell Church", "__2026_04_10_07_31_IMG_6448.JPG", "Bell Church"),
      p(6, "Bell Church", "__2026_04_10_07_39_IMG_6465.JPG", "Bell Church grounds"),
      p(6, "Bell Church", "__2026_04_10_07_51_IMG_6491.JPG", "Philippine Military Academy approach"),
    ],
  },
  {
    id: "pma",
    name: "PMA",
    day: 6,
    dayLabel: "DAY 6",
    description: "Philippine Military Academy — the most prestigious military school in the Philippines.",
    mapTileX: 43, mapTileY: 11,
    photos: [
      p(6, "PMA", "__2026_04_10_13_45_IMG_6544.MOV", "Mines View Park"),
      p(6, "PMA", "__2026_04_10_13_49_IMG_6579.JPG", "Cordillera mountain view"),
    ],
  },
  {
    id: "day6-dump",
    name: "Day 6 Photo Dump",
    day: 6,
    dayLabel: "DAY 6",
    description: "Burnham Park, Session Road, pasalubong shopping. Last hours in Baguio.",
    mapTileX: 47, mapTileY: 13,
    photos: [
      p(6, "PHOTO DUMP", "__2026_04_10_15_16_IMG_6654.JPG", "Burnham Park — last day in Baguio"),
    ],
  },
];
