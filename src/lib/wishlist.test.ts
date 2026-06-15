import { describe, expect, it } from "vitest";
import { isWishlistItemRead, splitWishlistColumns } from "@/lib/wishlist";
import type { Book, WishlistItem } from "@/types";

const baseItem: WishlistItem = {
  id: "w1",
  title: "Test",
  read: false,
  createdAt: "2025-06-15T12:00:00.000Z",
  updatedAt: "2025-06-15T12:00:00.000Z",
};

const finishedBook: Book = {
  id: "b1",
  title: "Done",
  author: "Author",
  format: ["libro"],
  storyType: ["autoconclusivo"],
  rating: 4,
  romanceRating: 0,
  hypeRating: 0,
  spineColor: "#fff",
  chapters: [],
  readingSessions: [],
  quotes: [],
  endDate: "2025-01-10",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-10T00:00:00.000Z",
};

describe("wishlist", () => {
  it("marca como leído si el ítem tiene read=true", () => {
    expect(isWishlistItemRead({ ...baseItem, read: true })).toBe(true);
  });

  it("marca como leído si el libro vinculado está terminado", () => {
    expect(isWishlistItemRead({ ...baseItem, bookId: "b1" }, finishedBook)).toBe(true);
  });

  it("queda pendiente si read=false y el libro no está terminado", () => {
    const readingBook = { ...finishedBook, endDate: undefined };
    expect(isWishlistItemRead({ ...baseItem, bookId: "b1" }, readingBook)).toBe(false);
  });

  it("divide la lista en dos columnas equilibradas", () => {
    const [left, right] = splitWishlistColumns(["a", "b", "c", "d", "e"]);
    expect(left).toEqual(["a", "b", "c"]);
    expect(right).toEqual(["d", "e"]);
  });
});
