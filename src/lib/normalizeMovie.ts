import { readGenresFromEntity } from "@/lib/genres";
import type { Movie } from "@/types";

export function normalizeMovie(movie: Movie): Movie {
  return {
    ...movie,
    genres: readGenresFromEntity(movie),
    originalNationality: movie.originalNationality?.trim() || undefined,
    feelings: movie.feelings ?? [],
    bestMoments: movie.bestMoments ?? [],
    worstMoments: movie.worstMoments ?? [],
    favouriteQuotes: movie.favouriteQuotes ?? [],
  };
}

export function normalizeMovies(movies: Movie[]): Movie[] {
  return movies.map(normalizeMovie);
}
