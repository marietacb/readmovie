import { Image, Page, Text, View } from "@react-pdf/renderer";
import type { Book } from "@/types";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import {
  formatBookDates,
  formatBookFormatLabel,
} from "@/lib/notebookExport/buildExportData";
import { DotGridBackground, StarRow } from "@/lib/notebookExport/pdf/shared";
import { pdfStyles } from "@/lib/notebookExport/pdf/styles";

function ScrapbookEntry({
  book,
  index,
}: {
  book: Book;
  index: number;
}) {
  const imageRight = index % 2 === 1;
  const cover = (
    <View style={{ width: 56, alignItems: "center" }}>
      {book.coverUrl ? (
        <Image src={book.coverUrl} style={{ width: 52, height: 74, objectFit: "cover" }} />
      ) : (
        <View
          style={{
            width: 52,
            height: 74,
            backgroundColor: book.spineColor,
            borderWidth: 0.5,
            borderColor: "#ccc",
          }}
        />
      )}
      <StarRow rating={book.rating} size={7} />
    </View>
  );

  const fields = (
    <View style={{ flex: 1 }}>
      {[
        ["BOOK", book.title],
        ["AUTHOR", book.author],
        ["FORMAT", formatBookFormatLabel(book.format)],
        ["GENRE", book.genre ?? ""],
        ["PAGES", book.pages?.toString() ?? ""],
        ["DATES", formatBookDates(book)],
      ].map(([label, value]) =>
        value ? (
          <View key={label} style={{ marginBottom: 2 }}>
            <Text style={pdfStyles.label}>{label}</Text>
            <Text style={pdfStyles.value}>{value.toUpperCase()}</Text>
          </View>
        ) : null,
      )}
    </View>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e0d8",
      }}
    >
      {imageRight ? (
        <>
          {fields}
          {cover}
        </>
      ) : (
        <>
          {cover}
          {fields}
        </>
      )}
    </View>
  );
}

function ScrapbookSheet({
  payload,
  startIndex,
  count,
}: {
  payload: NotebookExportPayload;
  startIndex: number;
  count: number;
}) {
  const slice = payload.books.slice(startIndex, startIndex + count);

  return (
    <Page size="A4" style={pdfStyles.dotPage}>
      <DotGridBackground />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          {slice.slice(0, Math.ceil(count / 2)).map((book, i) => (
            <ScrapbookEntry key={book.id} book={book} index={startIndex + i} />
          ))}
        </View>
        <View style={{ width: 1, backgroundColor: "#1a2f4b" }} />
        <View style={{ flex: 1 }}>
          {slice.slice(Math.ceil(count / 2)).map((book, i) => (
            <ScrapbookEntry
              key={book.id}
              book={book}
              index={startIndex + Math.ceil(count / 2) + i}
            />
          ))}
          {slice.length === 0 && (
            <Text style={pdfStyles.emptyCell}>Sin lecturas registradas</Text>
          )}
        </View>
      </View>
    </Page>
  );
}

export function ScrapbookPages({ payload }: { payload: NotebookExportPayload }) {
  const perPage = 10;
  const pages = Math.max(1, Math.ceil(payload.books.length / perPage));

  return (
    <>
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <ScrapbookSheet
          key={pageIndex}
          payload={payload}
          startIndex={pageIndex * perPage}
          count={perPage}
        />
      ))}
    </>
  );
}
