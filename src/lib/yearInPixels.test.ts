import { describe, expect, it } from "vitest";
import {
  buildYearPixelGrid,
  getBooksFinishedOnDate,
  getSessionsForDate,
} from "@/lib/yearInPixels";
import type { Book } from "@/types";

const baseBook = (overrides: Partial<Book> = {}): Book => ({
  id: "b1",
  title: "Dune",
  author: "Frank Herbert",
  format: ["libro"],
  storyType: ["autoconclusivo"],
  rating: 0,
  romanceRating: 0,
  hypeRating: 0,
  spineColor: "#000",
  chapters: [],
  readingSessions: [],
  quotes: [],
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
  ...overrides,
});

describe("yearInPixels", () => {
  it("detecta libros terminados en una fecha", () => {
    const books = [
      baseBook({ id: "b1", endDate: "2025-03-12" }),
      baseBook({ id: "b2", title: "Otro", endDate: "2025-04-01" }),
    ];

    expect(getBooksFinishedOnDate(books, "2025-03-12")).toHaveLength(1);
    expect(getBooksFinishedOnDate(books, "2025-03-12")[0].id).toBe("b1");
  });

  it("agrupa sesiones por fecha", () => {
    const books = [
      baseBook({
        readingSessions: [
          { id: "s1", date: "2025-03-01", fromPage: 1, toPage: 26 },
        ],
      }),
    ];

    expect(getSessionsForDate(books, "2025-03-01")).toHaveLength(1);
    expect(getSessionsForDate(books, "2025-03-01")[0].pages).toBe(25);
  });

  it("incluye estrellas en la cuadrícula", () => {
    const books = [
      baseBook({
        endDate: "2025-06-15",
        readingSessions: [
          { id: "s1", date: "2025-06-15", fromPage: 1, toPage: 21 },
        ],
      }),
    ];

    const grid = buildYearPixelGrid(books, 2025);
    const cell = grid[14][5];
    expect(cell.date).toBe("2025-06-15");
    expect(cell.finishedBooks).toHaveLength(1);
    expect(cell.pages).toBe(20);
  });
});
