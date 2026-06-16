import { Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { DotGridBackground, MagazineYear } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function CoverPage({ payload }: { payload: NotebookExportPayload }) {
  return (
    <Page size="A4" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Svg width={520} height={520} viewBox="0 0 520 520">
          {payload.coverPaths.map((line, index) => (
            <Path
              key={index}
              d={line.d}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </Svg>
        <View style={{ position: "absolute" }}>
          <MagazineYear year={payload.year} />
        </View>
      </View>
      <Text style={pdfStyles.subtitle}>Diario.com — Lecturas {payload.year}</Text>
    </Page>
  );
}
