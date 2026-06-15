import { describe, expect, it } from "vitest";
import { filterWishlistByYear, getTrackerYears } from "@/lib/trackerYears";
import type { Book, WishlistItem } from "@/types";

const book2024: Book = {
  id: "b1",
  title: "2024",
  author: "A",
  format: ["libro"],
  storyType: ["autoconclusivo"],
  rating: 0,
  romanceRating: 0,
  hypeRating: 0,
  spineColor: "#fff",
  chapters: [],
  readingSessions: [{ id: "s1", date: "2024-03-10", fromPage: 1, toPage: 20 }],
  quotes: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-03-10T00:00:00.000Z",
};

const wishlist2025: WishlistItem = {
  id: "w1",
  title: "Pending",
  read: false,
  createdAt: "2025-02-01T12:00:00.000Z",
  updatedAt: "2025-02-01T12:00:00.000Z",
};

describe("trackerYears", () => {
  it("incluye años de libros, wishlist, favoritos y brackets", () => {
    const years = getTrackerYears(
      [book2024],
      [wishlist2025],
      { 2023: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null, 12: null } },
      {
        2022: {
          r1: [null, null, null, null, null, null],
          r2: [null, null, null],
          r3: [null, null],
        },
      }
    );

    expect(years).toContain(2024);
    expect(years).toContain(2025);
    expect(years).toContain(2023);
    expect(years).toContain(2022);
    expect(years[0]).toBeGreaterThan(years[years.length - 1]);
  });

  it("filtra wishlist por año de creación", () => {
    const items = [
      wishlist2025,
      { ...wishlist2025, id: "w2", createdAt: "2024-08-01T12:00:00.000Z", updatedAt: "2024-08-01T12:00:00.000Z" },
    ];

    expect(filterWishlistByYear(items, 2025)).toHaveLength(1);
    expect(filterWishlistByYear(items, 2025)[0].id).toBe("w1");
    expect(filterWishlistByYear(items, 2024)).toHaveLength(1);
  });
});
