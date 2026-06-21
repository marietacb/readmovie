"use client";

import { formatGenres } from "@/lib/genres";
import { getGenreSpineColor } from "@/lib/genreColors";
import type { Book } from "@/types";

const BOOKS_PER_SHELF = 14;

interface VisualBookshelfProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

function BookSpine({ book, onClick }: { book: Book; onClick: () => void }) {
  const color = getGenreSpineColor(book.genres, book.spineColor);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${book.title} — ${book.author}${book.genres.length ? ` (${formatGenres(book.genres)})` : ""}`}
      className="group relative flex h-36 w-8 shrink-0 flex-col items-center justify-end overflow-hidden rounded-sm border border-black/15 shadow-md transition-all hover:-translate-y-2 hover:shadow-lg sm:h-40 sm:w-9"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-x-0 top-0 h-3 bg-black/10" />
      <div className="absolute inset-y-4 left-1 w-px bg-white/25" />
      <p
        className="mb-3 max-h-[7.5rem] overflow-hidden px-1 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-bj-navy/80 [writing-mode:vertical-rl] rotate-180 sm:text-[10px]"
      >
        {book.title}
      </p>
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-bj-navy/90 px-1 py-1 transition-transform group-hover:translate-y-0">
        <p className="truncate text-[8px] text-white">{book.author}</p>
      </div>
    </button>
  );
}

export function VisualBookshelf({ books, onBookClick }: VisualBookshelfProps) {
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += BOOKS_PER_SHELF) {
    shelves.push(books.slice(i, i + BOOKS_PER_SHELF));
  }

  if (books.length === 0) {
    return (
      <div className="bj-shelf rounded-2xl py-16 text-center">
        <p className="text-sm text-bj-muted">Termina un libro para ver su lomo en la estantería</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {shelves.map((shelfBooks, shelfIndex) => (
        <div key={shelfIndex} className="bj-shelf rounded-2xl px-4 pb-2 pt-6 sm:px-6">
          <div className="flex min-h-[9rem] flex-wrap items-end gap-2 px-1 pb-4 sm:gap-3">
            {shelfBooks.map((book) => (
              <BookSpine key={book.id} book={book} onClick={() => onBookClick(book)} />
            ))}
          </div>
          <div className="bj-shelf-board" />
          <div className="bj-shelf-edge" />
        </div>
      ))}

      <div className="flex flex-wrap gap-3 text-xs text-bj-muted">
        <span className="font-semibold text-bj-navy">Leyenda de géneros:</span>
        {[
          { label: "Fantasy", color: "#B8D4C0" },
          { label: "Romance", color: "#E8C5D4" },
          { label: "Thriller", color: "#D4C5E8" },
          { label: "Intriga", color: "#E8D4B8" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-black/10" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
        <span className="text-bj-muted/70">Otros géneros → color automático</span>
      </div>
    </div>
  );
}
