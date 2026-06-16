import { Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { DotGridBackground, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function WishlistPage({ payload }: { payload: NotebookExportPayload }) {
  const mid = Math.ceil(payload.wishlist.length / 2) || 1;
  const left = payload.wishlist.slice(0, mid);
  const right = payload.wishlist.slice(mid);

  return (
    <Page size="A4" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <StickerImage payload={payload} stickerId="wishlistRibbon" style={{ width: 140, height: 40 }} />
        <StickerImage payload={payload} stickerId="wishlistFlower" style={{ width: 70, height: 70 }} />
      </View>
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 16, marginBottom: 12 }}>WISHLIST</Text>
      <View style={{ flexDirection: "row", gap: 20 }}>
        {[left, right].map((column, colIndex) => (
          <View key={colIndex} style={{ flex: 1 }}>
            {column.length === 0 ? (
              <Text style={pdfStyles.emptyCell}>—</Text>
            ) : (
              column.map((item) => (
                <View key={item.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Text style={{ width: 14, fontSize: 10 }}>{item.read ? "☑" : "☐"}</Text>
                  <Text style={{ fontSize: 9, flex: 1 }}>
                    {item.title}
                    {item.seriesLabel ? ` (${item.seriesLabel})` : ""}
                  </Text>
                </View>
              ))
            )}
            {column.length === 0 && colIndex === 1 && payload.wishlist.length === 0 && (
              <Text style={pdfStyles.emptyCell}>Sin entradas este año</Text>
            )}
          </View>
        ))}
      </View>
    </Page>
  );
}
