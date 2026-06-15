import { describe, expect, it } from "vitest";
import { EMPTY_MONTHLY_FAVORITES } from "@/lib/constants";
import {
  countAssignedFavorites,
  getMonthlyFavoritesForYear,
  normalizeYearlyMonthlyFavorites,
  removeBookFromYearlyFavorites,
  setMonthlyFavoriteForYear,
} from "@/lib/yearlyFavorites";

describe("yearlyFavorites", () => {
  it("migra formato plano al año indicado", () => {
    const yearly = normalizeYearlyMonthlyFavorites({ "1": "book-a", "3": "book-b" }, 2025);

    expect(yearly[2025][1]).toBe("book-a");
    expect(yearly[2025][2]).toBeNull();
    expect(yearly[2025][3]).toBe("book-b");
  });

  it("conserva formato anidado por año", () => {
    const yearly = normalizeYearlyMonthlyFavorites({
      "2024": { "1": "old", "2": null },
      "2026": { "5": "new" },
    });

    expect(yearly[2024][1]).toBe("old");
    expect(yearly[2026][5]).toBe("new");
    expect(yearly[2026][1]).toBeNull();
  });

  it("actualiza favoritos de un año sin tocar otros", () => {
    const base = normalizeYearlyMonthlyFavorites({ "2025": { "1": "a" } });
    const updated = setMonthlyFavoriteForYear(base, 2025, 2, "b");
    const other = setMonthlyFavoriteForYear(updated, 2026, 1, "c");

    expect(other[2025][1]).toBe("a");
    expect(other[2025][2]).toBe("b");
    expect(other[2026][1]).toBe("c");
  });

  it("elimina un libro de todos los años", () => {
    const yearly = normalizeYearlyMonthlyFavorites({
      "2025": { "1": "gone", "2": "stay" },
      "2026": { "4": "gone" },
    });

    const cleaned = removeBookFromYearlyFavorites(yearly, "gone");

    expect(cleaned[2025][1]).toBeNull();
    expect(cleaned[2025][2]).toBe("stay");
    expect(cleaned[2026][4]).toBeNull();
  });

  it("cuenta favoritos asignados", () => {
    const favorites = { ...EMPTY_MONTHLY_FAVORITES(), 1: "a", 6: "b", 12: "c" };
    expect(countAssignedFavorites(favorites)).toBe(3);
  });

  it("devuelve favoritos vacíos para años sin datos", () => {
    const favorites = getMonthlyFavoritesForYear({ 2025: { ...EMPTY_MONTHLY_FAVORITES(), 1: "x" } }, 2024);
    expect(favorites[1]).toBeNull();
  });
});
