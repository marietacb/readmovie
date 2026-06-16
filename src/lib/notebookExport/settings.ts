import {
  DEFAULT_ENABLED_STICKERS,
  type NotebookStickerId,
} from "@/lib/notebookExport/assets";
import type { YearlyNotebookExportSettings } from "@/types";

export const DEFAULT_FAVORITE_CAPTION = "THOR LECTOR ❤️";

export const DEFAULT_COVER_QUOTE =
  "I lived in books more than I lived anywhere else";

export function emptyNotebookExportSettings(): import("@/types").NotebookExportSettings {
  return {
    favoritePhotoUrl: undefined,
    favoritePhotoCaption: DEFAULT_FAVORITE_CAPTION,
    coverQuote: DEFAULT_COVER_QUOTE,
    enabledStickerIds: [...DEFAULT_ENABLED_STICKERS],
  };
}

export function normalizeYearlyNotebookExportSettings(
  raw: unknown,
): YearlyNotebookExportSettings {
  if (!raw || typeof raw !== "object") return {};

  const result: YearlyNotebookExportSettings = {};

  for (const [yearKey, value] of Object.entries(raw as Record<string, unknown>)) {
    const year = Number(yearKey);
    if (!Number.isFinite(year)) continue;
    if (!value || typeof value !== "object") continue;

    const entry = value as Record<string, unknown>;
    const enabledRaw = entry.enabledStickerIds;
    const enabledStickerIds = Array.isArray(enabledRaw)
      ? enabledRaw.filter((id): id is NotebookStickerId => typeof id === "string")
      : [...DEFAULT_ENABLED_STICKERS];

    result[year] = {
      favoritePhotoUrl:
        typeof entry.favoritePhotoUrl === "string" ? entry.favoritePhotoUrl : undefined,
      favoritePhotoCaption:
        typeof entry.favoritePhotoCaption === "string"
          ? entry.favoritePhotoCaption
          : DEFAULT_FAVORITE_CAPTION,
      coverQuote:
        typeof entry.coverQuote === "string" ? entry.coverQuote : DEFAULT_COVER_QUOTE,
      enabledStickerIds,
    };
  }

  return result;
}

export function getNotebookExportSettingsForYear(
  yearly: YearlyNotebookExportSettings,
  year: number,
) {
  return yearly[year] ?? emptyNotebookExportSettings();
}

export function setNotebookExportSettingsForYear(
  yearly: YearlyNotebookExportSettings,
  year: number,
  settings: import("@/types").NotebookExportSettings,
): YearlyNotebookExportSettings {
  return { ...yearly, [year]: settings };
}

export function isStickerEnabled(
  settings: import("@/types").NotebookExportSettings,
  stickerId: NotebookStickerId,
): boolean {
  return settings.enabledStickerIds.includes(stickerId);
}
