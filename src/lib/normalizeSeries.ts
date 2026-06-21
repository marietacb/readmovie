import { normalizeEpisodeWatchLogs } from "@/lib/episodeWatchLogs";
import { readGenresFromEntity } from "@/lib/genres";
import type { Series } from "@/types";

export function normalizeSeries(item: Series): Series {
  return {
    ...item,
    genres: readGenresFromEntity(item),
    originalNationality: item.originalNationality?.trim() || undefined,
    favoriteEpisodes: item.favoriteEpisodes ?? [],
    episodeWatchLogs: normalizeEpisodeWatchLogs(item.episodeWatchLogs),
    bestMoments: item.bestMoments ?? [],
    worstMoments: item.worstMoments ?? [],
    favouriteQuotes: item.favouriteQuotes ?? [],
    feelings: item.feelings ?? [],
  };
}

export function normalizeSeriesList(items: Series[]): Series[] {
  return items.map(normalizeSeries);
}
