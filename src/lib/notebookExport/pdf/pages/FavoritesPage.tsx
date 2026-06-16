import { Image, Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { MONTH_NAMES } from "@/lib/constants";
import type { Month } from "@/types";
import { DotGridBackground, MagazineWord, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

export function FavoritesPage({ payload }: { payload: NotebookExportPayload }) {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1) as Month);

  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
        <View style={{ width: 200 }}>
          {payload.settings.favoritePhotoUrl ? (
            <Image
              src={payload.settings.favoritePhotoUrl}
              style={{ width: 180, height: 240, objectFit: "cover" }}
            />
          ) : (
            <View
              style={{
                width: 180,
                height: 240,
                borderWidth: 1,
                borderColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={pdfStyles.emptyCell}>Tu foto</Text>
            </View>
          )}
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, marginTop: 6 }}>
            {payload.settings.favoritePhotoCaption}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <MagazineWord word="Favourite BOOKS" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 6 }}>
            {months.map((month) => {
              const bookId = payload.monthlyFavorites[month];
              const book = bookId ? payload.books.find((b) => b.id === bookId) : undefined;
              return (
                <View key={month} style={{ width: "23%", alignItems: "center", marginBottom: 6 }}>
                  {book?.coverUrl ? (
                    <Image src={book.coverUrl} style={{ width: 50, height: 72, objectFit: "cover" }} />
                  ) : (
                    <View
                      style={{
                        width: 50,
                        height: 72,
                        backgroundColor: book?.spineColor ?? "#f0ece6",
                        borderWidth: 0.5,
                        borderColor: "#ccc",
                      }}
                    />
                  )}
                  <Text style={{ fontSize: 6, marginTop: 2, textAlign: "center" }}>
                    {MONTH_NAMES[month]}
                  </Text>
                </View>
              );
            })}
          </View>
          <StickerImage
            payload={payload}
            stickerId="favoritesTrophy"
            style={{ width: 50, height: 50, position: "absolute", right: 20, bottom: 20 }}
          />
        </View>
      </View>
    </Page>
  );
}
