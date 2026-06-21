import { getBookOfYear } from "@/lib/bookOfYear";
import type { BookLineStyle } from "@/lib/notebookExport/colors";
import type { CoverLinePath } from "@/lib/notebookExport/coverLines";
import {
  getBooksWithActivityInYear,
  sortBooksByStartDate,
} from "@/lib/notebookExport/bookSelection";
import { getMonthlyOverview } from "@/lib/monthlyOverview";
import { buildYearPixelGrid } from "@/lib/yearInPixels";
import { resolvePixelLegend } from "@/lib/pixelLegends";
import { getGenreSpineColor } from "@/lib/genreColors";
import { filterWishlistByYear } from "@/lib/trackerYears";
import { formatDate } from "@/lib/utils";
import { BOOK_FORMATS } from "@/lib/constants";
import { formatBookRating } from "@/lib/ratings";
import type {
  Book,
  BookOfYearBracket,
  BookRating,
  MonthlyFavorites,
  NotebookExportSettings,
  PixelLegendBand,
  WishlistItem,
} from "@/types";

export interface NotebookExportPayload {
  year: number;
  settings: NotebookExportSettings;
  books: Book[];
  wishlist: WishlistItem[];
  monthlyFavorites: MonthlyFavorites;
  bracket: BookOfYearBracket;
  readingGoal: number;
  pixelLegend: PixelLegendBand[];
  lineStyles: BookLineStyle[];
  coverPaths: CoverLinePath[];
  verticalBarPaths: CoverLinePath[];
  overview: ReturnType<typeof getMonthlyOverview>;
  pixelGrid: ReturnType<typeof buildYearPixelGrid>;
  bookOfYearId: string | null;
  origin: string;
}

export function formatBookFormatLabel(formats: Book["format"]): string {
  if (!formats.length) return "";
  return formats
    .map((f) => BOOK_FORMATS.find((b) => b.value === f)?.label ?? f)
    .join(", ");
}

export function formatBookDates(book: Book): string {
  const start = book.startDate ? formatDate(book.startDate) : "";
  const end = book.endDate ? formatDate(book.endDate) : "en curso";
  if (!start) return end;
  return `${start} – ${end}`;
}

const RATING_COLORS: Record<number, string> = {
  1: "#E57373",
  2: "#FFB74D",
  3: "#81D4FA",
  4: "#CE93D8",
  5: "#FFF176",
};

export function ratingColor(rating: number): string {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return RATING_COLORS[rounded] ?? "#E0E0E0";
}

export function buildNotebookExportPayload(input: {
  year: number;
  books: Book[];
  wishlist: WishlistItem[];
  monthlyFavorites: MonthlyFavorites;
  bracket: BookOfYearBracket;
  readingGoal: number;
  yearPixelLegends: import("@/types").YearlyPixelLegends;
  settings: NotebookExportSettings;
  lineStyles: BookLineStyle[];
  coverPaths: CoverLinePath[];
  verticalBarPaths: CoverLinePath[];
  origin: string;
}): NotebookExportPayload {
  const books = sortBooksByStartDate(
    getBooksWithActivityInYear(input.books, input.year),
  );

  return {
    year: input.year,
    settings: input.settings,
    books,
    wishlist: filterWishlistByYear(input.wishlist, input.year),
    monthlyFavorites: input.monthlyFavorites,
    bracket: input.bracket,
    readingGoal: input.readingGoal,
    pixelLegend: resolvePixelLegend(input.yearPixelLegends, input.year),
    lineStyles: input.lineStyles,
    coverPaths: input.coverPaths,
    verticalBarPaths: input.verticalBarPaths,
    overview: getMonthlyOverview(input.books, input.year),
    pixelGrid: buildYearPixelGrid(input.books, input.year),
    bookOfYearId: getBookOfYear(input.bracket),
    origin: input.origin,
  };
}

export function getTrackerSlotColor(book: Book | undefined, index: number): string {
  if (!book) return "#FFFFFF";
  return getGenreSpineColor(book.genres, book.spineColor);
}

export function formatRatingDisplay(rating: BookRating): string {
  if (rating <= 0) return "—";
  return formatBookRating(rating);
}
