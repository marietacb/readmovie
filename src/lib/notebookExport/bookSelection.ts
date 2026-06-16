import type { Book } from "@/types";

function yearFromDate(dateStr?: string): number | null {
  if (!dateStr) return null;
  const year = new Date(dateStr).getFullYear();
  return Number.isNaN(year) ? null : year;
}

/** Libros con actividad de lectura en el año (sesiones, inicio o fin). */
export function getBooksWithActivityInYear(books: Book[], year: number): Book[] {
  return books.filter((book) => {
    if (yearFromDate(book.startDate) === year) return true;
    if (yearFromDate(book.endDate) === year) return true;
    return (book.readingSessions ?? []).some(
      (session) => yearFromDate(session.date) === year,
    );
  });
}

/** Orden cronológico por fecha de inicio (más antiguo primero). */
export function sortBooksByStartDate(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const dateA = a.startDate ?? a.createdAt;
    const dateB = b.startDate ?? b.createdAt;
    return dateA.localeCompare(dateB);
  });
}

export function getBookSortDate(book: Book): string {
  return book.startDate ?? book.createdAt;
}
