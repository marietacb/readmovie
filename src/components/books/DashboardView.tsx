"use client";

import { BookOpen, TrendingUp, Star, BookMarked } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ReadingGoalRing } from "@/components/ui/ReadingGoalRing";
import { ActivityHeatmap } from "@/components/ui/ActivityHeatmap";
import { GenreChart } from "@/components/ui/GenreChart";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import {
  getFinishedThisYear,
  getGenreStats,
  getBookShelf,
  getTotalPages,
} from "@/lib/bookStats";
import type { Book } from "@/types";

interface DashboardViewProps {
  books: Book[];
  readingGoal: number;
  onGoalChange: (goal: number) => void;
  onBookClick?: (book: Book) => void;
}

export function DashboardView({
  books,
  readingGoal,
  onGoalChange,
  onBookClick,
}: DashboardViewProps) {
  const finishedYear = getFinishedThisYear(books);
  const reading = books.filter((b) => getBookShelf(b) === "leyendo");
  const rated = books.filter((b) => b.rating > 0);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1)
      : "—";
  const totalPages = getTotalPages(books);
  const topGenres = getGenreStats(books).slice(0, 3);

  return (
    <div>
      <PanelHeader
        title="Panel de lectura"
        subtitle="Tu rincón de lectura personal — inspirado en los mejores diarios de libros"
      />

      <div className="mb-6">
        <ReadingGoalRing
          current={finishedYear.length}
          goal={readingGoal}
          onGoalChange={onGoalChange}
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total libros" value={books.length} icon={<BookOpen className="h-5 w-5" />} accent="bg-bj-navy" />
        <StatCard label="Leyendo ahora" value={reading.length} icon={<BookMarked className="h-5 w-5" />} accent="bg-bj-terracotta" />
        <StatCard label="Páginas leídas" value={totalPages.toLocaleString("es-ES")} icon={<TrendingUp className="h-5 w-5" />} accent="bg-bj-sage" />
        <StatCard label="Valoración media" value={avgRating} icon={<Star className="h-5 w-5" />} accent="bg-bj-gold" trend={`${rated.length} valorados`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leyendo ahora — hero card */}
        <div className="bj-panel-accent p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bj-terracotta/20 text-xs">📖</span>
            Leyendo ahora
          </h3>
          {reading.length === 0 ? (
            <p className="text-sm text-bj-muted">No tienes lecturas en curso</p>
          ) : (
            <div className="space-y-3">
              {reading.slice(0, 3).map((book) => (
                <button
                  key={book.id}
                  onClick={() => onBookClick?.(book)}
                  className="flex w-full items-center gap-3 rounded-xl bg-white/80 p-3 text-left transition-all hover:bg-white hover:shadow-sm"
                >
                  <div
                    className="h-14 w-10 shrink-0 overflow-hidden rounded-md border border-bj-border shadow-sm"
                    style={{ backgroundColor: book.spineColor }}
                  >
                    {book.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-bj-navy">{book.title}</p>
                    <p className="truncate text-xs text-bj-muted">{book.author}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actividad */}
        <div className="bj-panel p-6">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Calendario de actividad</h3>
          <ActivityHeatmap books={books} />
          <p className="mt-3 text-xs text-bj-muted">
            Tus días de lectura en las últimas 16 semanas
          </p>
        </div>

        {/* Géneros */}
        <div className="bj-panel p-6">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Géneros favoritos</h3>
          <GenreChart data={getGenreStats(books)} maxItems={4} />
        </div>

        {/* Últimas lecturas */}
        <div className="bj-panel p-6">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Últimas actualizaciones</h3>
          {books.length === 0 ? (
            <p className="text-sm text-bj-muted">Sin lecturas registradas</p>
          ) : (
            <div className="space-y-2">
              {[...books]
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                .slice(0, 5)
                .map((book) => (
                  <button
                    key={book.id}
                    onClick={() => onBookClick?.(book)}
                    className="flex w-full items-center justify-between rounded-lg bg-bj-surface/60 px-3 py-2.5 text-left transition-colors hover:bg-bj-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-bj-navy">{book.title}</p>
                      <p className="truncate text-xs text-bj-muted">{book.author}</p>
                    </div>
                    {book.rating > 0 && (
                      <span className="shrink-0">
                        <StarRatingDisplay value={book.rating} />
                      </span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {topGenres.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {topGenres.map((g) => (
            <span
              key={g.genre}
              className="rounded-full border border-bj-border bg-bj-surface/50 px-3 py-1 text-xs text-bj-muted"
            >
              {g.genre} · {g.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
