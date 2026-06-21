import type { MovieWatchLog } from "@/types";

export function normalizeMovieWatchLogs(raw: unknown): MovieWatchLog[] {
  if (!Array.isArray(raw)) return [];

  const logs: MovieWatchLog[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : "";
    const date = typeof row.date === "string" ? row.date.slice(0, 10) : "";
    const note = typeof row.note === "string" ? row.note.trim() : undefined;

    if (!id || !date) continue;

    logs.push({
      id,
      date,
      note: note || undefined,
    });
  }

  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export function countMovieWatchLogs(logs: MovieWatchLog[]): number {
  return logs.length;
}

export function getLatestWatchDate(logs: MovieWatchLog[]): string | undefined {
  return logs[0]?.date;
}

export function getLogsForDate(logs: MovieWatchLog[], date: string): MovieWatchLog[] {
  const key = date.slice(0, 10);
  return logs.filter((log) => log.date === key);
}
