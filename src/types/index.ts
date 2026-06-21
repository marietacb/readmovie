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
  genres: string[];
  /** País o países de origen de la obra (ej. España, Japón) */
  originalNationality?: string;
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

/** Personalización del cuaderno PDF exportable por año */
export interface NotebookExportSettings {
  /** Foto para la página de favoritos (URL o data URL) */
  favoritePhotoUrl?: string;
  favoritePhotoCaption?: string;
  coverQuote?: string;
  enabledStickerIds: string[];
}

export type YearlyNotebookExportSettings = Record<number, NotebookExportSettings>;

/** Nota breve opcional por día (YYYY-MM-DD) — Year in Pixels, calendario… */
export type DayNotes = Record<string, string>;

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

export type MovieStatus =
  | "watched"
  | "plan_to_watch"
  | "watched_again"
  | "partially_dropped"
  | "dropped";

/** Cada vez que ves la película (puede repetirse en fechas distintas). */
export interface MovieWatchLog {
  id: string;
  date: string;
  note?: string;
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  genres: string[];
  originalNationality?: string;
  summary: string;
  rating: number;
  status: MovieStatus;
  feelings: MovieFeeling[];
  posterUrl?: string;
  /** Última fecha de visionado (sincronizada con el diario). */
  watchDate?: string;
  watchLogs: MovieWatchLog[];
  createdAt: string;
  updatedAt: string;
}

// ─── Series ───────────────────────────────────────────────────────────────────

export type SeriesStatus =
  | "watching"
  | "completed"
  | "plan_to_watch"
  | "dropped"
  | "watched_again"
  | "partially_dropped";

/** Visionado de un episodio en una fecha (puede repetirse en días distintos). */
export interface EpisodeWatchLog {
  id: string;
  date: string;
  season: number;
  episode: number;
  note?: string;
}

export interface Series {
  id: string;
  title: string;
  creator: string;
  genres: string[];
  originalNationality?: string;
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
  episodeWatchLogs: EpisodeWatchLog[];
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Navegación ───────────────────────────────────────────────────────────────

export type BookTab = "estanteria" | "libreria" | "resena" | "favoritos" | "estadisticas" | "diario" | "resumen_mes" | "wishlist" | "year_pixels" | "overview" | "book_of_year" | "exportar_cuaderno";

export type BookShelf = "leyendo" | "terminado" | "deseos" | "abandonado";

export type MovieTab = "panel" | "lista" | "calendario" | "estadisticas" | "resena";

export type SeriesTab = "panel" | "lista" | "calendario" | "estadisticas" | "resena";

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
  notebookExportSettings: YearlyNotebookExportSettings;
  dayNotes: DayNotes;
  readingGoal: number;
}

export interface StorageService {
  load(): Promise<MediaTrackerData>;
  save(data: MediaTrackerData): Promise<void>;
}
