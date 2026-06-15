"use client";

import { Plus, Star, Film } from "lucide-react";
import { MOVIE_FEELINGS } from "@/lib/constants";
import type { Movie } from "@/types";

interface MovieListViewProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onNewMovie: () => void;
}

export function MovieListView({ movies, onMovieClick, onNewMovie }: MovieListViewProps) {
  const feelingLabels = Object.fromEntries(
    MOVIE_FEELINGS.map((f) => [f.value, f.label])
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bj-navy">Mi colección</h1>
          <p className="mt-1 text-sm text-bj-muted">
            Todas tus reseñas de películas
          </p>
        </div>
        <button onClick={onNewMovie} className="bj-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva reseña
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-bj-border py-16 text-center">
          <Film className="mx-auto mb-3 h-10 w-10 text-bj-muted/40" />
          <p className="text-sm text-bj-muted">Aún no has registrado ninguna película.</p>
          <button onClick={onNewMovie} className="bj-btn-primary mt-4">
            Escribir primera reseña
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="flex items-start gap-4 rounded-xl border border-bj-border bg-bj-surface/30 p-4 text-left transition-all hover:border-bj-navy/20 hover:shadow-sm"
            >
              <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-bj-border bg-white shadow-sm">
                {movie.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                ) : (
                  <Film className="h-6 w-6 text-bj-muted/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-bj-navy">{movie.title}</p>
                <p className="text-sm text-bj-muted">
                  {movie.director && `${movie.director} · `}
                  {movie.genre}
                </p>
                {movie.watchDate && (
                  <p className="text-xs text-bj-muted">
                    Vista el {new Date(movie.watchDate).toLocaleDateString("es-ES")}
                  </p>
                )}
                {movie.summary && (
                  <p className="mt-1 line-clamp-2 text-xs text-bj-muted">{movie.summary}</p>
                )}
                {movie.feelings.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {movie.feelings.slice(0, 2).map((f) => (
                      <span key={f} className="rounded-full bg-bj-navy/5 px-2 py-0.5 text-[10px] text-bj-muted">
                        {feelingLabels[f]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < movie.rating ? "fill-amber-400 text-amber-400" : "text-bj-border"}`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
