import { Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { getTrackerSlotColor } from "@/lib/notebookExport/buildExportData";
import { DotGridBackground, MagazineWord, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function TrackerOverviewPage({ payload }: { payload: NotebookExportPayload }) {
  const slots = Array.from({ length: payload.readingGoal }, (_, i) => payload.books[i]);

  return (
    <Page size="A4" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Times-Italic", fontSize: 14, marginBottom: 8 }}>
            book tracker
          </Text>
          <StickerImage payload={payload} stickerId="trackerMoon" style={{ width: 36, height: 36 }} />
          <View style={{ marginTop: 8 }}>
            {Array.from({ length: 4 }).map((_, row) => (
              <View key={row} style={{ flexDirection: "row", marginBottom: 4 }}>
                {Array.from({ length: 10 }).map((__, col) => {
                  const index = row * 10 + col;
                  const book = slots[index];
                  return (
                    <View
                      key={index}
                      style={{
                        width: 22,
                        height: 22,
                        margin: 1,
                        borderWidth: 1,
                        borderColor: "#1a2f4b",
                        backgroundColor: getTrackerSlotColor(book, index),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 6 }}>{index + 1}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          <Text style={{ fontFamily: "Helvetica-Bold", marginTop: 6 }}>
            GOAL {payload.readingGoal}
          </Text>
        </View>
        <View style={{ flex: 1.2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MagazineWord word="OVERVIEW" />
            <StickerImage payload={payload} stickerId="overviewRose" style={{ width: 40, height: 80 }} />
          </View>
          <View style={{ marginTop: 8 }}>
            <View style={[pdfStyles.tableRow, { borderBottomWidth: 1 }]}>
              {["", "BOOKS", "PAGES", "CHAPT.", "5★", "EBOOK", "PHYS.", "SER."].map((h) => (
                <Text key={h} style={[pdfStyles.tableCell, { flex: h ? 1 : 0.4, fontFamily: "Helvetica-Bold", fontSize: 6 }]}>
                  {h}
                </Text>
              ))}
            </View>
            {payload.overview.map((row) => (
              <View key={row.month} style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { width: 16 }]}>{row.roman}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.booksFinished || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.pagesRead || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.chaptersRead || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.fiveStars || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.ebook || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.physical || "—"}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{row.series || "—"}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
}
