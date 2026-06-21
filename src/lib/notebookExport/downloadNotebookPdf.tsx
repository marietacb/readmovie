import { prepareNotebookExportPayload } from "@/lib/notebookExport/prepareExportPayload";
import { generatePdfFromHtml } from "@/lib/notebookExport/generatePdfFromHtml";
import type { Book } from "@/types";
import type { NotebookExportSettings } from "@/types";

export async function downloadNotebookPdf(
  input: {
    year: number;
    books: Book[];
    wishlist: import("@/types").WishlistItem[];
    monthlyFavorites: import("@/types").MonthlyFavorites;
    bracket: import("@/types").BookOfYearBracket;
    readingGoal: number;
    yearPixelLegends: import("@/types").YearlyPixelLegends;
    settings: NotebookExportSettings;
  },
  container: HTMLElement,
): Promise<void> {
  await prepareNotebookExportPayload(input);
  await generatePdfFromHtml(container, `diario-lecturas-${input.year}.pdf`);
}

export { prepareNotebookExportPayload };
