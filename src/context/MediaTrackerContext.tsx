"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { pickBracketWinner, emptyBracket, invalidateBracketForMonth, type BracketRound } from "@/lib/bookOfYear";
import { getBracketForYear, removeBookFromYearlyBrackets, setBracketForYear } from "@/lib/yearlyBrackets";
import {
  getMonthlyFavoritesForYear,
  removeBookFromYearlyFavorites,
  setMonthlyFavoriteForYear,
} from "@/lib/yearlyFavorites";
import { sanitizeBandsForSave } from "@/lib/pixelLegends";
import {
  setNotebookExportSettingsForYear,
} from "@/lib/notebookExport/settings";
import { applyNotebookImport, type ImportResult, type NotebookImportPayload } from "@/lib/importBooks";
import { generateId, randomSpineColor } from "@/lib/utils";
import { getStorageService, usesCloudStorage } from "@/services/storage";
import { migrateLocalStorageToSupabase } from "@/services/supabaseStorage";
import type {
  Book,
  BookOfYearBracket,
  BookQuote,
  MediaTrackerData,
  Month,
  MonthlyFavorites,
  Movie,
  MovieFeeling,
  ReadingSession,
  Series,
  WishlistItem,
  PixelLegendBand,
  YearlyBookOfYearBrackets,
  YearlyMonthlyFavorites,
  YearlyPixelLegends,
  YearlyNotebookExportSettings,
  NotebookExportSettings,
} from "@/types";

interface MediaTrackerContextValue {
  books: Book[];
  movies: Movie[];
  series: Series[];
  wishlist: WishlistItem[];
  monthlyFavorites: YearlyMonthlyFavorites;
  bookOfYearBrackets: YearlyBookOfYearBrackets;
  yearPixelLegends: YearlyPixelLegends;
  notebookExportSettings: YearlyNotebookExportSettings;
  readingGoal: number;
  isLoaded: boolean;
  isCloudSync: boolean;
  addBook: (book: Omit<Book, "id" | "createdAt" | "updatedAt" | "spineColor">) => Book;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBook: (id: string) => Book | undefined;
  addWishlistItem: (title: string, seriesLabel?: string, year?: number) => WishlistItem;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  linkWishlistToBook: (wishlistId: string, bookId: string) => void;
  addMovie: (movie: Omit<Movie, "id" | "createdAt" | "updatedAt">) => Movie;
  updateMovie: (id: string, updates: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  getMovie: (id: string) => Movie | undefined;
  addSeries: (series: Omit<Series, "id" | "createdAt" | "updatedAt">) => Series;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
  getSeries: (id: string) => Series | undefined;
  setMonthlyFavorite: (year: number, month: Month, bookId: string | null) => void;
  setBracketWinner: (year: number, round: BracketRound, index: number, winnerId: string) => void;
  resetBookOfYearBracket: (year: number) => void;
  getMonthlyFavoritesForYear: (year: number) => MonthlyFavorites;
  getBookOfYearBracket: (year: number) => BookOfYearBracket;
  setReadingGoal: (goal: number) => void;
  setPixelLegendForYear: (year: number, bands: PixelLegendBand[]) => void;
  resetPixelLegendForYear: (year: number) => void;
  setNotebookExportSettings: (year: number, settings: NotebookExportSettings) => void;
  importNotebook: (payload: NotebookImportPayload) => ImportResult;
  addReadingSession: (bookId: string, session: Omit<ReadingSession, "id">) => void;
  updateReadingSession: (
    bookId: string,
    sessionId: string,
    updates: Partial<Omit<ReadingSession, "id">>
  ) => void;
  removeReadingSession: (bookId: string, sessionId: string) => void;
  addBookQuote: (bookId: string, quote: Omit<BookQuote, "id" | "createdAt">) => void;
  removeBookQuote: (bookId: string, quoteId: string) => void;
}

const MediaTrackerContext = createContext<MediaTrackerContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 600;

export function MediaTrackerProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<MediaTrackerData>({
    books: [],
    movies: [],
    series: [],
    wishlist: [],
    monthlyFavorites: {},
    bookOfYearBrackets: {},
    yearPixelLegends: {},
    notebookExportSettings: {},
    readingGoal: 24,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageRef = useRef(getStorageService(user?.id));

  const isCloudSync = usesCloudStorage(user?.id);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function loadData() {
      setIsLoaded(false);
      storageRef.current = getStorageService(user?.id);

      if (user?.id) {
        await migrateLocalStorageToSupabase(user.id);
      }

      try {
        const loaded = await storageRef.current.load();
        if (!cancelled) {
          setData(loaded);
          setIsLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setData({
            books: [],
            movies: [],
            series: [],
            wishlist: [],
            monthlyFavorites: {},
            bookOfYearBrackets: {},
            yearPixelLegends: {},
            notebookExportSettings: {},
            readingGoal: 24,
          });
          setIsLoaded(true);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      storageRef.current.save(data).catch(() => {
        // El guardado falló; los datos siguen en memoria
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data, isLoaded]);

  const addBook = useCallback(
    (book: Omit<Book, "id" | "createdAt" | "updatedAt" | "spineColor">): Book => {
      const now = new Date().toISOString();
      const newBook: Book = {
        ...book,
        chapters: book.chapters ?? [],
        readingSessions: book.readingSessions ?? [],
        quotes: book.quotes ?? [],
        id: generateId(),
        spineColor: randomSpineColor(),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({ ...prev, books: [...prev.books, newBook] }));
      return newBook;
    },
    []
  );

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString() }
          : b
      ),
    }));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
      wishlist: prev.wishlist.map((w) =>
        w.bookId === id
          ? { ...w, read: false, bookId: undefined, updatedAt: new Date().toISOString() }
          : w
      ),
      monthlyFavorites: removeBookFromYearlyFavorites(prev.monthlyFavorites, id),
      bookOfYearBrackets: removeBookFromYearlyBrackets(prev.bookOfYearBrackets, id),
    }));
  }, []);

  const getBook = useCallback(
    (id: string) => data.books.find((b) => b.id === id),
    [data.books]
  );

  const addWishlistItem = useCallback((title: string, seriesLabel?: string, year?: number): WishlistItem => {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const timestamp =
      targetYear === now.getFullYear()
        ? now.toISOString()
        : new Date(targetYear, 5, 15, 12, 0, 0).toISOString();
    const item: WishlistItem = {
      id: generateId(),
      title,
      seriesLabel,
      read: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setData((prev) => ({ ...prev, wishlist: [...prev.wishlist, item] }));
    return item;
  }, []);

  const updateWishlistItem = useCallback((id: string, updates: Partial<WishlistItem>) => {
    setData((prev) => ({
      ...prev,
      wishlist: prev.wishlist.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
    }));
  }, []);

  const deleteWishlistItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
  }, []);

  const linkWishlistToBook = useCallback((wishlistId: string, bookId: string) => {
    setData((prev) => ({
      ...prev,
      wishlist: prev.wishlist.map((w) =>
        w.id === wishlistId
          ? { ...w, read: true, bookId, updatedAt: new Date().toISOString() }
          : w
      ),
    }));
  }, []);

  const addMovie = useCallback(
    (movie: Omit<Movie, "id" | "createdAt" | "updatedAt">): Movie => {
      const now = new Date().toISOString();
      const newMovie: Movie = {
        ...movie,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({ ...prev, movies: [...prev.movies, newMovie] }));
      return newMovie;
    },
    []
  );

  const updateMovie = useCallback((id: string, updates: Partial<Movie>) => {
    setData((prev) => ({
      ...prev,
      movies: prev.movies.map((m) =>
        m.id === id
          ? { ...m, ...updates, updatedAt: new Date().toISOString() }
          : m
      ),
    }));
  }, []);

  const deleteMovie = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      movies: prev.movies.filter((m) => m.id !== id),
    }));
  }, []);

  const getMovie = useCallback(
    (id: string) => data.movies.find((m) => m.id === id),
    [data.movies]
  );

  const addSeries = useCallback(
    (series: Omit<Series, "id" | "createdAt" | "updatedAt">): Series => {
      const now = new Date().toISOString();
      const newSeries: Series = {
        ...series,
        favoriteEpisodes: series.favoriteEpisodes ?? [],
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({ ...prev, series: [...prev.series, newSeries] }));
      return newSeries;
    },
    []
  );

  const updateSeries = useCallback((id: string, updates: Partial<Series>) => {
    setData((prev) => ({
      ...prev,
      series: prev.series.map((s) =>
        s.id === id
          ? { ...s, ...updates, updatedAt: new Date().toISOString() }
          : s
      ),
    }));
  }, []);

  const deleteSeries = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      series: prev.series.filter((s) => s.id !== id),
    }));
  }, []);

  const getSeries = useCallback(
    (id: string) => data.series.find((s) => s.id === id),
    [data.series]
  );

  const setMonthlyFavorite = useCallback((year: number, month: Month, bookId: string | null) => {
    setData((prev) => {
      const currentFavorites = getMonthlyFavoritesForYear(prev.monthlyFavorites, year);
      const previousBookId = currentFavorites[month];
      const nextFavorites = setMonthlyFavoriteForYear(prev.monthlyFavorites, year, month, bookId);

      if (previousBookId === bookId) {
        return { ...prev, monthlyFavorites: nextFavorites };
      }

      const currentBracket = getBracketForYear(prev.bookOfYearBrackets, year);
      const nextBracket = invalidateBracketForMonth(currentBracket, month);

      return {
        ...prev,
        monthlyFavorites: nextFavorites,
        bookOfYearBrackets: setBracketForYear(prev.bookOfYearBrackets, year, nextBracket),
      };
    });
  }, []);

  const setBracketWinner = useCallback(
    (year: number, round: BracketRound, index: number, winnerId: string) => {
      setData((prev) => {
        const favorites = getMonthlyFavoritesForYear(prev.monthlyFavorites, year);
        const current = getBracketForYear(prev.bookOfYearBrackets, year);
        const next = pickBracketWinner(current, round, index, winnerId, favorites);
        return {
          ...prev,
          bookOfYearBrackets: setBracketForYear(prev.bookOfYearBrackets, year, next),
        };
      });
    },
    []
  );

  const resetBookOfYearBracket = useCallback((year: number) => {
    setData((prev) => ({
      ...prev,
      bookOfYearBrackets: setBracketForYear(prev.bookOfYearBrackets, year, emptyBracket()),
    }));
  }, []);

  const getMonthlyFavoritesForYearFn = useCallback(
    (year: number) => getMonthlyFavoritesForYear(data.monthlyFavorites, year),
    [data.monthlyFavorites]
  );

  const getBookOfYearBracketFn = useCallback(
    (year: number) => getBracketForYear(data.bookOfYearBrackets, year),
    [data.bookOfYearBrackets]
  );

  const setReadingGoal = useCallback((goal: number) => {
    setData((prev) => ({ ...prev, readingGoal: Math.max(1, goal) }));
  }, []);

  const setPixelLegendForYear = useCallback((year: number, bands: PixelLegendBand[]) => {
    const sanitized = sanitizeBandsForSave(bands);
    setData((prev) => ({
      ...prev,
      yearPixelLegends: { ...prev.yearPixelLegends, [year]: sanitized },
    }));
  }, []);

  const resetPixelLegendForYear = useCallback((year: number) => {
    setData((prev) => {
      const next = { ...prev.yearPixelLegends };
      delete next[year];
      return { ...prev, yearPixelLegends: next };
    });
  }, []);

  const setNotebookExportSettings = useCallback(
    (year: number, settings: NotebookExportSettings) => {
      setData((prev) => ({
        ...prev,
        notebookExportSettings: setNotebookExportSettingsForYear(
          prev.notebookExportSettings,
          year,
          settings,
        ),
      }));
    },
    [],
  );

  const importNotebook = useCallback((payload: NotebookImportPayload): ImportResult => {
    let result: ImportResult = {
      booksImported: 0,
      booksSkipped: 0,
      wishlistImported: 0,
      favoritesLinked: 0,
      sessionsGenerated: 0,
      sessionsBackfilled: 0,
      booksUpdated: 0,
    };
    setData((prev) => {
      const applied = applyNotebookImport(prev, payload);
      result = applied.result;
      return applied.data;
    });
    return result;
  }, []);

  const addReadingSession = useCallback(
    (bookId: string, session: Omit<ReadingSession, "id">) => {
      const newSession: ReadingSession = { ...session, id: generateId() };
      setData((prev) => ({
        ...prev,
        books: prev.books.map((b) =>
          b.id === bookId
            ? {
                ...b,
                readingSessions: [...(b.readingSessions ?? []), newSession],
                updatedAt: new Date().toISOString(),
              }
            : b
        ),
      }));
    },
    []
  );

  const updateReadingSession = useCallback(
    (
      bookId: string,
      sessionId: string,
      updates: Partial<Omit<ReadingSession, "id">>
    ) => {
      setData((prev) => ({
        ...prev,
        books: prev.books.map((b) =>
          b.id === bookId
            ? {
                ...b,
                readingSessions: b.readingSessions.map((s) =>
                  s.id === sessionId ? { ...s, ...updates } : s
                ),
                updatedAt: new Date().toISOString(),
              }
            : b
        ),
      }));
    },
    []
  );

  const removeReadingSession = useCallback((bookId: string, sessionId: string) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              readingSessions: b.readingSessions.filter((s) => s.id !== sessionId),
              updatedAt: new Date().toISOString(),
            }
          : b
      ),
    }));
  }, []);

  const addBookQuote = useCallback(
    (bookId: string, quote: Omit<BookQuote, "id" | "createdAt">) => {
      const now = new Date().toISOString();
      const newQuote: BookQuote = { ...quote, id: generateId(), createdAt: now };
      setData((prev) => ({
        ...prev,
        books: prev.books.map((b) =>
          b.id === bookId
            ? {
                ...b,
                quotes: [...(b.quotes ?? []), newQuote],
                updatedAt: now,
              }
            : b
        ),
      }));
    },
    []
  );

  const removeBookQuote = useCallback((bookId: string, quoteId: string) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              quotes: b.quotes.filter((q) => q.id !== quoteId),
              updatedAt: new Date().toISOString(),
            }
          : b
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({
      books: data.books,
      movies: data.movies,
      series: data.series,
      wishlist: data.wishlist,
      monthlyFavorites: data.monthlyFavorites,
      bookOfYearBrackets: data.bookOfYearBrackets,
      yearPixelLegends: data.yearPixelLegends,
      notebookExportSettings: data.notebookExportSettings,
      readingGoal: data.readingGoal,
      isLoaded,
      isCloudSync,
      addBook,
      updateBook,
      deleteBook,
      getBook,
      addWishlistItem,
      updateWishlistItem,
      deleteWishlistItem,
      linkWishlistToBook,
      addMovie,
      updateMovie,
      deleteMovie,
      getMovie,
      addSeries,
      updateSeries,
      deleteSeries,
      getSeries,
      setMonthlyFavorite,
      setBracketWinner,
      resetBookOfYearBracket,
      getMonthlyFavoritesForYear: getMonthlyFavoritesForYearFn,
      getBookOfYearBracket: getBookOfYearBracketFn,
      setReadingGoal,
      setPixelLegendForYear,
      resetPixelLegendForYear,
      setNotebookExportSettings,
      importNotebook,
      addReadingSession,
      updateReadingSession,
      removeReadingSession,
      addBookQuote,
      removeBookQuote,
    }),
    [
      data,
      isLoaded,
      isCloudSync,
      addBook,
      updateBook,
      deleteBook,
      getBook,
      addWishlistItem,
      updateWishlistItem,
      deleteWishlistItem,
      linkWishlistToBook,
      addMovie,
      updateMovie,
      deleteMovie,
      getMovie,
      addSeries,
      updateSeries,
      deleteSeries,
      getSeries,
      setMonthlyFavorite,
      setBracketWinner,
      resetBookOfYearBracket,
      getMonthlyFavoritesForYearFn,
      getBookOfYearBracketFn,
      setReadingGoal,
      setPixelLegendForYear,
      resetPixelLegendForYear,
      setNotebookExportSettings,
      importNotebook,
      addReadingSession,
      updateReadingSession,
      removeReadingSession,
      addBookQuote,
      removeBookQuote,
    ]
  );

  return (
    <MediaTrackerContext.Provider value={value}>
      {children}
    </MediaTrackerContext.Provider>
  );
}

export function useMediaTracker(): MediaTrackerContextValue {
  const ctx = useContext(MediaTrackerContext);
  if (!ctx) {
    throw new Error("useMediaTracker debe usarse dentro de MediaTrackerProvider");
  }
  return ctx;
}

export type { MovieFeeling };
