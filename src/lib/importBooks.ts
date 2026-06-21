import { attachSessionsToBook, generateReadingSessionsFromBook, mergeSessionsIntoBook } from "@/lib/generateReadingSessions";
import { readGenresFromEntity } from "@/lib/genres";
import { buildSessionForPages, getLastPageBeforeDate } from "@/lib/readingStats";
import { clampBookRating } from "@/lib/ratings";
import { setMonthlyFavoriteForYear } from "@/lib/yearlyFavorites";
import { generateId, randomSpineColor } from "@/lib/utils";
import type {
  Book,
  BookFormat,
  MediaTrackerData,
  Month,
  StoryType,
  WishlistItem,
  YearlyMonthlyFavorites,
} from "@/types";

export interface ImportWishlistEntry {
  title: string;
  seriesLabel?: string;
  read?: boolean;
}

export interface ImportBookEntry {
  title: string;
  author?: string;
  pages?: number;
  totalChapters?: number;
  format?: BookFormat[];
  startDate?: string;
  endDate?: string;
  publisher?: string;
  genre?: string | string[];
  genres?: string[];
  originalNationality?: string;
  publishYear?: number;
  storyType?: StoryType[];
  seriesLabel?: string;
  characters?: string;
  opinion?: string;
  rating?: number;
  romanceRating?: number;
  hypeRating?: number;
  coverUrl?: string;
  /** Página alcanzada cada día consecutivo desde startDate (como en el cuaderno) */
  cumulativeDailyPages?: {
    startDate: string;
    toPages: number[];
  };
  /** Sesiones explícitas; si no hay, se generan desde fechas + páginas */
  readingSessions?: Array<{
    date: string;
    fromPage: number;
    toPage: number;
    note?: string;
  }>;
}

export interface NotebookImportPayload {
  year?: number;
  readingGoal?: number;
  /** Genera sesiones diarias desde startDate/endDate/pages (default: true) */
  generateReadingSessions?: boolean;
  /** Añade sesiones a libros que ya existían pero no tenían registro diario */
  backfillExisting?: boolean;
  wishlist?: ImportWishlistEntry[];
  /** Mes (1-12) → título del libro favorito (se resuelve tras importar) */
  monthlyFavorites?: Partial<Record<Month, string>>;
  books: ImportBookEntry[];
  /** Actualiza libros ya importados (sesiones 2026, fechas, etc.) */
  bookUpdates?: ImportBookUpdate[];
}

export interface ImportBookUpdate {
  title: string;
  author?: string;
  pages?: number;
  endDate?: string | null;
  clearEndDate?: boolean;
  rating?: number;
  readingSessions?: Array<{
    date: string;
    fromPage: number;
    toPage: number;
    note?: string;
  }>;
  /** Genera y añade sesiones entre dos fechas (libros en curso) */
  sessionsFromDates?: {
    startDate: string;
    endDate: string;
    pages: number;
  };
  /** Páginas por día (YYYY-MM-DD → páginas). Calcula from/to automáticamente. */
  dailyPages?: Record<string, number>;
  /** Página alcanzada en fechas concretas (permite días sin lectura entre medias) */
  datedToPages?: Array<{ date: string; toPage: number }>;
}

export interface ImportResult {
  booksImported: number;
  booksSkipped: number;
  wishlistImported: number;
  favoritesLinked: number;
  sessionsGenerated: number;
  sessionsBackfilled: number;
  booksUpdated: number;
}

function bookKey(title: string, author = ""): string {
  return `${title.trim().toLowerCase()}|${author.trim().toLowerCase()}`;
}

function buildBook(entry: ImportBookEntry, timestamp: string, withSessions: boolean): Book {
  const base: Book = {
    id: generateId(),
    title: entry.title.trim(),
    author: entry.author?.trim() || "Autor desconocido",
    pages: entry.pages,
    totalChapters: entry.totalChapters,
    format: entry.format?.length ? entry.format : ["libro"],
    startDate: entry.startDate,
    endDate: entry.endDate,
    publisher: entry.publisher,
    genres: readGenresFromEntity(entry),
    originalNationality: entry.originalNationality?.trim() || undefined,
    publishYear: entry.publishYear,
    storyType: entry.storyType?.length ? entry.storyType : ["autoconclusivo"],
    seriesLabel: entry.seriesLabel,
    characters: entry.characters,
    opinion: entry.opinion,
    rating: clampBookRating(entry.rating ?? 0),
    romanceRating: clampBookRating(entry.romanceRating ?? 0),
    hypeRating: clampBookRating(entry.hypeRating ?? 0),
    coverUrl: entry.coverUrl,
    spineColor: randomSpineColor(),
    chapters: [],
    readingSessions: [],
    quotes: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return withSessions ? attachSessionsToBook(base, entry) : base;
}

function findBookForUpdate(
  books: Book[],
  update: Pick<ImportBookUpdate, "title" | "author">
): Book | undefined {
  const key = bookKey(update.title, update.author ?? "");
  return books.find((b) => bookKey(b.title, b.author) === key)
    ?? books.find((b) => b.title.trim().toLowerCase() === update.title.trim().toLowerCase());
}

function applyDatedToPages(
  book: Book,
  entries: Array<{ date: string; toPage: number }>
): Book {
  let next = { ...book };
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((entry, index) => {
    const priorInBatch = index > 0 ? sorted[index - 1].toPage : getLastPageBeforeDate(next, entry.date);
    const fromPage = priorInBatch > 0 ? priorInBatch : 1;
    if (entry.toPage <= fromPage) return;

    const sessions = generateReadingSessionsFromBook({
      readingSessions: [{ date: entry.date, fromPage, toPage: entry.toPage }],
    });
    next = mergeSessionsIntoBook(next, sessions);
  });

  return next;
}

function applyDailyPagesToBook(book: Book, dailyPages: Record<string, number>): Book {
  let next = { ...book };
  Object.keys(dailyPages)
    .sort()
    .forEach((date) => {
      const pages = dailyPages[date];
      if (!pages || pages <= 0) return;
      const sessionData = buildSessionForPages(next, date, pages);
      if (!sessionData) return;
      const sessions = generateReadingSessionsFromBook({ readingSessions: [sessionData] });
      next = mergeSessionsIntoBook(next, sessions);
    });
  return next;
}

function applyBookUpdate(book: Book, update: ImportBookUpdate): Book {
  let next = { ...book };

  if (update.sessionsFromDates) {
    const { startDate, endDate, pages } = update.sessionsFromDates;
    const sessions = generateReadingSessionsFromBook({ startDate, endDate, pages });
    next = mergeSessionsIntoBook(next, sessions);
  }

  if (update.dailyPages) {
    next = applyDailyPagesToBook(next, update.dailyPages);
  }

  if (update.datedToPages?.length) {
    next = applyDatedToPages(next, update.datedToPages);
  }

  if (update.readingSessions?.length) {
    const sessions = generateReadingSessionsFromBook({ readingSessions: update.readingSessions });
    next = mergeSessionsIntoBook(next, sessions);
  }

  if (update.clearEndDate || update.endDate === null) {
    next = { ...next, endDate: undefined };
  } else if (update.endDate) {
    next.endDate = update.endDate;
  }
  if (typeof update.rating === "number") next.rating = clampBookRating(update.rating);
  if (typeof update.pages === "number") next.pages = update.pages;

  return next;
}

function findBookByTitle(books: Book[], title: string): Book | undefined {
  const normalized = title.trim().toLowerCase();
  return books.find((b) => b.title.trim().toLowerCase() === normalized);
}

function parseBookUpdates(raw: unknown): ImportBookUpdate[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  return raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const title = String(item.title ?? "").trim();
      if (!title) throw new Error("Cada bookUpdate necesita un 'title'.");
      const sessionsFromDates =
        item.sessionsFromDates && typeof item.sessionsFromDates === "object"
          ? {
              startDate: String((item.sessionsFromDates as Record<string, unknown>).startDate ?? ""),
              endDate: String((item.sessionsFromDates as Record<string, unknown>).endDate ?? ""),
              pages: Number((item.sessionsFromDates as Record<string, unknown>).pages ?? 0),
            }
          : undefined;

      const dailyPages: Record<string, number> = {};
      if (item.dailyPages && typeof item.dailyPages === "object") {
        Object.entries(item.dailyPages as Record<string, unknown>).forEach(([date, pages]) => {
          const value = Number(pages);
          if (date && Number.isFinite(value) && value > 0) {
            dailyPages[date.slice(0, 10)] = value;
          }
        });
      }

      const datedToPages = Array.isArray(item.datedToPages)
        ? item.datedToPages
            .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
            .map((row) => ({
              date: String(row.date ?? "").slice(0, 10),
              toPage: Number(row.toPage ?? 0),
            }))
            .filter((row) => row.date && row.toPage > 0)
        : undefined;

      return {
        title,
        author: item.author ? String(item.author) : undefined,
        pages: typeof item.pages === "number" ? item.pages : undefined,
        endDate:
          item.endDate === null
            ? null
            : item.endDate
              ? String(item.endDate)
              : undefined,
        clearEndDate: Boolean(item.clearEndDate),
        rating: typeof item.rating === "number" ? item.rating : undefined,
        readingSessions: Array.isArray(item.readingSessions)
          ? item.readingSessions
              .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
              .map((s) => ({
                date: String(s.date ?? ""),
                fromPage: Number(s.fromPage ?? 0),
                toPage: Number(s.toPage ?? 0),
                note: s.note ? String(s.note) : undefined,
              }))
              .filter((s) => s.date && s.toPage > s.fromPage)
          : undefined,
        sessionsFromDates:
          sessionsFromDates?.startDate && sessionsFromDates.endDate && sessionsFromDates.pages > 0
            ? sessionsFromDates
            : undefined,
        dailyPages: Object.keys(dailyPages).length ? dailyPages : undefined,
        datedToPages: datedToPages?.length ? datedToPages : undefined,
      } satisfies ImportBookUpdate;
    });
}

export function parseNotebookImport(raw: unknown): NotebookImportPayload {
  if (!raw || typeof raw !== "object") {
    throw new Error("El JSON debe ser un objeto con un array 'books'.");
  }

  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.books)) {
    throw new Error("Falta el array 'books' en el JSON.");
  }

  const books = data.books
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const title = String(item.title ?? "").trim();
      if (!title) throw new Error("Cada libro necesita al menos un 'title'.");
      return {
        title,
        author: item.author ? String(item.author) : undefined,
        pages: typeof item.pages === "number" ? item.pages : undefined,
        totalChapters: typeof item.totalChapters === "number" ? item.totalChapters : undefined,
        format: Array.isArray(item.format) ? (item.format as BookFormat[]) : undefined,
        startDate: item.startDate ? String(item.startDate) : undefined,
        endDate: item.endDate ? String(item.endDate) : undefined,
        publisher: item.publisher ? String(item.publisher) : undefined,
        genres: readGenresFromEntity({
          genres: item.genres,
          genre: item.genre,
        }),
        originalNationality: item.originalNationality
          ? String(item.originalNationality)
          : undefined,
        publishYear: typeof item.publishYear === "number" ? item.publishYear : undefined,
        storyType: Array.isArray(item.storyType) ? (item.storyType as StoryType[]) : undefined,
        seriesLabel: item.seriesLabel ? String(item.seriesLabel) : undefined,
        characters: item.characters ? String(item.characters) : undefined,
        opinion: item.opinion ? String(item.opinion) : undefined,
        rating: typeof item.rating === "number" ? item.rating : undefined,
        romanceRating: typeof item.romanceRating === "number" ? item.romanceRating : undefined,
        hypeRating: typeof item.hypeRating === "number" ? item.hypeRating : undefined,
        coverUrl: item.coverUrl ? String(item.coverUrl) : undefined,
        readingSessions: Array.isArray(item.readingSessions)
          ? item.readingSessions
              .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
              .map((s) => ({
                date: String(s.date ?? ""),
                fromPage: Number(s.fromPage ?? 0),
                toPage: Number(s.toPage ?? 0),
                note: s.note ? String(s.note) : undefined,
              }))
              .filter((s) => s.date && s.toPage > s.fromPage)
          : undefined,
        cumulativeDailyPages:
          item.cumulativeDailyPages && typeof item.cumulativeDailyPages === "object"
            ? {
                startDate: String(
                  (item.cumulativeDailyPages as Record<string, unknown>).startDate ?? ""
                ),
                toPages: Array.isArray(
                  (item.cumulativeDailyPages as Record<string, unknown>).toPages
                )
                  ? (
                      (item.cumulativeDailyPages as Record<string, unknown>).toPages as unknown[]
                    )
                      .map((page) => Number(page))
                      .filter((page) => Number.isFinite(page) && page > 0)
                  : [],
              }
            : undefined,
      } satisfies ImportBookEntry;
    });

  const wishlist = Array.isArray(data.wishlist)
    ? data.wishlist
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          title: String(item.title ?? "").trim(),
          seriesLabel: item.seriesLabel ? String(item.seriesLabel) : undefined,
          read: Boolean(item.read),
        }))
        .filter((item) => item.title)
    : undefined;

  const monthlyFavorites: Partial<Record<Month, string>> = {};
  if (data.monthlyFavorites && typeof data.monthlyFavorites === "object") {
    Object.entries(data.monthlyFavorites as Record<string, unknown>).forEach(([month, title]) => {
      const m = Number(month);
      if (m >= 1 && m <= 12 && typeof title === "string" && title.trim()) {
        monthlyFavorites[m as Month] = title.trim();
      }
    });
  }

  return {
    year: typeof data.year === "number" ? data.year : undefined,
    readingGoal: typeof data.readingGoal === "number" ? data.readingGoal : undefined,
    generateReadingSessions: data.generateReadingSessions !== false,
    backfillExisting: Boolean(data.backfillExisting),
    wishlist,
    monthlyFavorites: Object.keys(monthlyFavorites).length ? monthlyFavorites : undefined,
    books,
    bookUpdates: parseBookUpdates(data.bookUpdates),
  };
}

export function applyNotebookImport(
  data: MediaTrackerData,
  payload: NotebookImportPayload
): { data: MediaTrackerData; result: ImportResult } {
  const timestamp = new Date().toISOString();
  const year = payload.year ?? new Date().getFullYear();
  const withSessions = payload.generateReadingSessions !== false;
  const existingKeys = new Set(data.books.map((b) => bookKey(b.title, b.author)));

  const newBooks: Book[] = [];
  let booksSkipped = 0;
  let sessionsBackfilled = 0;

  let updatedBooks = [...data.books];

  if (payload.backfillExisting) {
    updatedBooks = updatedBooks.map((book) => {
      const entry = payload.books.find(
        (e) => bookKey(e.title, e.author ?? "") === bookKey(book.title, book.author)
      );
      if (!entry) return book;
      const withBackfill = attachSessionsToBook(book, entry);
      if (withBackfill.readingSessions.length > book.readingSessions.length) {
        sessionsBackfilled += 1;
        return withBackfill;
      }
      return book;
    });
  }

  let booksUpdated = 0;
  payload.bookUpdates?.forEach((update) => {
    const index = updatedBooks.findIndex((b) => findBookForUpdate([b], update));
    if (index < 0) return;
    const before = updatedBooks[index];
    const merged = applyBookUpdate(before, update);
    if (
      merged.readingSessions.length !== before.readingSessions.length
      || merged.endDate !== before.endDate
      || merged.rating !== before.rating
      || merged.pages !== before.pages
    ) {
      updatedBooks[index] = merged;
      booksUpdated += 1;
    }
  });

  payload.books.forEach((entry) => {
    const key = bookKey(entry.title, entry.author ?? "");
    if (existingKeys.has(key)) {
      booksSkipped += 1;
      return;
    }
    existingKeys.add(key);
    newBooks.push(buildBook(entry, timestamp, withSessions));
  });

  const allBooks = [...updatedBooks, ...newBooks];
  const sessionsGenerated = newBooks.reduce((sum, book) => sum + book.readingSessions.length, 0);
  const wishlistYearTs =
    year === new Date().getFullYear()
      ? timestamp
      : new Date(year, 5, 15, 12, 0, 0).toISOString();

  const existingWishlistTitles = new Set(
    data.wishlist
      .filter((item) => new Date(item.createdAt).getFullYear() === year)
      .map((item) => item.title.trim().toLowerCase())
  );

  const newWishlist: WishlistItem[] = [];
  payload.wishlist?.forEach((entry) => {
    const titleKey = entry.title.trim().toLowerCase();
    if (existingWishlistTitles.has(titleKey)) return;
    existingWishlistTitles.add(titleKey);

    const linkedBook = findBookByTitle(allBooks, entry.title);
    newWishlist.push({
      id: generateId(),
      title: entry.title,
      seriesLabel: entry.seriesLabel,
      read: entry.read ?? Boolean(linkedBook?.endDate),
      bookId: linkedBook?.id,
      createdAt: wishlistYearTs,
      updatedAt: wishlistYearTs,
    });
  });

  let monthlyFavorites: YearlyMonthlyFavorites = data.monthlyFavorites;
  let favoritesLinked = 0;
  if (payload.monthlyFavorites) {
    Object.entries(payload.monthlyFavorites).forEach(([month, title]) => {
      const book = findBookByTitle(allBooks, title);
      if (!book) return;
      monthlyFavorites = setMonthlyFavoriteForYear(
        monthlyFavorites,
        year,
        Number(month) as Month,
        book.id
      );
      favoritesLinked += 1;
    });
  }

  return {
    data: {
      ...data,
      books: allBooks,
      wishlist: [...data.wishlist, ...newWishlist],
      monthlyFavorites,
      readingGoal: payload.readingGoal ?? data.readingGoal,
    },
    result: {
      booksImported: newBooks.length,
      booksSkipped,
      wishlistImported: newWishlist.length,
      favoritesLinked,
      sessionsGenerated,
      sessionsBackfilled,
      booksUpdated,
    },
  };
}
