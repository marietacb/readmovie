import type { PixelLegendBand, YearlyPixelLegends } from "@/types";

export type { PixelLegendBand, YearlyPixelLegends };

/** Cuaderno 2025 */
export const DEFAULT_PIXEL_LEGEND_2025: PixelLegendBand[] = [
  { min: 1, max: 10, label: "01-10", color: "#a7f3d0" },
  { min: 11, max: 25, label: "11-25", color: "#bae6fd" },
  { min: 26, max: 40, label: "26-40", color: "#67e8f9" },
  { min: 41, max: 55, label: "41-55", color: "#fbcfe8" },
  { min: 56, max: 70, label: "56-70", color: "#fde68a" },
  { min: 71, max: 85, label: "71-85", color: "#60a5fa" },
  { min: 86, max: 100, label: "86-100", color: "#fdba74" },
  { min: 101, max: 125, label: "101-125", color: "#fca5a5" },
  { min: 126, max: 140, label: "126-140", color: "#c4b5fd" },
  { min: 141, max: null, label: "141+", color: "#e879f9" },
];

/** Cuaderno 2026 */
export const DEFAULT_PIXEL_LEGEND_2026: PixelLegendBand[] = [
  { min: 1, max: 4, label: "01-04", color: "#c8e6c9" },
  { min: 5, max: 14, label: "05-14", color: "#d1c4e9" },
  { min: 15, max: 24, label: "15-24", color: "#b3e5fc" },
  { min: 25, max: 39, label: "25-39", color: "#f8bbd0" },
  { min: 40, max: 59, label: "40-59", color: "#fff176" },
  { min: 60, max: 79, label: "60-79", color: "#42a5f5" },
  { min: 80, max: 99, label: "80-99", color: "#ffb74d" },
  { min: 100, max: 124, label: "100-124", color: "#ef5350" },
  { min: 125, max: 139, label: "125-139", color: "#ab47bc" },
  { min: 140, max: null, label: "+140", color: "#ec407a" },
];

export const PIXEL_LEGEND_PRESETS: Record<string, PixelLegendBand[]> = {
  "2025": DEFAULT_PIXEL_LEGEND_2025,
  "2026": DEFAULT_PIXEL_LEGEND_2026,
};

export function getDefaultLegendForYear(year: number): PixelLegendBand[] {
  if (year === 2026) return cloneBands(DEFAULT_PIXEL_LEGEND_2026);
  return cloneBands(DEFAULT_PIXEL_LEGEND_2025);
}

export function cloneBands(bands: PixelLegendBand[]): PixelLegendBand[] {
  return bands.map((band) => ({ ...band }));
}

export function normalizeYearPixelLegends(raw: unknown): YearlyPixelLegends {
  if (!raw || typeof raw !== "object") return {};

  const result: YearlyPixelLegends = {};
  Object.entries(raw as Record<string, unknown>).forEach(([yearKey, value]) => {
    const year = Number(yearKey);
    if (!Number.isFinite(year) || !Array.isArray(value)) return;
    const bands = normalizeBands(value);
    if (bands.length > 0) result[year] = bands;
  });
  return result;
}

function normalizeBands(raw: unknown[]): PixelLegendBand[] {
  return raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      min: Number(item.min ?? 0),
      max: item.max === null || item.max === undefined ? null : Number(item.max),
      label: String(item.label ?? "").trim(),
      color: normalizeHexColor(String(item.color ?? "")),
    }))
    .filter((band) => band.min >= 0 && band.color && (band.max === null || band.max >= band.min))
    .map((band) => ({
      ...band,
      label: band.label || formatBandLabel(band.min, band.max),
    }))
    .sort((a, b) => a.min - b.min);
}

function normalizeHexColor(value: string): string {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return "";
}

export function formatBandLabel(min: number, max: number | null): string {
  if (max === null) return min >= 140 ? `+${min}` : `${String(min).padStart(2, "0")}+`;
  if (min === max) return String(min).padStart(2, "0");
  return `${String(min).padStart(2, "0")}-${String(max).padStart(2, "0")}`;
}

export function resolvePixelLegend(
  legends: YearlyPixelLegends,
  year: number
): PixelLegendBand[] {
  return legends[year] ? cloneBands(legends[year]) : getDefaultLegendForYear(year);
}

export function getPixelBand(
  pages: number,
  bands: PixelLegendBand[]
): PixelLegendBand | null {
  if (pages <= 0) return null;
  return (
    bands.find((band) => pages >= band.min && (band.max === null || pages <= band.max)) ?? null
  );
}

export function getPixelColor(pages: number, bands: PixelLegendBand[]): string | undefined {
  if (pages <= 0) return undefined;
  const band = getPixelBand(pages, bands);
  return band?.color ?? bands[bands.length - 1]?.color;
}

export function sanitizeBandsForSave(bands: PixelLegendBand[]): PixelLegendBand[] {
  return normalizeBands(bands as unknown[]);
}
