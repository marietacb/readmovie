import type { Book } from "@/types";
import type { NotebookExportSettings } from "@/types";
import { buildBookLineStyles } from "@/lib/notebookExport/colors";
import {
  generateCoverLinePaths,
  generateVerticalBarLines,
} from "@/lib/notebookExport/coverLines";
import { buildNotebookExportPayload, type NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import {
  getBooksWithActivityInYear,
  sortBooksByStartDate,
} from "@/lib/notebookExport/bookSelection";

export async function prepareNotebookExportPayload(input: {
  year: number;
  books: Book[];
  wishlist: import("@/types").WishlistItem[];
  monthlyFavorites: import("@/types").MonthlyFavorites;
  bracket: import("@/types").BookOfYearBracket;
  readingGoal: number;
  yearPixelLegends: import("@/types").YearlyPixelLegends;
  settings: NotebookExportSettings;
}): Promise<NotebookExportPayload> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const books = sortBooksByStartDate(
    getBooksWithActivityInYear(input.books, input.year),
  );
  const lineStyles = await buildBookLineStyles(books);

  return buildNotebookExportPayload({
    ...input,
    lineStyles,
    coverPaths: generateCoverLinePaths(lineStyles, 700, 700),
    verticalBarPaths: generateVerticalBarLines(lineStyles, 160, 680),
    origin,
  });
}
