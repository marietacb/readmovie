import { Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { DotGridBackground, MagazineWord, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function IntroPage({ payload }: { payload: NotebookExportPayload }) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ backgroundColor: "#f5ede0", padding: 24, borderRadius: 4, minHeight: 760 }}>
        <MagazineWord word="BOOK JOURNAL" />
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <StickerImage
            payload={payload}
            stickerId="introBookshelf"
            style={{ width: 320, height: 200 }}
          />
        </View>
        <Text style={{ ...pdfStyles.quote, marginTop: 24 }}>
          {payload.settings.coverQuote}
        </Text>
        <View style={{ marginTop: "auto", alignItems: "center", paddingTop: 40 }}>
          <MagazineWord word={String(payload.year)} />
        </View>
      </View>
    </Page>
  );
}
