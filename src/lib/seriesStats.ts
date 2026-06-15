import type { Series, SeriesStatus } from "@/types";

export function getSeriesByStatus(series: Series[], status: SeriesStatus): Series[] {
  return series.filter((item) => item.status === status);
}

export function getSeriesFinishedInYear(series: Series[], year: number): Series[] {
  return series.filter((item) => {
    if (!item.endDate) return false;
    return new Date(item.endDate).getFullYear() === year;
  });
}

export function getSeriesGenreStats(series: Series[]): { genre: string; count: number }[] {
  const map = series.reduce<Record<string, number>>((acc, item) => {
    if (item.genre) acc[item.genre] = (acc[item.genre] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(map)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAverageSeriesRating(series: Series[]): string {
  const rated = series.filter((item) => item.rating > 0);
  if (!rated.length) return "—";
  return (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1);
}

export function getTotalEpisodesWatched(series: Series[]): number {
  return series.reduce((sum, item) => sum + (item.episodesWatched ?? 0), 0);
}
