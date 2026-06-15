"use client";

import { BarChart3 } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { GenreChart } from "@/components/ui/GenreChart";
import {
  getAverageMovieRating,
  getMovieGenreStats,
  getMovieRatingDistribution,
  getMoviesWatchedInYear,
} from "@/lib/movieStats";
import { MONTH_SHORT } from "@/lib/bookStats";
import type { Movie } from "@/types";

interface MoviesStatsViewProps {
  movies: Movie[];
}

export function MoviesStatsView({ movies }: MoviesStatsViewProps) {
  const year = new Date().getFullYear();
  const watchedYear = getMoviesWatchedInYear(movies, year);
  const monthly = MONTH_SHORT.map((_, index) =>
    watchedYear.filter((movie) => {
      const date = movie.watchDate ?? movie.createdAt;
      const d = new Date(date);
      return d.getMonth() === index;
    }).length
  );
  const maxMonthly = Math.max(...monthly, 1);
  const distribution = getMovieRatingDistribution(movies);

  return (
    <div>
      <PanelHeader title="Estadísticas de cine" subtitle="Hábitos y valoraciones de tus películas" />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BarChart3 className="h-4 w-4" />
            Películas por mes ({year})
          </h3>
          <div className="flex h-40 items-end gap-2">
            {monthly.map((count, index) => (
              <div key={MONTH_SHORT[index]} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-bj-navy/80 transition-all"
                  style={{ height: `${(count / maxMonthly) * 100}%`, minHeight: count > 0 ? "8px" : "2px" }}
                />
                <span className="text-[10px] text-bj-muted">{MONTH_SHORT[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Distribución de estrellas</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars - 1];
              const max = Math.max(...distribution, 1);
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-bj-muted">{stars}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bj-border/40">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm text-bj-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Por género</h3>
          <GenreChart data={getMovieGenreStats(movies)} />
        </div>
        <div className="bj-panel p-5">
          <h3 className="mb-2 text-sm font-semibold text-bj-navy">Resumen</h3>
          <ul className="space-y-2 text-sm text-bj-muted">
            <li>
              <strong className="text-bj-navy">{movies.length}</strong> películas en tu colección
            </li>
            <li>
              <strong className="text-bj-navy">{watchedYear.length}</strong> vistas en {year}
            </li>
            <li>
              Valoración media: <strong className="text-bj-navy">{getAverageMovieRating(movies)}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
