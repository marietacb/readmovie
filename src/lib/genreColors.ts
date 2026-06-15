import { PASTEL_COLORS } from "@/lib/constants";

const GENRE_SPINE_MAP: Record<string, string> = {
  fantasy: "#B8D4C0",
  fantasía: "#B8D4C0",
  romance: "#E8C5D4",
  romántico: "#E8C5D4",
  thriller: "#D4C5E8",
  intriga: "#E8D4B8",
  misterio: "#C5B8E8",
  terror: "#E8B8C5",
  histórica: "#E8E0B8",
  historia: "#E8E0B8",
  ciencia: "#B8E8D4",
  ficción: "#B8D4E8",
  drama: "#D4E8B8",
  poesía: "#E8C5D4",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getGenreSpineColor(genre?: string, fallback = "#B8D4E8"): string {
  if (!genre?.trim()) return fallback;

  const lower = genre.toLowerCase();
  for (const [key, color] of Object.entries(GENRE_SPINE_MAP)) {
    if (lower.includes(key)) return color;
  }

  return PASTEL_COLORS[hashString(lower) % PASTEL_COLORS.length];
}
