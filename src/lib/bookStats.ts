import type { Book, BookFormat, BookShelf } from "@/types";

export function getBookShelf(book: Book): BookShelf {
  if (book.startDate && !book.endDate) return "leyendo";
  if (book.endDate) return "terminado";
  return "deseos";
}

export function getFinishedThisYear(books: Book[]): Book[] {
  const year = new Date().getFullYear();
  return books.filter((b) => {
    if (!b.endDate) return false;
    return new Date(b.endDate).getFullYear() === year;
  });
}

export function getGenreStats(books: Book[]): { genre: string; count: number }[] {
  const map = books.reduce<Record<string, number>>((acc, b) => {
    b.genres.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.entries(map)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export function getFormatStats(books: Book[]): { format: string; count: number }[] {
  const map: Record<string, number> = {};
  books.forEach((b) => {
    b.format.forEach((f) => {
      map[f] = (map[f] || 0) + 1;
    });
  });
  const labels: Record<BookFormat, string> = {
    libro: "Libro físico",
    ebook: "Libro electrónico",
    audiolibro: "Audiolibro",
  };
  return Object.entries(map).map(([format, count]) => ({
    format: labels[format as BookFormat] || format,
    count,
  }));
}

export function getRatingDistribution(books: Book[]): number[] {
  return [1, 2, 3, 4, 5].map(
    (r) => books.filter((b) => b.rating > 0 && Math.round(b.rating) === r).length
  );
}

export function getMonthlyFinished(books: Book[]): number[] {
  const year = new Date().getFullYear();
  const months = Array(12).fill(0);
  books.forEach((b) => {
    if (!b.endDate) return;
    const d = new Date(b.endDate);
    if (d.getFullYear() === year) months[d.getMonth()]++;
  });
  return months;
}

export function getActivityDays(books: Book[]): Record<string, number> {
  const days: Record<string, number> = {};
  books.forEach((b) => {
    const dates = [b.endDate, b.startDate, b.updatedAt.split("T")[0]].filter(Boolean);
    dates.forEach((d) => {
      if (d) days[d] = (days[d] || 0) + 1;
    });
  });
  return days;
}

export function getTotalPages(books: Book[]): number {
  return books.filter((b) => b.endDate).reduce((s, b) => s + (b.pages || 0), 0);
}

export const MONTH_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
