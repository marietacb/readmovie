import { clampBookRating } from "@/lib/ratings";
import type { Book } from "@/types";

export function normalizeBook(book: Book): Book {
  return {
    ...book,
    totalChapters: book.totalChapters ?? undefined,
    seriesLabel: book.seriesLabel ?? undefined,
    chapters: book.chapters ?? [],
    readingSessions: book.readingSessions ?? [],
    quotes: book.quotes ?? [],
    rating: clampBookRating(book.rating ?? 0),
    romanceRating: clampBookRating(book.romanceRating ?? 0),
    hypeRating: clampBookRating(book.hypeRating ?? 0),
  };
}

export function normalizeBooks(books: Book[]): Book[] {
  return books.map(normalizeBook);
}
