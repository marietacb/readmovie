import type { Book, BookQuote, ChapterMarker, ReadingSession } from "@/types";

export function sessionPages(session: ReadingSession): number {
  return Math.max(0, session.toPage - session.fromPage);
}

export function getCurrentPage(book: Book): number {
  if (!book.readingSessions?.length) return 0;
  return Math.max(...book.readingSessions.map((s) => s.toPage));
}

export function getTotalPagesRead(book: Book): number {
  return (book.readingSessions ?? []).reduce((sum, s) => sum + sessionPages(s), 0);
}

export function getChapterAtPage(
  chapters: ChapterMarker[],
  page: number
): ChapterMarker | undefined {
  const sorted = [...chapters].sort((a, b) => b.startPage - a.startPage);
  return sorted.find((c) => page >= c.startPage);
}

export function getChaptersInRange(
  chapters: ChapterMarker[],
  fromPage: number,
  toPage: number
): ChapterMarker[] {
  return chapters.filter((c) => c.startPage >= fromPage && c.startPage <= toPage);
}

export interface MonthlyReadingStats {
  totalPages: number;
  daysRead: number;
  sessionsCount: number;
  quotesCount: number;
  booksTouched: number;
  sessions: { book: Book; session: ReadingSession }[];
  quotes: { book: Book; quote: BookQuote }[];
  pagesByDay: { date: string; pages: number }[];
}

export function getMonthlyReadingStats(
  books: Book[],
  year: number,
  month: number
): MonthlyReadingStats {
  const sessions: { book: Book; session: ReadingSession }[] = [];
  const quotes: { book: Book; quote: BookQuote }[] = [];
  const dayPages: Record<string, number> = {};
  const daysSet = new Set<string>();
  const booksSet = new Set<string>();

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      const d = new Date(session.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        sessions.push({ book, session });
        const pages = sessionPages(session);
        dayPages[session.date] = (dayPages[session.date] || 0) + pages;
        daysSet.add(session.date);
        booksSet.add(book.id);
      }
    });
    (book.quotes ?? []).forEach((quote) => {
      const d = new Date(quote.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        quotes.push({ book, quote });
      }
    });
  });

  const pagesByDay = Object.entries(dayPages)
    .map(([date, pages]) => ({ date, pages }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalPages: pagesByDay.reduce((s, d) => s + d.pages, 0),
    daysRead: daysSet.size,
    sessionsCount: sessions.length,
    quotesCount: quotes.length,
    booksTouched: booksSet.size,
    sessions,
    quotes,
    pagesByDay,
  };
}

export function getLastPageBeforeDate(book: Book, date: string): number {
  const prior = (book.readingSessions ?? []).filter((s) => s.date < date);
  if (!prior.length) return 0;
  return Math.max(...prior.map((s) => s.toPage));
}

export function buildSessionForPages(
  book: Book,
  date: string,
  pages: number
): Omit<ReadingSession, "id"> | null {
  if (pages <= 0) return null;
  const fromPage = getLastPageBeforeDate(book, date) || 1;
  return { date, fromPage, toPage: fromPage + pages };
}

export function formatDateES(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
