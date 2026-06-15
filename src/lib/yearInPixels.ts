import type { Book, ReadingSession } from "@/types";
import { sessionPages } from "@/lib/readingStats";
import type { PixelLegendBand } from "@/lib/pixelLegends";

export type { PixelLegendBand } from "@/lib/pixelLegends";
export {
  DEFAULT_PIXEL_LEGEND_2025,
  DEFAULT_PIXEL_LEGEND_2026,
  getDefaultLegendForYear,
  getPixelBand,
  getPixelColor,
  resolvePixelLegend,
} from "@/lib/pixelLegends";

export const MONTH_INITIALS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as const;

export function getPagesByDateForYear(books: Book[], year: number): Record<string, number> {
  const byDate: Record<string, number> = {};

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      const d = new Date(session.date);
      if (d.getFullYear() !== year) return;
      const key = session.date.slice(0, 10);
      byDate[key] = (byDate[key] || 0) + sessionPages(session);
    });
  });

  return byDate;
}

export function isValidCalendarDay(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function dateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function getPixelStructuralClass(valid: boolean, pages: number): string {
  if (!valid) return "bg-transparent";
  if (pages <= 0) return "bg-bj-cream border border-bj-border/40";
  return "";
}

/** @deprecated Usa getPixelColor + estilo inline */
export function getPixelClassName(
  pages: number,
  valid: boolean,
  bands?: PixelLegendBand[]
): string {
  void bands;
  return getPixelStructuralClass(valid, pages);
}

export function getAvailableYears(books: Book[]): number[] {
  const years = new Set<number>([new Date().getFullYear()]);

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      years.add(new Date(session.date).getFullYear());
    });
    if (book.startDate) years.add(new Date(book.startDate).getFullYear());
    if (book.endDate) years.add(new Date(book.endDate).getFullYear());
  });

  return [...years].sort((a, b) => b - a);
}

export interface YearPixelCell {
  month: number;
  day: number;
  valid: boolean;
  pages: number;
  date: string;
  finishedBooks: { id: string; title: string }[];
}

export interface DayReadingEntry {
  book: Book;
  session: ReadingSession;
  pages: number;
}

export function getBooksFinishedOnDate(books: Book[], date: string): Book[] {
  const key = date.slice(0, 10);
  return books.filter((book) => book.endDate?.slice(0, 10) === key);
}

export function getSessionsForDate(books: Book[], date: string): DayReadingEntry[] {
  const key = date.slice(0, 10);
  const entries: DayReadingEntry[] = [];

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      if (session.date.slice(0, 10) !== key) return;
      entries.push({ book, session, pages: sessionPages(session) });
    });
  });

  return entries.sort((a, b) => a.book.title.localeCompare(b.book.title));
}

export function buildYearPixelGrid(books: Book[], year: number): YearPixelCell[][] {
  const byDate = getPagesByDateForYear(books, year);

  return Array.from({ length: 31 }, (_, dayIndex) => {
    const day = dayIndex + 1;
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const month = monthIndex + 1;
      const valid = isValidCalendarDay(year, month, day);
      const date = dateKey(year, month, day);
      const finished = valid ? getBooksFinishedOnDate(books, date) : [];
      return {
        month,
        day,
        valid,
        pages: valid ? byDate[date] ?? 0 : 0,
        date,
        finishedBooks: finished.map((book) => ({ id: book.id, title: book.title })),
      };
    });
  });
}
