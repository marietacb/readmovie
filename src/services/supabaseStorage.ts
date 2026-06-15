import { STORAGE_KEY } from "@/lib/constants";
import { normalizeBooks } from "@/lib/normalizeBook";
import { normalizeYearlyBookOfYearBrackets } from "@/lib/yearlyBrackets";
import { normalizeYearPixelLegends } from "@/lib/pixelLegends";
import { normalizeYearlyMonthlyFavorites } from "@/lib/yearlyFavorites";
import { createClient } from "@/lib/supabase/client";
import type { MediaTrackerData, StorageService } from "@/types";
import {
  bookToRow,
  emptyData,
  movieToRow,
  parseMonthlyFavorites,
  rowToBook,
  rowToMovie,
  rowToWishlist,
  rowToSeries,
  seriesToRow,
  wishlistToRow,
  type BookRow,
  type MovieRow,
  type SeriesRow,
  type WishlistRow,
} from "./supabaseMappers";

export class SupabaseStorageService implements StorageService {
  constructor(private userId: string) {}

  async load(): Promise<MediaTrackerData> {
    const supabase = createClient();

    let profileRes = await supabase
      .from("profiles")
      .select("reading_goal, monthly_favorites, book_of_year_brackets, year_pixel_legends")
      .eq("id", this.userId)
      .maybeSingle();

    if (profileRes.error?.message?.includes("year_pixel_legends")) {
      profileRes = await supabase
        .from("profiles")
        .select("reading_goal, monthly_favorites, book_of_year_brackets")
        .eq("id", this.userId)
        .maybeSingle();
    }

    if (profileRes.error?.message?.includes("book_of_year_brackets")) {
      profileRes = await supabase
        .from("profiles")
        .select("reading_goal, monthly_favorites")
        .eq("id", this.userId)
        .maybeSingle();
    }

    const [booksRes, moviesRes, seriesRes, wishlistRes] = await Promise.all([
      supabase.from("books").select("*").eq("user_id", this.userId).order("updated_at", { ascending: false }),
      supabase.from("movies").select("*").eq("user_id", this.userId).order("updated_at", { ascending: false }),
      supabase.from("series").select("*").eq("user_id", this.userId).order("updated_at", { ascending: false }),
      supabase.from("wishlist").select("*").eq("user_id", this.userId).order("created_at", { ascending: true }),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (booksRes.error) throw booksRes.error;
    if (moviesRes.error) throw moviesRes.error;
    if (seriesRes.error) throw seriesRes.error;
    if (wishlistRes.error) throw wishlistRes.error;

    if (!profileRes.data) {
      await supabase.from("profiles").insert({
        id: this.userId,
        reading_goal: 24,
        monthly_favorites: {},
        book_of_year_brackets: {},
        year_pixel_legends: {},
      });
    }

    return {
      books: (booksRes.data as BookRow[]).map(rowToBook),
      movies: (moviesRes.data as MovieRow[]).map(rowToMovie),
      series: (seriesRes.data as SeriesRow[]).map(rowToSeries),
      wishlist: (wishlistRes.data as WishlistRow[]).map(rowToWishlist),
      monthlyFavorites: profileRes.data
        ? parseMonthlyFavorites(profileRes.data.monthly_favorites ?? {})
        : {},
      bookOfYearBrackets: profileRes.data
        ? normalizeYearlyBookOfYearBrackets(
            "book_of_year_brackets" in (profileRes.data ?? {})
              ? (profileRes.data as { book_of_year_brackets?: unknown }).book_of_year_brackets ?? {}
              : {}
          )
        : {},
      yearPixelLegends: profileRes.data
        ? normalizeYearPixelLegends(
            "year_pixel_legends" in (profileRes.data ?? {})
              ? (profileRes.data as { year_pixel_legends?: unknown }).year_pixel_legends ?? {}
              : {}
          )
        : {},
      readingGoal: profileRes.data?.reading_goal ?? 24,
    };
  }

  async save(data: MediaTrackerData): Promise<void> {
    const supabase = createClient();

    const profilePayload = {
      id: this.userId,
      reading_goal: data.readingGoal,
      monthly_favorites: data.monthlyFavorites,
      book_of_year_brackets: data.bookOfYearBrackets,
      year_pixel_legends: data.yearPixelLegends,
      updated_at: new Date().toISOString(),
    };

    let { error: profileError } = await supabase.from("profiles").upsert(profilePayload);
    if (profileError?.message?.includes("year_pixel_legends")) {
      const { year_pixel_legends: _legends, ...withoutLegends } = profilePayload;
      void _legends;
      ({ error: profileError } = await supabase.from("profiles").upsert(withoutLegends));
    }
    if (profileError?.message?.includes("book_of_year_brackets")) {
      const { book_of_year_brackets: _brackets, ...withoutBrackets } = profilePayload;
      void _brackets;
      ({ error: profileError } = await supabase.from("profiles").upsert(withoutBrackets));
    }
    if (profileError) throw profileError;

    const { data: existingBooks } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", this.userId);
    const { data: existingMovies } = await supabase
      .from("movies")
      .select("id")
      .eq("user_id", this.userId);
    const { data: existingSeries } = await supabase
      .from("series")
      .select("id")
      .eq("user_id", this.userId);
    const { data: existingWishlist } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", this.userId);

    const currentBookIds = new Set(data.books.map((b) => b.id));
    const currentMovieIds = new Set(data.movies.map((m) => m.id));
    const currentSeriesIds = new Set(data.series.map((s) => s.id));
    const currentWishlistIds = new Set(data.wishlist.map((w) => w.id));

    const booksToDelete = (existingBooks ?? [])
      .map((b) => b.id)
      .filter((id) => !currentBookIds.has(id));
    const moviesToDelete = (existingMovies ?? [])
      .map((m) => m.id)
      .filter((id) => !currentMovieIds.has(id));
    const seriesToDelete = (existingSeries ?? [])
      .map((s) => s.id)
      .filter((id) => !currentSeriesIds.has(id));
    const wishlistToDelete = (existingWishlist ?? [])
      .map((w) => w.id)
      .filter((id) => !currentWishlistIds.has(id));

    if (booksToDelete.length > 0) {
      const { error } = await supabase.from("books").delete().in("id", booksToDelete);
      if (error) throw error;
    }
    if (moviesToDelete.length > 0) {
      const { error } = await supabase.from("movies").delete().in("id", moviesToDelete);
      if (error) throw error;
    }
    if (seriesToDelete.length > 0) {
      const { error } = await supabase.from("series").delete().in("id", seriesToDelete);
      if (error) throw error;
    }
    if (wishlistToDelete.length > 0) {
      const { error } = await supabase.from("wishlist").delete().in("id", wishlistToDelete);
      if (error) throw error;
    }

    if (data.books.length > 0) {
      const { error } = await supabase
        .from("books")
        .upsert(data.books.map((b) => bookToRow(b, this.userId)));
      if (error) throw error;
    }

    if (data.movies.length > 0) {
      const { error } = await supabase
        .from("movies")
        .upsert(data.movies.map((m) => movieToRow(m, this.userId)));
      if (error) throw error;
    }

    if (data.series.length > 0) {
      const { error } = await supabase
        .from("series")
        .upsert(data.series.map((s) => seriesToRow(s, this.userId)));
      if (error) throw error;
    }

    if (data.wishlist.length > 0) {
      const { error } = await supabase
        .from("wishlist")
        .upsert(data.wishlist.map((w) => wishlistToRow(w, this.userId)));
      if (error) throw error;
    }
  }
}

export async function migrateLocalStorageToSupabase(userId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const migratedKey = `mediatracker-migrated-${userId}`;
  if (localStorage.getItem(migratedKey)) return false;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as MediaTrackerData;
    const service = new SupabaseStorageService(userId);
    const existing = await service.load();

    const merged: MediaTrackerData = { ...existing };
    let imported = false;

    if (existing.books.length === 0 && (parsed.books?.length ?? 0) > 0) {
      merged.books = normalizeBooks(parsed.books ?? []);
      imported = true;
    }
    if (existing.movies.length === 0 && (parsed.movies?.length ?? 0) > 0) {
      merged.movies = parsed.movies ?? [];
      imported = true;
    }
    if (existing.series.length === 0 && (parsed.series?.length ?? 0) > 0) {
      merged.series = parsed.series ?? [];
      imported = true;
    }
    if (existing.wishlist.length === 0 && (parsed.wishlist?.length ?? 0) > 0) {
      merged.wishlist = parsed.wishlist ?? [];
      imported = true;
    }
    if (
      Object.keys(existing.monthlyFavorites).length === 0 &&
      parsed.monthlyFavorites &&
      Object.keys(normalizeYearlyMonthlyFavorites(parsed.monthlyFavorites)).length > 0
    ) {
      merged.monthlyFavorites = normalizeYearlyMonthlyFavorites(parsed.monthlyFavorites);
      imported = true;
    }
    if (
      Object.keys(existing.bookOfYearBrackets).length === 0 &&
      parsed.bookOfYearBrackets &&
      Object.keys(normalizeYearlyBookOfYearBrackets(parsed.bookOfYearBrackets)).length > 0
    ) {
      merged.bookOfYearBrackets = normalizeYearlyBookOfYearBrackets(parsed.bookOfYearBrackets);
      imported = true;
    }
    if (
      Object.keys(existing.yearPixelLegends).length === 0 &&
      parsed.yearPixelLegends &&
      Object.keys(normalizeYearPixelLegends(parsed.yearPixelLegends)).length > 0
    ) {
      merged.yearPixelLegends = normalizeYearPixelLegends(parsed.yearPixelLegends);
      imported = true;
    }
    if (existing.readingGoal === 24 && parsed.readingGoal && parsed.readingGoal !== 24) {
      merged.readingGoal = parsed.readingGoal;
      imported = true;
    }

    if (imported) {
      await service.save(merged);
      localStorage.setItem(migratedKey, "true");
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export { emptyData };
