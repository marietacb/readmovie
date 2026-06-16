import React from "react";
import type { Book } from "@/types";
import type { NotebookExportSettings } from "@/types";
import { buildBookLineStyles } from "@/lib/notebookExport/colors";
import {
  generateCoverLinePaths,
  generateVerticalBarLines,
} from "@/lib/notebookExport/coverLines";
import { buildNotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import {
  getBooksWithActivityInYear,
  sortBooksByStartDate,
} from "@/lib/notebookExport/bookSelection";

export async function downloadNotebookPdf(input: {
  year: number;
  books: Book[];
  wishlist: import("@/types").WishlistItem[];
  monthlyFavorites: import("@/types").MonthlyFavorites;
  bracket: import("@/types").BookOfYearBracket;
  readingGoal: number;
  yearPixelLegends: import("@/types").YearlyPixelLegends;
  settings: NotebookExportSettings;
}) {
  const { pdf } = await import("@react-pdf/renderer");
  const { NotebookDocument } = await import(
    "@/lib/notebookExport/pdf/NotebookDocument"
  );

  const origin = window.location.origin;
  const books = sortBooksByStartDate(
    getBooksWithActivityInYear(input.books, input.year),
  );
  const lineStyles = await buildBookLineStyles(books);

  const payload = buildNotebookExportPayload({
    ...input,
    lineStyles,
    coverPaths: generateCoverLinePaths(lineStyles, 520, 520),
    verticalBarPaths: generateVerticalBarLines(lineStyles, 180, 700),
    origin,
  });

  const blob = await pdf(<NotebookDocument payload={payload} />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `diario-lecturas-${input.year}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
