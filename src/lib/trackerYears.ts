import type { Book, WishlistItem, YearlyBookOfYearBrackets, YearlyMonthlyFavorites } from "@/types";

export function getTrackerYears(
  books: Book[],
  wishlist: WishlistItem[] = [],
  yearlyFavorites: YearlyMonthlyFavorites = {},
  yearlyBrackets: YearlyBookOfYearBrackets = {}
): number[] {
  const years = new Set<number>([new Date().getFullYear()]);

  books.forEach((book) => {
    (book.readingSessions ?? []).forEach((session) => {
      years.add(new Date(session.date).getFullYear());
    });
    if (book.startDate) years.add(new Date(book.startDate).getFullYear());
    if (book.endDate) years.add(new Date(book.endDate).getFullYear());
  });

  wishlist.forEach((item) => {
    years.add(new Date(item.createdAt).getFullYear());
  });

  Object.keys(yearlyFavorites).forEach((key) => {
    const year = Number(key);
    if (!Number.isNaN(year)) years.add(year);
  });

  Object.keys(yearlyBrackets).forEach((key) => {
    const year = Number(key);
    if (!Number.isNaN(year)) years.add(year);
  });

  return [...years].sort((a, b) => b - a);
}

export function filterWishlistByYear(items: WishlistItem[], year: number): WishlistItem[] {
  return items.filter((item) => new Date(item.createdAt).getFullYear() === year);
}
