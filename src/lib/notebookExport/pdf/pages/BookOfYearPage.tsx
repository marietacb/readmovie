import { Image, Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { buildBracketMatches } from "@/lib/bookOfYear";
import { MONTH_NAMES } from "@/lib/constants";
import type { Month } from "@/types";
import { DotGridBackground, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

function monthAbbrev(month: Month): string {
  return MONTH_NAMES[month].slice(0, 3).toUpperCase();
}

export function BookOfYearPage({ payload }: { payload: NotebookExportPayload }) {
  const matches = buildBracketMatches(payload.monthlyFavorites, payload.bracket);
  const r1 = matches.filter((m) => m.round === "r1");
  const winner = payload.bookOfYearId
    ? payload.books.find((b) => b.id === payload.bookOfYearId)
    : undefined;

  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <StickerImage payload={payload} stickerId="vineLeaves" style={{ width: 500, height: 30 }} />
      <Text style={{ fontFamily: "Times-Italic", fontSize: 16, textAlign: "center", marginVertical: 6 }}>
        my book of the year
      </Text>
      <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
        <View style={{ width: 140 }}>
          {r1.map((match, i) => (
            <View key={match.id} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 5, color: "#888" }}>
                {monthAbbrev((i * 2 + 1) as Month)} / {monthAbbrev((i * 2 + 2) as Month)}
              </Text>
              <Text style={{ fontSize: 6, borderWidth: 0.5, borderColor: "#999", padding: 2 }}>
                {match.leftLabel.slice(0, 18)}
              </Text>
              <Text style={{ fontSize: 6, borderWidth: 0.5, borderColor: "#999", padding: 2, marginTop: 1 }}>
                {match.rightLabel.slice(0, 18)}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {winner?.coverUrl ? (
            <Image src={winner.coverUrl} style={{ width: 80, height: 110, objectFit: "cover" }} />
          ) : (
            <View style={{ width: 80, height: 110, borderWidth: 1, borderColor: "#999" }} />
          )}
          <Text style={{ fontSize: 8, marginTop: 4, textAlign: "center" }}>
            {winner?.title ?? "Ganador pendiente"}
          </Text>
        </View>
        <View style={{ width: 100, alignItems: "center" }}>
          <StickerImage payload={payload} stickerId="bookOfYearCrown" style={{ width: 50, height: 40 }} />
          <StickerImage payload={payload} stickerId="bookOfYearMedals" style={{ width: 70, height: 30, marginTop: 8 }} />
        </View>
      </View>
    </Page>
  );
}
