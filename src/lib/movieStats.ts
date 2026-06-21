import type { Movie } from "@/types";

export function getMoviesWatchedInYear(movies: Movie[], year: number): Movie[] {
  return movies.filter((movie) => {
    const date = movie.watchDate ?? movie.createdAt.slice(0, 10);
    return new Date(date).getFullYear() === year;
  });
}

export function getMovieGenreStats(movies: Movie[]): { genre: string; count: number }[] {
  const map = movies.reduce<Record<string, number>>((acc, movie) => {
    movie.genres.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.entries(map)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMovieRatingDistribution(movies: Movie[]): number[] {
  return [1, 2, 3, 4, 5].map(
    (rating) => movies.filter((movie) => movie.rating > 0 && Math.round(movie.rating) === rating).length
  );
}

export function getAverageMovieRating(movies: Movie[]): string {
  const rated = movies.filter((movie) => movie.rating > 0);
  if (!rated.length) return "—";
  return (rated.reduce((sum, movie) => sum + movie.rating, 0) / rated.length).toFixed(1);
}
