import { Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { formatRatingDisplay } from "@/lib/notebookExport/buildExportData";
import { DotGridBackground } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

const ROWS = 20;

export function MasterTablePage({ payload }: { payload: NotebookExportPayload }) {
  const rows = Array.from({ length: ROWS }, (_, i) => payload.books[i]);

  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Times-Italic", fontSize: 12, marginBottom: 6 }}>TITLE</Text>
          <View style={pdfStyles.tableRow}>
            {["#", "TITLE", "AUTHOR", "PAGES", "CHAPT."].map((h) => (
              <Text key={h} style={[pdfStyles.tableCell, { flex: h === "#" ? 0.3 : 1, fontFamily: "Helvetica-Bold", fontSize: 6 }]}>
                {h}
              </Text>
            ))}
          </View>
          {rows.map((book, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: 14 }]}>{index + 1}</Text>
              {book ? (
                <>
                  <Text style={[pdfStyles.tableCell, { flex: 1.4 }]}>{book.title}</Text>
                  <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{book.author}</Text>
                  <Text style={[pdfStyles.tableCell, { flex: 0.5 }]}>{book.pages ?? "—"}</Text>
                  <Text style={[pdfStyles.tableCell, { flex: 0.5 }]}>{book.totalChapters ?? "—"}</Text>
                </>
              ) : (
                <Text style={[pdfStyles.emptyCell, { flex: 1 }]}>—</Text>
              )}
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Times-Italic", fontSize: 12, marginBottom: 6 }}>
            FAVOURITE CHARACTERS
          </Text>
          <View style={pdfStyles.tableRow}>
            {["#", "CHARACTERS", "START", "END", "STARS"].map((h) => (
              <Text key={h} style={[pdfStyles.tableCell, { flex: h === "#" ? 0.3 : 1, fontFamily: "Helvetica-Bold", fontSize: 6 }]}>
                {h}
              </Text>
            ))}
          </View>
          {rows.map((book, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, { width: 14 }]}>{index + 1}</Text>
              {book ? (
                <>
                  <Text style={[pdfStyles.tableCell, { flex: 1.4 }]}>{book.characters || "—"}</Text>
                  <Text style={[pdfStyles.tableCell, { flex: 0.7 }]}>
                    {book.startDate ? book.startDate.slice(0, 10).split("-").reverse().join("/") : "—"}
                  </Text>
                  <Text style={[pdfStyles.tableCell, { flex: 0.7 }]}>
                    {book.endDate ? book.endDate.slice(0, 10).split("-").reverse().join("/") : "—"}
                  </Text>
                  <Text style={[pdfStyles.tableCell, { flex: 0.5 }]}>
                    {formatRatingDisplay(book.rating)}
                  </Text>
                </>
              ) : (
                <Text style={[pdfStyles.emptyCell, { flex: 1 }]}>—</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
