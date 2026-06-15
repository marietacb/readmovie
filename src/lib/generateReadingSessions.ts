import { generateId } from "@/lib/utils";
import type { ImportBookEntry } from "@/lib/importBooks";
import type { Book, ReadingSession } from "@/types";

export interface ImportReadingSession {
  date: string;
  fromPage: number;
  toPage: number;
  note?: string;
}

function parseDateOnly(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function listDatesInclusive(startDate: string, endDate: string): string[] {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (end < start) return [];

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(formatDateOnly(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function buildSessionsFromCumulative(
  startDate: string,
  toPages: number[]
): ReadingSession[] {
  const start = parseDateOnly(startDate);

  return toPages
    .map((toPage, index) => {
      const fromPage = index === 0 ? 1 : toPages[index - 1];
      if (toPage <= fromPage) return null;

      const date = new Date(start);
      date.setDate(date.getDate() + index);

      return {
        id: generateId(),
        date: formatDateOnly(date),
        fromPage,
        toPage,
      };
    })
    .filter((session): session is ReadingSession => session !== null);
}

/** Reparte las páginas del libro entre los días de lectura (para Pixels + Overview) */
export function generateReadingSessionsFromBook(
  entry: Pick<ImportBookEntry, "startDate" | "endDate" | "pages" | "cumulativeDailyPages"> & {
    readingSessions?: ImportReadingSession[];
  }
): ReadingSession[] {
  if (entry.readingSessions?.length) {
    return entry.readingSessions.map((session) => ({
      id: generateId(),
      date: session.date.slice(0, 10),
      fromPage: session.fromPage,
      toPage: session.toPage,
      note: session.note,
    }));
  }

  if (entry.cumulativeDailyPages?.toPages?.length) {
    return buildSessionsFromCumulative(
      entry.cumulativeDailyPages.startDate,
      entry.cumulativeDailyPages.toPages
    );
  }

  if (!entry.startDate || !entry.endDate || !entry.pages || entry.pages <= 0) {
    return [];
  }

  const days = listDatesInclusive(entry.startDate, entry.endDate);
  if (days.length === 0) return [];

  const base = Math.floor(entry.pages / days.length);
  let remainder = entry.pages % days.length;
  let fromPage = 1;
  const sessions: ReadingSession[] = [];

  days.forEach((date) => {
    const pagesToday = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    if (pagesToday <= 0) return;

    const toPage = fromPage + pagesToday - 1;
    sessions.push({
      id: generateId(),
      date,
      fromPage,
      toPage,
    });
    fromPage = toPage + 1;
  });

  return sessions;
}

export function mergeSessionsIntoBook(book: Book, incoming: ReadingSession[]): Book {
  if (incoming.length === 0) return book;

  const byDate = new Map(book.readingSessions.map((s) => [s.date, s]));
  incoming.forEach((session) => byDate.set(session.date, session));

  return {
    ...book,
    readingSessions: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function attachSessionsToBook(book: Book, entry: ImportBookEntry): Book {
  const sessions = generateReadingSessionsFromBook(entry);
  if (sessions.length === 0) return book;
  if (book.readingSessions.length > 0) return mergeSessionsIntoBook(book, sessions);
  return { ...book, readingSessions: sessions };
}
