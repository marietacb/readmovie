import { normalizeEpisodeWatchLogs } from "@/lib/episodeWatchLogs";
import { readGenresFromEntity } from "@/lib/genres";
import type { Series, SeriesStatus } from "@/types";

const SERIES_STATUSES = new Set<SeriesStatus>([
  "watching",
  "completed",
  "plan_to_watch",
  "dropped",
  "watched_again",
  "partially_dropped",
]);

function normalizeSeriesStatus(status: unknown): SeriesStatus {
  if (typeof status === "string" && SERIES_STATUSES.has(status as SeriesStatus)) {
    return status as SeriesStatus;
  }
  return "plan_to_watch";
}

export function normalizeSeries(item: Series): Series {
  return {
    ...item,
    genres: readGenresFromEntity(item),
    originalNationality: item.originalNationality?.trim() || undefined,
    status: normalizeSeriesStatus(item.status),
    episodeWatchLogs: normalizeEpisodeWatchLogs(item.episodeWatchLogs),
    feelings: item.feelings ?? [],
  };
}

export function normalizeSeriesList(items: Series[]): Series[] {
  return items.map(normalizeSeries);
}
