import { normalizeYearlyMonthlyFavorites } from "@/lib/yearlyFavorites";
import { clampBookRating } from "@/lib/ratings";
import { normalizeBook } from "@/lib/normalizeBook";
import type {
  Book,
  BookFormat,
  BookQuote,
  ChapterMarker,
  MediaTrackerData,
  Movie,
  MovieFeeling,
  ReadingSession,
  Series,
  SeriesStatus,
  StoryType,
  WishlistItem,
} from "@/types";

export interface BookRow {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number | null;
  total_chapters: number | null;
  format: string[];
  start_date: string | null;
  end_date: string | null;
  publisher: string | null;
  genre: string | null;
  publish_year: number | null;
  story_type: string[];
  characters: string | null;
  opinion: string | null;
  rating: number;
  romance_rating: number;
  hype_rating: number;
  cover_url: string | null;
  spine_color: string;
  series_label: string | null;
  chapters: ChapterMarker[];
  reading_sessions: ReadingSession[];
  quotes: BookQuote[];
  created_at: string;
  updated_at: string;
}

export interface MovieRow {
  id: string;
  user_id: string;
  title: string;
  director: string;
  genre: string;
  summary: string;
  rating: number;
  feelings: string[];
  best_moments: string[];
  worst_moments: string[];
  favourite_quotes: string[];
  poster_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeriesRow {
  id: string;
  user_id: string;
  title: string;
  creator: string;
  genre: string;
  platform: string;
  summary: string;
  rating: number;
  status: string;
  seasons: number | null;
  total_episodes: number | null;
  episodes_watched: number | null;
  start_date: string | null;
  end_date: string | null;
  feelings: string[];
  favorite_characters: string | null;
  favorite_episodes: string[];
  best_moments: string[];
  worst_moments: string[];
  favourite_quotes: string[];
  poster_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  reading_goal: number;
  monthly_favorites: Record<string, unknown>;
  book_of_year_brackets?: Record<string, unknown>;
}

export interface WishlistRow {
  id: string;
  user_id: string;
  title: string;
  series_label: string | null;
  read: boolean;
  book_id: string | null;
  created_at: string;
  updated_at: string;
}

export function bookToRow(book: Book, userId: string): BookRow {
  return {
    id: book.id,
    user_id: userId,
    title: book.title,
    author: book.author,
    pages: book.pages ?? null,
    total_chapters: book.totalChapters ?? null,
    format: book.format,
    start_date: book.startDate ?? null,
    end_date: book.endDate ?? null,
    publisher: book.publisher ?? null,
    genre: book.genre ?? null,
    publish_year: book.publishYear ?? null,
    story_type: book.storyType,
    characters: book.characters ?? null,
    opinion: book.opinion ?? null,
    rating: book.rating,
    romance_rating: book.romanceRating,
    hype_rating: book.hypeRating,
    cover_url: book.coverUrl ?? null,
    spine_color: book.spineColor,
    series_label: book.seriesLabel ?? null,
    chapters: book.chapters ?? [],
    reading_sessions: book.readingSessions ?? [],
    quotes: book.quotes ?? [],
    created_at: book.createdAt,
    updated_at: book.updatedAt,
  };
}

export function rowToBook(row: BookRow): Book {
  return normalizeBook({
    id: row.id,
    title: row.title,
    author: row.author,
    pages: row.pages ?? undefined,
    totalChapters: row.total_chapters ?? undefined,
    format: row.format as BookFormat[],
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    publisher: row.publisher ?? undefined,
    genre: row.genre ?? undefined,
    publishYear: row.publish_year ?? undefined,
    storyType: row.story_type as StoryType[],
    characters: row.characters ?? undefined,
    opinion: row.opinion ?? undefined,
    rating: clampBookRating(row.rating),
    romanceRating: clampBookRating(row.romance_rating),
    hypeRating: clampBookRating(row.hype_rating),
    coverUrl: row.cover_url ?? undefined,
    spineColor: row.spine_color,
    seriesLabel: row.series_label ?? undefined,
    chapters: row.chapters ?? [],
    readingSessions: row.reading_sessions ?? [],
    quotes: row.quotes ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function movieToRow(movie: Movie, userId: string): MovieRow {
  return {
    id: movie.id,
    user_id: userId,
    title: movie.title,
    director: movie.director,
    genre: movie.genre,
    summary: movie.summary,
    rating: movie.rating,
    feelings: movie.feelings,
    best_moments: movie.bestMoments,
    worst_moments: movie.worstMoments,
    favourite_quotes: movie.favouriteQuotes,
    poster_url: movie.posterUrl ?? null,
    created_at: movie.createdAt,
    updated_at: movie.updatedAt,
  };
}

export function rowToMovie(row: MovieRow): Movie {
  return {
    id: row.id,
    title: row.title,
    director: row.director,
    genre: row.genre,
    summary: row.summary,
    rating: row.rating,
    feelings: row.feelings as MovieFeeling[],
    bestMoments: row.best_moments,
    worstMoments: row.worst_moments,
    favouriteQuotes: row.favourite_quotes,
    posterUrl: row.poster_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function seriesToRow(series: Series, userId: string): SeriesRow {
  return {
    id: series.id,
    user_id: userId,
    title: series.title,
    creator: series.creator,
    genre: series.genre,
    platform: series.platform,
    summary: series.summary,
    rating: series.rating,
    status: series.status,
    seasons: series.seasons ?? null,
    total_episodes: series.totalEpisodes ?? null,
    episodes_watched: series.episodesWatched ?? null,
    start_date: series.startDate ?? null,
    end_date: series.endDate ?? null,
    feelings: series.feelings,
    favorite_characters: series.favoriteCharacters ?? null,
    favorite_episodes: series.favoriteEpisodes,
    best_moments: series.bestMoments,
    worst_moments: series.worstMoments,
    favourite_quotes: series.favouriteQuotes,
    poster_url: series.posterUrl ?? null,
    created_at: series.createdAt,
    updated_at: series.updatedAt,
  };
}

export function rowToSeries(row: SeriesRow): Series {
  return {
    id: row.id,
    title: row.title,
    creator: row.creator,
    genre: row.genre,
    platform: row.platform,
    summary: row.summary,
    rating: row.rating,
    status: row.status as SeriesStatus,
    seasons: row.seasons ?? undefined,
    totalEpisodes: row.total_episodes ?? undefined,
    episodesWatched: row.episodes_watched ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    feelings: row.feelings as MovieFeeling[],
    favoriteCharacters: row.favorite_characters ?? undefined,
    favoriteEpisodes: row.favorite_episodes,
    bestMoments: row.best_moments,
    worstMoments: row.worst_moments,
    favouriteQuotes: row.favourite_quotes,
    posterUrl: row.poster_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function wishlistToRow(item: WishlistItem, userId: string): WishlistRow {
  return {
    id: item.id,
    user_id: userId,
    title: item.title,
    series_label: item.seriesLabel ?? null,
    read: item.read,
    book_id: item.bookId ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function rowToWishlist(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    title: row.title,
    seriesLabel: row.series_label ?? undefined,
    read: row.read,
    bookId: row.book_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function parseMonthlyFavorites(raw: Record<string, unknown>): ReturnType<typeof normalizeYearlyMonthlyFavorites> {
  return normalizeYearlyMonthlyFavorites(raw);
}

export function emptyData(): MediaTrackerData {
  return {
    books: [],
    movies: [],
    series: [],
    wishlist: [],
    monthlyFavorites: {},
    bookOfYearBrackets: {},
    yearPixelLegends: {},
    readingGoal: 24,
  };
}
