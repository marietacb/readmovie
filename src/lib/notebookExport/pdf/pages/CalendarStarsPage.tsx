import { Page, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { ratingColor } from "@/lib/notebookExport/buildExportData";
import { MONTH_NAMES } from "@/lib/constants";
import type { Month } from "@/types";
import { DotGridBackground, MagazineWord, StickerImage } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

function MiniMonthCalendar({
  payload,
  month,
}: {
  payload: NotebookExportPayload;
  month: Month;
}) {
  const daysInMonth = new Date(payload.year, month, 0).getDate();

  return (
    <View style={{ width: "23%", marginBottom: 6 }}>
      <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
        {MONTH_NAMES[month].slice(0, 3)}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", width: 84 }}>
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const date = `${payload.year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const book = payload.books.find((b) => b.endDate?.slice(0, 10) === date);
          return (
            <View
              key={day}
              style={{
                width: 10,
                height: 6,
                margin: 0.5,
                backgroundColor: book ? ratingColor(book.rating) : "transparent",
                borderWidth: 0.25,
                borderColor: "#ccc",
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export function CalendarStarsPage({ payload }: { payload: NotebookExportPayload }) {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1) as Month);
  const displayBooks = payload.books.slice(0, 20);

  return (
    <Page size="A4" orientation="landscape" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MagazineWord word="CALENDAR COLOR" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
            {months.map((month) => (
              <MiniMonthCalendar key={month} payload={payload} month={month} />
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <StickerImage payload={payload} stickerId="starsDecoration" style={{ width: 200, height: 24 }} />
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 18, textAlign: "center", marginVertical: 4 }}>
            STARS
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <View key={star} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 6 }}>{star}</Text>
                <View style={{ width: 12, height: 8, backgroundColor: ratingColor(star) }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#1a2f4b",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 20 }}>{payload.readingGoal}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {displayBooks.map((book, index) => (
                <View key={book.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <Text style={{ width: 12, fontSize: 6 }}>{index + 1}</Text>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <View
                      key={star}
                      style={{
                        width: 14,
                        height: 8,
                        marginRight: 1,
                        backgroundColor:
                          Math.round(book.rating) === star ? ratingColor(book.rating) : "#f5f5f5",
                        borderWidth: 0.25,
                        borderColor: "#ddd",
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}
