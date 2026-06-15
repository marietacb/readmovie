// ─── Libros ───────────────────────────────────────────────────────────────────

/** Valoración 0–5 en pasos de 0.5 (ej. 3.5, 4.5) */
export type BookRating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export type BookFormat = "libro" | "ebook" | "audiolibro";

export type StoryType = "autoconclusivo" | "bilogia" | "trilogia" | "saga";

/** Marca en qué página empieza cada capítulo */
export interface ChapterMarker {
  id: string;
  title: string;
  startPage: number;
}

/** Registro diario: de qué página a cuál has leído */
export interface ReadingSession {
  id: string;
  date: string;
  fromPage: number;
  toPage: number;
  note?: string;
}

/** Frase favorita encontrada durante la lectura */
export interface BookQuote {
  id: string;
  text: string;
  page?: number;
  chapter?: string;
  date: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  pages?: number;
  /** Número total de capítulos del libro (distinto de `chapters`, los marcadores por página) */
  totalChapters?: number;
  format: BookFormat[];
  startDate?: string;
  endDate?: string;
  publisher?: string;
  genre?: string;
  publishYear?: number;
  storyType: StoryType[];
  characters?: string;
  opinion?: string;
  rating: BookRating;
  romanceRating: BookRating;
  hypeRating: BookRating;
  coverUrl?: string;
  spineColor: string;
  /** Saga o número en serie (ej. "Crave 1", "Los chicos de Tommen 2") */
  seriesLabel?: string;
  chapters: ChapterMarker[];
  readingSessions: ReadingSession[];
  quotes: BookQuote[];
  createdAt: string;
  updatedAt: string;
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type MonthlyFavorites = Record<Month, string | null>;

export type YearlyMonthlyFavorites = Record<number, MonthlyFavorites>;

export interface BookOfYearBracket {
  r1: [string | null, string | null, string | null, string | null, string | null, string | null];
  r2: [string | null, string | null, string | null];
  r3: [string | null, string | null];
}

export type YearlyBookOfYearBrackets = Record<number, BookOfYearBracket>;

export interface PixelLegendBand {
  min: number;
  max: number | null;
  label: string;
  color: string;
}

export type YearlyPixelLegends = Record<number, PixelLegendBand[]>;

/** Entrada de lista de deseos (checklist del cuaderno) */
export interface WishlistItem {
  id: string;
  title: string;
  seriesLabel?: string;
  read: boolean;
  /** Libro vinculado al completar la reseña */
  bookId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Películas ────────────────────────────────────────────────────────────────

export type MovieFeeling =
  | "will_watch_again"
  | "did_not_like"
  | "new_favourite"
  | "very_moving"
  | "must_watch"
  | "extremely_boring"
  | "regret_watching"
  | "very_funny";

export interface Movie {
  id: string;
  title: string;
  director: string;
  genre: string;
  summary: string;
  rating: number;
  feelings: MovieFeeling[];
  bestMoments: string[];
  worstMoments: string[];
  favouriteQuotes: string[];
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Series ───────────────────────────────────────────────────────────────────

export type SeriesStatus = "watching" | "completed" | "dropped" | "plan_to_watch";

export interface Series {
  id: string;
  title: string;
  creator: string;
  genre: string;
  platform: string;
  summary: string;
  rating: number;
  status: SeriesStatus;
  seasons?: number;
  totalEpisodes?: number;
  episodesWatched?: number;
  startDate?: string;
  endDate?: string;
  feelings: MovieFeeling[];
  favoriteCharacters?: string;
  favoriteEpisodes: string[];
  bestMoments: string[];
  worstMoments: string[];
  favouriteQuotes: string[];
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Navegación ───────────────────────────────────────────────────────────────

export type BookTab = "estanteria" | "libreria" | "resena" | "favoritos" | "estadisticas" | "diario" | "resumen_mes" | "wishlist" | "year_pixels" | "overview" | "book_of_year";

export type BookShelf = "leyendo" | "terminado" | "deseos" | "abandonado";

export type MovieTab = "lista" | "resena";

export type SeriesTab = "lista" | "resena";

export type MediaModule = "home" | "books" | "movies" | "series";

// ─── Almacenamiento ───────────────────────────────────────────────────────────

export interface MediaTrackerData {
  books: Book[];
  movies: Movie[];
  series: Series[];
  wishlist: WishlistItem[];
  monthlyFavorites: YearlyMonthlyFavorites;
  bookOfYearBrackets: YearlyBookOfYearBrackets;
  yearPixelLegends: YearlyPixelLegends;
  readingGoal: number;
}

export interface StorageService {
  load(): Promise<MediaTrackerData>;
  save(data: MediaTrackerData): Promise<void>;
}
