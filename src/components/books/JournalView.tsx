"use client";

import { Quote, BookOpen, Film, Tv } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import type { Book, Movie, Series } from "@/types";

interface JournalViewProps {
  books: Book[];
  movies: Movie[];
  series: Series[];
  onBookClick?: (book: Book) => void;
  onMovieClick?: (movie: Movie) => void;
  onSeriesClick?: (item: Series) => void;
}

export function JournalView({
  books,
  movies,
  series,
  onBookClick,
  onMovieClick,
  onSeriesClick,
}: JournalViewProps) {
  const bookEntries = books.flatMap((b) => {
    const entries: { book: Book; text: string; type: "opinion" | "quote"; date?: string }[] = [];
    if (b.opinion?.trim()) entries.push({ book: b, text: b.opinion, type: "opinion" });
    (b.quotes ?? []).forEach((q) =>
      entries.push({ book: b, text: q.text, type: "quote", date: q.date })
    );
    return entries;
  }).sort((a, b) => {
    const dateA = a.date ?? a.book.updatedAt;
    const dateB = b.date ?? b.book.updatedAt;
    return dateB.localeCompare(dateA);
  });

  const movieQuotes = movies.flatMap((m) =>
    m.favouriteQuotes
      .filter((q) => q.trim())
      .map((quote) => ({ movie: m, quote }))
  );

  const seriesQuotes = series.flatMap((s) =>
    s.favouriteQuotes
      .filter((q) => q.trim())
      .map((quote) => ({ item: s, quote }))
  );

  return (
    <div>
      <PanelHeader
        title="Diario de lectura"
        subtitle="Tus opiniones, personajes y citas favoritas en un solo lugar"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BookOpen className="h-4 w-4" />
            Entradas de libros
          </h3>
          {bookEntries.length === 0 ? (
            <div className="bj-panel rounded-xl p-8 text-center">
              <p className="text-sm text-bj-muted">Aún no hay entradas en tu diario</p>
              <p className="mt-1 text-xs text-bj-muted/70">Escribe tu opinión al registrar una lectura</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookEntries.map((entry, i) => (
                <button
                  key={`${entry.book.id}-${i}`}
                  onClick={() => onBookClick?.(entry.book)}
                  className="bj-panel w-full p-5 text-left transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-bj-navy">{entry.book.title}</p>
                      <p className="text-xs text-bj-muted">{entry.book.author}</p>
                    </div>
                    <span className="rounded-full bg-bj-surface px-2 py-0.5 text-[10px] text-bj-muted">
                      {entry.type === "quote" ? "Frase" : "Opinión"}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-bj-text/80 italic">
                    &ldquo;{entry.text}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <Film className="h-4 w-4" />
            Citas de cine
          </h3>
          {movieQuotes.length === 0 ? (
            <div className="bj-panel rounded-xl p-8 text-center">
              <Quote className="mx-auto mb-2 h-8 w-8 text-bj-muted/30" />
              <p className="text-sm text-bj-muted">Sin citas de películas aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movieQuotes.map(({ movie, quote }, i) => (
                <button
                  key={`${movie.id}-${i}`}
                  onClick={() => onMovieClick?.(movie)}
                  className="bj-panel-accent w-full p-5 text-left transition-shadow hover:shadow-md"
                >
                  <p className="font-serif text-sm leading-relaxed text-bj-navy italic">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-bj-muted">
                    — {movie.title}
                    {movie.director && `, ${movie.director}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <Tv className="h-4 w-4" />
            Citas de series
          </h3>
          {seriesQuotes.length === 0 ? (
            <div className="bj-panel rounded-xl p-8 text-center">
              <Quote className="mx-auto mb-2 h-8 w-8 text-bj-muted/30" />
              <p className="text-sm text-bj-muted">Sin citas de series aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {seriesQuotes.map(({ item, quote }, i) => (
                <button
                  key={`${item.id}-${i}`}
                  onClick={() => onSeriesClick?.(item)}
                  className="bj-panel-accent w-full p-5 text-left transition-shadow hover:shadow-md"
                >
                  <p className="font-serif text-sm leading-relaxed text-bj-navy italic">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-bj-muted">
                    — {item.title}
                    {item.creator && `, ${item.creator}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
