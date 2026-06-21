function parseGenreString(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      return normalizeGenres(JSON.parse(trimmed));
    } catch {
      return [trimmed];
    }
  }

  return [trimmed];
}

export function normalizeGenres(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const seen = new Set<string>();
    const genres: string[] = [];

    for (const entry of raw) {
      if (typeof entry !== "string") continue;
      const genre = entry.trim();
      if (!genre) continue;
      const key = genre.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      genres.push(genre);
    }

    return genres;
  }

  if (typeof raw === "string") {
    return parseGenreString(raw);
  }

  return [];
}

/** Lee géneros de entidades con `genres` o el campo legacy `genre`. */
export function readGenresFromEntity(entity: {
  genres?: unknown;
  genre?: unknown;
}): string[] {
  if (entity.genres !== undefined) return normalizeGenres(entity.genres);
  return normalizeGenres(entity.genre);
}

export function genresToStorage(genres: string[]): string {
  const normalized = normalizeGenres(genres);
  if (normalized.length === 0) return "";
  if (normalized.length === 1) return normalized[0];
  return JSON.stringify(normalized);
}

export function genresFromStorage(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  return parseGenreString(value);
}

export function formatGenres(genres: string[]): string {
  return normalizeGenres(genres).join(", ");
}

export function genresMatchQuery(genres: string[], query: string): boolean {
  const q = query.toLowerCase();
  return genres.some((genre) => genre.toLowerCase().includes(q));
}
