import { sessionPages } from "@/lib/readingStats";
import type { Book, Movie, Series } from "@/types";

export type ActivityKind = "book" | "movie" | "series";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  date: string;
  title: string;
  subtitle?: string;
  detail?: string;
  bookId?: string;
  movieId?: string;
  seriesId?: string;
}

export type ActivityFilter = "all" | ActivityKind;

function dateKey(value: string): string {
  return value.slice(0, 10);
}

export function getActivityEvents(
  books: Book[],
  movies: Movie[],
  series: Series[]
): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      const pages = sessionPages(session);
      if (pages <= 0) return;
      events.push({
        id: `book-session-${session.id}`,
        kind: "book",
        date: dateKey(session.date),
        title: book.title,
        subtitle: book.author,
        detail: `${pages} págs.`,
        bookId: book.id,
      });
    });

    if (book.endDate) {
      events.push({
        id: `book-finished-${book.id}`,
        kind: "book",
        date: dateKey(book.endDate),
        title: book.title,
        subtitle: book.author,
        detail: "Libro terminado",
        bookId: book.id,
      });
    }
  });

  movies.forEach((movie) => {
    const logs = movie.watchLogs ?? [];

    if (logs.length > 0) {
      logs.forEach((log) => {
        events.push({
          id: `movie-watch-${log.id}`,
          kind: "movie",
          date: dateKey(log.date),
          title: movie.title,
          subtitle: movie.director,
          detail: `Visionado${log.note ? ` · ${log.note}` : ""}${movie.rating > 0 ? ` · ${movie.rating}★` : ""}`,
          movieId: movie.id,
        });
      });
      return;
    }

    const watchDate = movie.watchDate ?? movie.createdAt.slice(0, 10);
    if (movie.watchDate || movie.rating > 0) {
      events.push({
        id: `movie-${movie.id}`,
        kind: "movie",
        date: dateKey(watchDate),
        title: movie.title,
        subtitle: movie.director,
        detail: movie.rating > 0 ? `${movie.rating}★` : "Vista",
        movieId: movie.id,
      });
    }
  });

  series.forEach((item) => {
    (item.episodeWatchLogs ?? []).forEach((log) => {
      events.push({
        id: `series-ep-${log.id}`,
        kind: "series",
        date: dateKey(log.date),
        title: item.title,
        subtitle: item.creator,
        detail: `T${log.season} E${log.episode}${log.note ? ` · ${log.note}` : ""}`,
        seriesId: item.id,
      });
    });

    if (item.startDate) {
      events.push({
        id: `series-start-${item.id}`,
        kind: "series",
        date: dateKey(item.startDate),
        title: item.title,
        subtitle: item.creator,
        detail: "Empezaste la serie",
        seriesId: item.id,
      });
    }
    if (item.endDate) {
      events.push({
        id: `series-end-${item.id}`,
        kind: "series",
        date: dateKey(item.endDate),
        title: item.title,
        subtitle: item.creator,
        detail: item.status === "completed" ? "Serie terminada" : "Último episodio",
        seriesId: item.id,
      });
    }
  });

  return events.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function filterActivityEvents(
  events: ActivityEvent[],
  filter: ActivityFilter
): ActivityEvent[] {
  if (filter === "all") return events;
  return events.filter((event) => event.kind === filter);
}

export function getEventsForDate(events: ActivityEvent[], date: string): ActivityEvent[] {
  const key = dateKey(date);
  return events.filter((event) => event.date === key);
}

export function getActivityYears(events: ActivityEvent[]): number[] {
  const years = new Set<number>([new Date().getFullYear()]);
  events.forEach((event) => years.add(new Date(event.date).getFullYear()));
  return [...years].sort((a, b) => b - a);
}

export function getMonthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const m = String(month).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    cells.push(`${year}-${m}-${d}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  book: "Libro",
  movie: "Película",
  series: "Serie",
};

export const ACTIVITY_KIND_COLORS: Record<ActivityKind, string> = {
  book: "bg-bj-terracotta",
  movie: "bg-bj-navy",
  series: "bg-bj-sage",
};
