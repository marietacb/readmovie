import { EMPTY_MONTHLY_FAVORITES } from "@/lib/constants";
import type { Month, MonthlyFavorites, YearlyMonthlyFavorites } from "@/types";

function isMonthKey(key: string): boolean {
  const n = Number(key);
  return Number.isInteger(n) && n >= 1 && n <= 12;
}

/** Migra formato plano { "1": id } → { [año]: { "1": id } } */
export function normalizeYearlyMonthlyFavorites(
  raw: unknown,
  fallbackYear = new Date().getFullYear()
): YearlyMonthlyFavorites {
  if (!raw || typeof raw !== "object") {
    return { [fallbackYear]: EMPTY_MONTHLY_FAVORITES() };
  }

  const record = raw as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length === 0) {
    return { [fallbackYear]: EMPTY_MONTHLY_FAVORITES() };
  }

  if (keys.some(isMonthKey)) {
    const flat = EMPTY_MONTHLY_FAVORITES();
    for (let m = 1; m <= 12; m++) {
      const key = String(m);
      const value = record[key];
      if (typeof value === "string" || value === null) {
        flat[m as Month] = value;
      }
    }
    return { [fallbackYear]: flat };
  }

  const yearly: YearlyMonthlyFavorites = {};
  keys.forEach((yearKey) => {
    const year = Number(yearKey);
    if (Number.isNaN(year)) return;

    const monthData = record[yearKey];
    if (!monthData || typeof monthData !== "object") {
      yearly[year] = EMPTY_MONTHLY_FAVORITES();
      return;
    }

    const months = EMPTY_MONTHLY_FAVORITES();
    const monthRecord = monthData as Record<string, unknown>;
    for (let m = 1; m <= 12; m++) {
      const value = monthRecord[String(m)];
      if (typeof value === "string" || value === null) {
        months[m as Month] = value;
      }
    }
    yearly[year] = months;
  });

  if (Object.keys(yearly).length === 0) {
    return { [fallbackYear]: EMPTY_MONTHLY_FAVORITES() };
  }

  return yearly;
}

export function getMonthlyFavoritesForYear(
  yearly: YearlyMonthlyFavorites,
  year: number
): MonthlyFavorites {
  return yearly[year] ?? EMPTY_MONTHLY_FAVORITES();
}

export function setMonthlyFavoriteForYear(
  yearly: YearlyMonthlyFavorites,
  year: number,
  month: Month,
  bookId: string | null
): YearlyMonthlyFavorites {
  const current = getMonthlyFavoritesForYear(yearly, year);
  return {
    ...yearly,
    [year]: { ...current, [month]: bookId },
  };
}

export function removeBookFromYearlyFavorites(
  yearly: YearlyMonthlyFavorites,
  bookId: string
): YearlyMonthlyFavorites {
  return Object.fromEntries(
    Object.entries(yearly).map(([year, months]) => [
      year,
      Object.fromEntries(
        Object.entries(months).map(([month, id]) => [month, id === bookId ? null : id])
      ) as MonthlyFavorites,
    ])
  ) as YearlyMonthlyFavorites;
}

export function countAssignedFavorites(favorites: MonthlyFavorites): number {
  return Object.values(favorites).filter(Boolean).length;
}
