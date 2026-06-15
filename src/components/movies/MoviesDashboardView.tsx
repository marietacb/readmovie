"use client";

import { Film, Star, TrendingUp } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatCard } from "@/components/ui/StatCard";
import { GenreChart } from "@/components/ui/GenreChart";
import {
  getAverageMovieRating,
  getMovieGenreStats,
  getMoviesWatchedInYear,
} from "@/lib/movieStats";
import type { Movie } from "@/types";

interface MoviesDashboardViewProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MoviesDashboardView({ movies, onMovieClick }: MoviesDashboardViewProps) {
  const year = new Date().getFullYear();
  const watchedYear = getMoviesWatchedInYear(movies, year);
  const topGenres = getMovieGenreStats(movies).slice(0, 3);
  const recent = [...movies]
    .sort((a, b) => (b.watchDate ?? b.createdAt).localeCompare(a.watchDate ?? a.createdAt))
    .slice(0, 4);

  return (
    <div>
      <PanelHeader
        title="Panel de cine"
        subtitle="Tu colección de películas y lo que has visto este año"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total películas" value={movies.length} icon={<Film className="h-5 w-5" />} accent="bg-bj-navy" />
        <StatCard label={`Vistas en ${year}`} value={watchedYear.length} icon={<TrendingUp className="h-5 w-5" />} accent="bg-bj-terracotta" />
        <StatCard label="Valoración media" value={getAverageMovieRating(movies)} icon={<Star className="h-5 w-5" />} accent="bg-bj-gold" />
        <StatCard label="Géneros" value={topGenres.length} icon={<Film className="h-5 w-5" />} accent="bg-bj-sage" trend={topGenres[0]?.genre} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Últimas reseñas</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-bj-muted">Aún no tienes películas registradas.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => onMovieClick?.(movie)}
                  className="flex w-full items-center justify-between rounded-xl border border-bj-border bg-white px-4 py-3 text-left hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-bj-navy">{movie.title}</p>
                    <p className="text-xs text-bj-muted">
                      {movie.watchDate
                        ? new Date(movie.watchDate).toLocaleDateString("es-ES")
                        : "Sin fecha de visionado"}
                    </p>
                  </div>
                  {movie.rating > 0 && (
                    <span className="text-sm font-semibold text-amber-500">{movie.rating}★</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Géneros favoritos</h3>
          <GenreChart data={getMovieGenreStats(movies)} />
        </div>
      </div>
    </div>
  );
}
