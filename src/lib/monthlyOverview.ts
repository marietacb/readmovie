import { isFiveStarRating } from "@/lib/ratings";
import { sessionPages } from "@/lib/readingStats";
import type { Book, Month } from "@/types";

const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"] as const;

export interface MonthlyOverviewRow {
  month: Month;
  roman: string;
  label: string;
  booksFinished: number;
  pagesRead: number;
  chaptersRead: number;
  fiveStars: number;
  ebook: number;
  physical: number;
  series: number;
}

export function isSagaBook(book: Book): boolean {
  if (book.seriesLabel?.trim()) return true;
  return book.storyType.some((t) => t !== "autoconclusivo");
}

function isInMonth(dateStr: string | undefined, year: number, month: number): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}

function chaptersReadInMonth(books: Book[], year: number, month: number): number {
  const touched = new Set<string>();

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      if (!isInMonth(session.date, year, month)) return;

      (book.chapters ?? []).forEach((chapter) => {
        if (chapter.startPage >= session.fromPage && chapter.startPage <= session.toPage) {
          touched.add(`${book.id}:${chapter.id}`);
        }
      });
    });

    if (
      isInMonth(book.endDate, year, month) &&
      (book.chapters ?? []).length === 0 &&
      book.totalChapters
    ) {
      touched.add(`${book.id}:total`);
    }
  });

  return touched.size;
}

function pagesReadInMonth(books: Book[], year: number, month: number): number {
  let total = 0;
  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      if (isInMonth(session.date, year, month)) {
        total += sessionPages(session);
      }
    });
  });
  return total;
}

function booksFinishedInMonth(books: Book[], year: number, month: number): Book[] {
  return books.filter((b) => isInMonth(b.endDate, year, month));
}

export function getMonthlyOverview(books: Book[], year: number): MonthlyOverviewRow[] {
  const monthLabels = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1) as Month;
    const finished = booksFinishedInMonth(books, year, month);

    return {
      month,
      roman: ROMAN_MONTHS[i],
      label: monthLabels[i],
      booksFinished: finished.length,
      pagesRead: pagesReadInMonth(books, year, month),
      chaptersRead: chaptersReadInMonth(books, year, month),
      fiveStars: finished.filter((b) => isFiveStarRating(b.rating)).length,
      ebook: finished.filter((b) => b.format.includes("ebook")).length,
      physical: finished.filter((b) => b.format.includes("libro")).length,
      series: finished.filter(isSagaBook).length,
    };
  });
}

export function getOverviewYears(books: Book[]): number[] {
  const years = new Set<number>([new Date().getFullYear()]);

  books.forEach((book) => {
    if (book.endDate) years.add(new Date(book.endDate).getFullYear());
    if (book.startDate) years.add(new Date(book.startDate).getFullYear());
    (book.readingSessions ?? []).forEach((s) => {
      years.add(new Date(s.date).getFullYear());
    });
  });

  return [...years].sort((a, b) => b - a);
}

export { ROMAN_MONTHS };
