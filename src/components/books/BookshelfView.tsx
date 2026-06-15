"use client";

import { useState } from "react";
import { Flower2, Leaf } from "lucide-react";
import { BookSpine } from "./BookSpine";
import type { Book } from "@/types";

interface BookshelfViewProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const BOOKS_PER_SHELF = 8;
const SHELF_COUNT = 4;

export function BookshelfView({ books, onBookClick }: BookshelfViewProps) {
  const [page, setPage] = useState(0);
  const booksPerPage = BOOKS_PER_SHELF * SHELF_COUNT;
  const totalPages = Math.max(1, Math.ceil(books.length / booksPerPage));
  const pageBooks = books.slice(page * booksPerPage, (page + 1) * booksPerPage);

  const shelves: Book[][] = Array.from({ length: SHELF_COUNT }, (_, i) =>
    pageBooks.slice(i * BOOKS_PER_SHELF, (i + 1) * BOOKS_PER_SHELF)
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="font-serif text-4xl font-bold text-[#2c4a6e]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Estantería
        </h1>
        {totalPages > 1 && (
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  page === i
                    ? "bg-[#4a6fa5] text-white"
                    : "bg-[#b8cfe8] text-[#2c4a6e] hover:bg-[#9bb8d4]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {books.length === 0 ? (
        <p className="text-center text-sm text-[#4a6fa5]/60">
          Tu estantería está vacía. Ve a «Reseñas» para añadir tu primera lectura.
        </p>
      ) : (
        <div className="relative space-y-16 py-4">
          {shelves.map((shelfBooks, shelfIndex) => (
            <div key={shelfIndex} className="relative">
              <div className="flex min-h-[100px] items-end gap-2 px-4 pb-2">
                {shelfBooks.map((book) => (
                  <BookSpine key={book.id} book={book} onClick={() => onBookClick(book)} />
                ))}
                {shelfIndex === 0 && shelfBooks.length > 0 && (
                  <Leaf className="ml-4 h-8 w-8 text-green-600/60" />
                )}
                {shelfIndex === 1 && (
                  <Flower2 className="ml-auto h-7 w-7 text-yellow-500/70" />
                )}
              </div>
              <div className="h-1 bg-black/80 shadow-md" />
              <div className="h-0.5 bg-black/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
