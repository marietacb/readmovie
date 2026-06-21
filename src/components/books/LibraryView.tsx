"use client";

import { useMemo, useState } from "react";
import { Search, BookOpen, LayoutGrid, List } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatGenres, genresMatchQuery } from "@/lib/genres";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import { ScrapbookListView } from "@/components/books/ScrapbookListView";
import type { Book } from "@/types";
import { cn } from "@/lib/utils";

type LibraryViewMode = "list" | "scrapbook";

interface LibraryViewProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onNewBook: () => void;
}

export function LibraryView({ books, onBookClick, onNewBook }: LibraryViewProps) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<LibraryViewMode>("list");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        genresMatchQuery(b.genres, q) ||
        b.originalNationality?.toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bj-navy">Búsqueda</h1>
          <p className="mt-1 text-sm text-bj-muted">
            Encuentra cualquier libro de tu colección
          </p>
        </div>
        <button onClick={onNewBook} className="bj-btn-primary hidden sm:inline-flex">
          + Nueva lectura
        </button>
      </div>

      <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bj-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor o género..."
            className="bj-input pl-10"
          />
        </div>
        <div className="flex shrink-0 rounded-xl border border-bj-border bg-bj-surface p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              viewMode === "list" ? "bg-white text-bj-navy shadow-sm" : "text-bj-muted"
            )}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
          <button
            type="button"
            onClick={() => setViewMode("scrapbook")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              viewMode === "scrapbook" ? "bg-white text-bj-navy shadow-sm" : "text-bj-muted"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Scrapbook
          </button>
        </div>
      </div>

      {viewMode === "scrapbook" ? (
        <ScrapbookListView books={filtered} onBookClick={onBookClick} />
      ) : (
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-bj-border py-12 text-center">
            <p className="text-sm text-bj-muted">
              {query ? "No se encontraron resultados." : "Aún no hay lecturas registradas."}
            </p>
            {!query && (
              <button onClick={onNewBook} className="bj-btn-primary mt-4">
                Añadir primera lectura
              </button>
            )}
          </div>
        ) : (
          filtered.map((book) => (
            <button
              key={book.id}
              onClick={() => onBookClick(book)}
              className="flex w-full items-center gap-4 rounded-xl border border-bj-border bg-bj-surface/30 px-4 py-3 text-left transition-all hover:border-bj-navy/20 hover:bg-bj-surface/60 hover:shadow-sm"
            >
              <div
                className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-bj-border shadow-sm"
                style={{ backgroundColor: book.spineColor }}
              >
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <BookOpen className="h-4 w-4 text-bj-navy/30" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-bj-navy">{book.title}</p>
                <p className="truncate text-sm text-bj-muted">{book.author}</p>
                {book.genres.length > 0 && (
                  <span className="mt-1 inline-block rounded-full bg-bj-navy/5 px-2 py-0.5 text-[10px] text-bj-muted">
                    {formatGenres(book.genres)}
                  </span>
                )}
              </div>
              <div className="shrink-0 text-right text-xs text-bj-muted">
                {book.endDate && <p>{formatDate(book.endDate)}</p>}
                {book.rating > 0 && (
                  <StarRatingDisplay value={book.rating} />
                )}
              </div>
            </button>
          ))
        )}
      </div>
      )}
    </div>
  );
}
