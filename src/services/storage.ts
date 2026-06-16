import { STORAGE_KEY } from "@/lib/constants";
import { normalizeBooks } from "@/lib/normalizeBook";
import { normalizeYearlyBookOfYearBrackets } from "@/lib/yearlyBrackets";
import { normalizeYearPixelLegends } from "@/lib/pixelLegends";
import { normalizeYearlyMonthlyFavorites } from "@/lib/yearlyFavorites";
import { normalizeYearlyNotebookExportSettings } from "@/lib/notebookExport/settings";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { MediaTrackerData, StorageService } from "@/types";
import { SupabaseStorageService } from "./supabaseStorage";

const DEFAULT_DATA: MediaTrackerData = {
  books: [],
  movies: [],
  series: [],
  wishlist: [],
  monthlyFavorites: {},
  bookOfYearBrackets: {},
  yearPixelLegends: {},
  notebookExportSettings: {},
  readingGoal: 24,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export class LocalStorageService implements StorageService {
  async load(): Promise<MediaTrackerData> {
    if (!isBrowser()) return DEFAULT_DATA;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;

      const parsed = JSON.parse(raw) as Partial<MediaTrackerData>;
      return {
        books: normalizeBooks(parsed.books ?? []),
        movies: parsed.movies ?? [],
        series: parsed.series ?? [],
        wishlist: parsed.wishlist ?? [],
        monthlyFavorites: normalizeYearlyMonthlyFavorites(parsed.monthlyFavorites),
        bookOfYearBrackets: normalizeYearlyBookOfYearBrackets(parsed.bookOfYearBrackets),
        yearPixelLegends: normalizeYearPixelLegends(parsed.yearPixelLegends),
        notebookExportSettings: normalizeYearlyNotebookExportSettings(
          parsed.notebookExportSettings,
        ),
        readingGoal: parsed.readingGoal ?? 24,
      };
    } catch {
      return DEFAULT_DATA;
    }
  }

  async save(data: MediaTrackerData): Promise<void> {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function getStorageService(userId?: string | null): StorageService {
  if (isSupabaseConfigured() && userId) {
    return new SupabaseStorageService(userId);
  }
  return new LocalStorageService();
}

export function usesCloudStorage(userId?: string | null): boolean {
  return isSupabaseConfigured() && !!userId;
}
