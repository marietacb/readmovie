"use client";

import { useMemo } from "react";
import { MONTH_NAMES } from "@/lib/constants";
import type { Book, Month, MonthlyFavorites } from "@/types";

interface MonthlyFavoritesViewProps {
  books: Book[];
  year: number;
  monthlyFavorites: MonthlyFavorites;
  onSelect: (month: Month, bookId: string | null) => void;
  onBookClick: (book: Book) => void;
}

export function MonthlyFavoritesView({
  books,
  year,
  monthlyFavorites,
  onSelect,
  onBookClick,
}: MonthlyFavoritesViewProps) {
  const months = useMemo(
    () => Object.keys(MONTH_NAMES).map(Number) as Month[],
    []
  );

  const booksForYear = useMemo(
    () =>
      books.filter((book) => {
        if (book.endDate && new Date(book.endDate).getFullYear() === year) return true;
        if (book.startDate && new Date(book.startDate).getFullYear() === year) return true;
        return (book.readingSessions ?? []).some(
          (session) => new Date(session.date).getFullYear() === year
        );
      }),
    [books, year]
  );

  const selectableBooks = booksForYear.length > 0 ? booksForYear : books;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-bj-navy">Favoritos del mes</h1>
        <p className="mt-1 text-sm text-bj-muted">
          Elige el libro destacado de cada mes de {year}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {months.map((month) => {
          const bookId = monthlyFavorites[month];
          const book = bookId ? books.find((b) => b.id === bookId) : null;

          return (
            <div key={month} className="rounded-xl border border-bj-border bg-bj-surface/30 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-bj-navy">
                {MONTH_NAMES[month]}
              </span>
              <button
                onClick={() => book && onBookClick(book)}
                className="mt-2 flex h-32 w-full flex-col items-center justify-center rounded-lg border border-bj-border bg-white transition-colors hover:border-bj-navy/20 hover:shadow-sm"
              >
                {book ? (
                  <>
                    <div
                      className="mb-2 h-20 w-14 overflow-hidden rounded-md border border-bj-border shadow-sm"
                      style={{ backgroundColor: book.spineColor }}
                    >
                      {book.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="max-w-full truncate px-2 text-xs font-medium text-bj-navy">
                      {book.title}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-bj-muted/50">Sin asignar</span>
                )}
              </button>
              <select
                value={bookId ?? ""}
                onChange={(e) => onSelect(month, e.target.value || null)}
                className="bj-input mt-2 text-xs"
              >
                <option value="">— Elegir libro —</option>
                {selectableBooks.map((b) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
