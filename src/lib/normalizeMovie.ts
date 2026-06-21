import { readGenresFromEntity } from "@/lib/genres";
import {
  getLatestWatchDate,
  normalizeMovieWatchLogs,
} from "@/lib/movieWatchLogs";
import type { Movie, MovieStatus } from "@/types";

const MOVIE_STATUSES = new Set<MovieStatus>([
  "watched",
  "plan_to_watch",
  "watched_again",
  "partially_dropped",
  "dropped",
]);

function normalizeMovieStatus(
  status: unknown,
  watchLogs: { length: number },
  watchDate?: string,
): MovieStatus {
  if (typeof status === "string" && MOVIE_STATUSES.has(status as MovieStatus)) {
    return status as MovieStatus;
  }
  if (watchLogs.length > 0 || watchDate) return "watched";
  return "plan_to_watch";
}

export function normalizeMovie(movie: Movie): Movie {
  let watchLogs = normalizeMovieWatchLogs(movie.watchLogs);

  if (watchLogs.length === 0 && movie.watchDate) {
    watchLogs = [
      {
        id: `legacy-${movie.id}-${movie.watchDate.slice(0, 10)}`,
        date: movie.watchDate.slice(0, 10),
      },
    ];
  }

  const watchDate = getLatestWatchDate(watchLogs) ?? movie.watchDate?.slice(0, 10);

  return {
    ...movie,
    genres: readGenresFromEntity(movie),
    originalNationality: movie.originalNationality?.trim() || undefined,
    status: normalizeMovieStatus(movie.status, watchLogs, watchDate),
    watchLogs,
    watchDate,
    feelings: movie.feelings ?? [],
  };
}

export function normalizeMovies(movies: Movie[]): Movie[] {
  return movies.map(normalizeMovie);
}
