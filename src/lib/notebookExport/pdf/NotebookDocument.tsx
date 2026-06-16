import { Document } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { CoverPage } from "@/lib/notebookExport/pdf/pages/CoverPage";
import { IntroPage } from "@/lib/notebookExport/pdf/pages/IntroPage";
import { WishlistPage } from "@/lib/notebookExport/pdf/pages/WishlistPage";
import { YearPixelsPage } from "@/lib/notebookExport/pdf/pages/YearPixelsPage";
import { TrackerOverviewPage } from "@/lib/notebookExport/pdf/pages/TrackerOverviewPage";
import { MasterTablePage } from "@/lib/notebookExport/pdf/pages/MasterTablePage";
import { FavoritesPage } from "@/lib/notebookExport/pdf/pages/FavoritesPage";
import { BookOfYearPage } from "@/lib/notebookExport/pdf/pages/BookOfYearPage";
import { ScrapbookPages } from "@/lib/notebookExport/pdf/pages/ScrapbookPages";
import { CalendarStarsPage } from "@/lib/notebookExport/pdf/pages/CalendarStarsPage";

export function NotebookDocument({ payload }: { payload: NotebookExportPayload }) {
  return (
    <Document
      title={`Diario lecturas ${payload.year}`}
      author="Diario.com"
      subject={`Cuaderno de lecturas ${payload.year}`}
    >
      <CoverPage payload={payload} />
      <IntroPage payload={payload} />
      <WishlistPage payload={payload} />
      <YearPixelsPage payload={payload} />
      <TrackerOverviewPage payload={payload} />
      <MasterTablePage payload={payload} />
      <FavoritesPage payload={payload} />
      <BookOfYearPage payload={payload} />
      <ScrapbookPages payload={payload} />
      <CalendarStarsPage payload={payload} />
    </Document>
  );
}
