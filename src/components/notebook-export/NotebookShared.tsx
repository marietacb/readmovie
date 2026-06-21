import type { CSSProperties, ReactNode } from "react";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { NOTEBOOK_STICKERS, type NotebookStickerId } from "@/lib/notebookExport/assets";
import { isStickerEnabled } from "@/lib/notebookExport/settings";
import type { CoverLinePath } from "@/lib/notebookExport/coverLines";
import { cn } from "@/lib/utils";

const MAGAZINE_BG = [
  "#1a2f4b",
  "#c4785a",
  "#6d8f6d",
  "#b8943f",
  "#8b5a6b",
  "#4a6fa5",
  "#2d4a6e",
  "#7a5c36",
];

const MAGAZINE_FONTS = [
  "var(--font-playfair), Georgia, serif",
  "var(--font-inter), system-ui, sans-serif",
  '"Special Elite", monospace',
  '"Caveat", cursive',
];

function magazineStyle(index: number, char: string) {
  if (char === " ") return { width: 8 };
  const code = char.charCodeAt(0) + index * 17;
  return {
    backgroundColor: MAGAZINE_BG[code % MAGAZINE_BG.length],
    fontFamily: MAGAZINE_FONTS[code % MAGAZINE_FONTS.length],
    transform: `rotate(${((code % 7) - 3) * 2}deg)`,
  };
}

export function ExportPage({
  children,
  variant = "dots",
  className,
}: {
  children: ReactNode;
  variant?: "dots" | "parchment" | "plain";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "nb-export-page",
        variant === "dots" && "nb-export-page--dots",
        variant === "parchment" && "nb-export-page--parchment",
        className,
      )}
      data-nb-page
    >
      <div className="nb-export-page__inner">{children}</div>
    </div>
  );
}

export function MagazineText({
  text,
  size = "md",
}: {
  text: string;
  size?: "lg" | "md" | "sm";
}) {
  return (
    <span className={cn("nb-magazine", `nb-magazine--${size}`)}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="nb-magazine__char"
          style={magazineStyle(i, char)}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}

export function YearTiles({ year }: { year: number }) {
  return (
    <div className="nb-year-tiles">
      {String(year)
        .split("")
        .map((digit, i) => (
          <span key={i} className="nb-year-tile">
            {digit}
          </span>
        ))}
    </div>
  );
}

export function Sticker({
  payload,
  id,
  className,
  style,
}: {
  payload: NotebookExportPayload;
  id: NotebookStickerId;
  className?: string;
  style?: CSSProperties;
}) {
  if (!isStickerEnabled(payload.settings, id)) return null;
  const asset = NOTEBOOK_STICKERS[id];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset.path} alt="" className={cn("nb-sticker", className)} style={style} />
  );
}

export function StarRow({ rating }: { rating: number }) {
  return (
    <div className="nb-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "nb-stars__star",
            i < Math.round(rating) ? "nb-stars__star--on" : "nb-stars__star--off",
          )}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function HighlighterLabel({ children }: { children: ReactNode }) {
  return <span className="nb-label">{children}</span>;
}

export function CoverSvg({
  paths,
  width = 700,
  height = 700,
}: {
  paths: CoverLinePath[];
  width?: number;
  height?: number;
}) {
  return (
    <svg
      className="nb-cover-art"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width, height }}
    >
      {paths.map((line, index) => (
        <path
          key={index}
          d={line.d}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          fill={line.strokeWidth === 0 ? line.color : "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.92}
        />
      ))}
    </svg>
  );
}
