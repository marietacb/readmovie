import type { EpisodeWatchLog } from "@/types";

export function normalizeEpisodeWatchLogs(raw: unknown): EpisodeWatchLog[] {
  if (!Array.isArray(raw)) return [];

  const logs: EpisodeWatchLog[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : "";
    const date = typeof row.date === "string" ? row.date.slice(0, 10) : "";
    const season = Number(row.season);
    const episode = Number(row.episode);
    const note = typeof row.note === "string" ? row.note.trim() : undefined;

    if (!id || !date || !Number.isFinite(season) || !Number.isFinite(episode)) continue;
    if (season < 1 || episode < 1) continue;

    logs.push({
      id,
      date,
      season,
      episode,
      note: note || undefined,
    });
  }

  return logs.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    if (a.season !== b.season) return a.season - b.season;
    return a.episode - b.episode;
  });
}

export function formatEpisodeLabel(season: number, episode: number): string {
  return `T${season} E${episode}`;
}

export function episodeKey(season: number, episode: number): string {
  return `${season}-${episode}`;
}

export function countUniqueEpisodes(logs: EpisodeWatchLog[]): number {
  return new Set(logs.map((log) => episodeKey(log.season, log.episode))).size;
}

export function getLogsForDate(logs: EpisodeWatchLog[], date: string): EpisodeWatchLog[] {
  const key = date.slice(0, 10);
  return logs.filter((log) => log.date === key);
}
