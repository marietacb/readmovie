import { describe, expect, it } from "vitest";
import { applyNotebookImport, parseNotebookImport } from "@/lib/importBooks";
import type { MediaTrackerData } from "@/types";

const emptyData = (): MediaTrackerData => ({
  books: [],
  movies: [],
  series: [],
  wishlist: [],
  monthlyFavorites: {},
  bookOfYearBrackets: {},
  yearPixelLegends: {},
  readingGoal: 24,
});

describe("importBooks", () => {
  it("parsea un payload válido", () => {
    const payload = parseNotebookImport({
      year: 2025,
      books: [{ title: "Dune", author: "Frank Herbert", rating: 5 }],
      wishlist: [{ title: "Pendiente" }],
      monthlyFavorites: { "3": "Dune" },
    });

    expect(payload.year).toBe(2025);
    expect(payload.books).toHaveLength(1);
    expect(payload.wishlist).toHaveLength(1);
    expect(payload.monthlyFavorites?.[3]).toBe("Dune");
  });

  it("importa libros y evita duplicados", () => {
    const first = applyNotebookImport(emptyData(), {
      books: [{ title: "Dune", author: "Frank Herbert", pages: 300, startDate: "2025-01-01", endDate: "2025-01-10" }],
    });
    const second = applyNotebookImport(first.data, {
      books: [
        { title: "Dune", author: "Frank Herbert" },
        { title: "Nuevo", author: "Autor" },
      ],
    });

    expect(first.result.booksImported).toBe(1);
    expect(first.result.sessionsGenerated).toBeGreaterThan(0);
    expect(second.result.booksImported).toBe(1);
    expect(second.result.booksSkipped).toBe(1);
    expect(second.data.books).toHaveLength(2);
  });

  it("vincula favoritos del mes por título", () => {
    const { data, result } = applyNotebookImport(emptyData(), {
      year: 2025,
      books: [{ title: "Favorito", author: "Autor" }],
      monthlyFavorites: { 1: "Favorito" },
    });

    const bookId = data.books[0].id;
    expect(data.monthlyFavorites[2025]?.[1]).toBe(bookId);
    expect(result.favoritesLinked).toBe(1);
  });

  it("importa libro con páginas acumuladas diarias", () => {
    const { data, result } = applyNotebookImport(emptyData(), {
      year: 2026,
      books: [
        {
          title: "Una corte de rosas y espinas",
          author: "Sarah J. Maas",
          startDate: "2026-03-03",
          cumulativeDailyPages: {
            startDate: "2026-03-03",
            toPages: [11, 13, 296],
          },
        },
      ],
    });

    expect(result.booksImported).toBe(1);
    expect(data.books[0].readingSessions).toHaveLength(3);
    expect(data.books[0].readingSessions[2].date).toBe("2026-03-05");
    expect(data.books[0].readingSessions[2].toPage).toBe(296);
  });

  it("importa páginas diarias explícitas en bookUpdates", () => {
    const base = applyNotebookImport(emptyData(), {
      year: 2025,
      books: [
        {
          title: "Cumbres Borrascosas",
          author: "Emily Brontë",
          pages: 346,
          startDate: "2025-12-23",
          readingSessions: [{ date: "2026-01-31", fromPage: 1, toPage: 177 }],
        },
      ],
    });

    const { data, result } = applyNotebookImport(base.data, {
      year: 2026,
      books: [],
      bookUpdates: [
        {
          title: "Cumbres Borrascosas",
          author: "Emily Brontë",
          endDate: "2026-03-02",
          dailyPages: {
            "2026-02-01": 10,
            "2026-02-02": 2,
            "2026-03-02": 18,
          },
        },
      ],
    });

    expect(result.booksUpdated).toBe(1);
    expect(data.books[0].endDate).toBe("2026-03-02");
    const feb1 = data.books[0].readingSessions.find((s) => s.date === "2026-02-01");
    expect(feb1).toBeDefined();
    expect(feb1!.toPage - feb1!.fromPage).toBe(10);
    expect(feb1!.fromPage).toBe(177);
  });

  it("no duplica wishlist del mismo año", () => {
    const first = applyNotebookImport(emptyData(), {
      year: 2026,
      books: [],
      wishlist: [{ title: "1984", read: false }],
    });
    const second = applyNotebookImport(first.data, {
      year: 2026,
      books: [],
      wishlist: [{ title: "1984", read: false }, { title: "Dune", read: false }],
    });

    expect(first.result.wishlistImported).toBe(1);
    expect(second.result.wishlistImported).toBe(1);
    expect(second.data.wishlist).toHaveLength(2);
  });
});
