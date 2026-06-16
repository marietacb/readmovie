import { Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { getPixelColor } from "@/lib/pixelLegends";
import { MONTH_INITIALS } from "@/lib/yearInPixels";
import { DotGridBackground, MagazineWord } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function YearPixelsPage({ payload }: { payload: NotebookExportPayload }) {
  const cell = 11;

  return (
    <Page size="A4" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ width: 180 }}>
          <Svg width={180} height={700} viewBox="0 0 180 700">
            {payload.verticalBarPaths.map((bar, i) => (
              <Path key={i} d={bar.d} fill={bar.color} />
            ))}
          </Svg>
          <Text style={{ ...pdfStyles.quote, fontSize: 8, marginTop: 8 }}>
            {payload.settings.coverQuote}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <MagazineWord word="Year in Pixels" />
          <View style={{ flexDirection: "row", marginTop: 8, marginLeft: 18 }}>
            {MONTH_INITIALS.map((m) => (
              <Text key={m} style={{ width: cell, fontSize: 6, textAlign: "center" }}>
                {m}
              </Text>
            ))}
          </View>
          {payload.pixelGrid.map((row, dayIndex) => (
            <View key={dayIndex} style={{ flexDirection: "row", marginLeft: 18 }}>
              {row.map((cellData) => {
                const color =
                  cellData.valid && cellData.pages > 0
                    ? getPixelColor(cellData.pages, payload.pixelLegend) ?? "#e5e0d8"
                    : "#fafafa";
                return (
                  <View
                    key={`${cellData.month}-${cellData.day}`}
                    style={{
                      width: cell,
                      height: cell,
                      backgroundColor: cellData.valid ? color : "transparent",
                      borderWidth: 0.25,
                      borderColor: "#ddd",
                    }}
                  />
                );
              })}
            </View>
          ))}
          <View style={{ marginTop: 10 }}>
            <Text style={pdfStyles.tableHeader}>Pages</Text>
            {payload.pixelLegend.map((band) => (
              <View key={band.label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: band.color,
                    marginRight: 4,
                    borderWidth: 0.25,
                    borderColor: "#ccc",
                  }}
                />
                <Text style={{ fontSize: 6 }}>{band.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
}
