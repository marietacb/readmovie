import { Image, Text, View } from "@react-pdf/renderer";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { isStickerEnabled } from "@/lib/notebookExport/settings";
import { NOTEBOOK_STICKERS } from "@/lib/notebookExport/assets";
import type { NotebookStickerId } from "@/lib/notebookExport/assets";

export function DotGridBackground() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.35,
      }}
    >
      {Array.from({ length: 55 }).map((_, row) =>
        Array.from({ length: 38 }).map((__, col) => (
          <View
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              left: col * 16,
              top: row * 16,
              width: 1.5,
              height: 1.5,
              borderRadius: 1,
              backgroundColor: "#d0d0d0",
            }}
          />
        )),
      )}
    </View>
  );
}

export function StickerImage({
  payload,
  stickerId,
  style,
}: {
  payload: NotebookExportPayload;
  stickerId: NotebookStickerId;
  style?: Record<string, number | string>;
}) {
  if (!isStickerEnabled(payload.settings, stickerId)) return null;
  const asset = NOTEBOOK_STICKERS[stickerId];
  return (
    <Image
      src={`${payload.origin}${asset.path}`}
      style={{ objectFit: "contain", ...style }}
    />
  );
}

export function MagazineYear({ year }: { year: number }) {
  const digits = String(year).split("");
  const colors = ["#1a2f4b", "#c4785a", "#6d8f6d", "#b8943f"];
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
      {digits.map((digit, i) => (
        <Text
          key={`${digit}-${i}`}
          style={{
            fontFamily: "Times-Bold",
            fontSize: 42,
            color: "#ffffff",
            backgroundColor: colors[i % colors.length],
            paddingHorizontal: 10,
            paddingVertical: 4,
            marginHorizontal: 3,
          }}
        >
          {digit}
        </Text>
      ))}
    </View>
  );
}

export function MagazineWord({ word }: { word: string }) {
  const palette = ["#1a2f4b", "#c4785a", "#6d8f6d", "#b8943f", "#8b5a6b", "#4a6fa5"];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
      {word.split("").map((char, i) => (
        <Text
          key={`${char}-${i}`}
          style={{
            fontFamily: i % 2 === 0 ? "Times-Bold" : "Helvetica-Bold",
            fontSize: char === " " ? 6 : 14,
            color: "#ffffff",
            backgroundColor: palette[i % palette.length],
            paddingHorizontal: char === " " ? 2 : 5,
            paddingVertical: 2,
            margin: 1,
          }}
        >
          {char === " " ? "" : char}
        </Text>
      ))}
    </View>
  );
}

export function StarRow({ rating, size = 8 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i < Math.round(rating) ? "#F5C518" : "#d0d0d0",
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}
