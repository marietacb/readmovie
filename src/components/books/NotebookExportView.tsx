"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Caveat, Special_Elite } from "next/font/google";
import { Download, Eye, ImageIcon, Loader2 } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { YearSelector } from "@/components/ui/YearSelector";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { NOTEBOOK_STICKERS } from "@/lib/notebookExport/assets";
import {
  getNotebookExportSettingsForYear,
  DEFAULT_FAVORITE_CAPTION,
  DEFAULT_COVER_QUOTE,
} from "@/lib/notebookExport/settings";
import { getBooksWithActivityInYear } from "@/lib/notebookExport/bookSelection";
import { getTrackerYears } from "@/lib/trackerYears";
import { prepareNotebookExportPayload } from "@/lib/notebookExport/prepareExportPayload";
import { generatePdfFromHtml } from "@/lib/notebookExport/generatePdfFromHtml";
import type { NotebookExportPayload } from "@/lib/notebookExport/buildExportData";
import { NotebookHtmlPages } from "@/components/notebook-export/NotebookPages";
import type { NotebookExportSettings } from "@/types";
import type { NotebookStickerId } from "@/lib/notebookExport/assets";
import "@/components/notebook-export/notebook-export.css";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "600", "700"] });
const specialElite = Special_Elite({ subsets: ["latin"], weight: "400" });

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function NotebookExportView() {
  const {
    books,
    wishlist,
    readingGoal,
    monthlyFavorites,
    bookOfYearBrackets,
    yearPixelLegends,
    notebookExportSettings,
    setNotebookExportSettings,
    getMonthlyFavoritesForYear,
    getBookOfYearBracket,
  } = useMediaTracker();

  const years = useMemo(
    () => getTrackerYears(books, wishlist, monthlyFavorites, bookOfYearBrackets),
    [books, wishlist, monthlyFavorites, bookOfYearBrackets],
  );

  const [year, setYear] = useState(() => years[0] ?? new Date().getFullYear());
  const [downloading, setDownloading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<NotebookExportPayload | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);

  const settings = useMemo(
    () => getNotebookExportSettingsForYear(notebookExportSettings, year),
    [notebookExportSettings, year],
  );

  const activeYear = years.includes(year) ? year : years[0] ?? year;
  const booksInYear = useMemo(
    () => getBooksWithActivityInYear(books, activeYear),
    [books, activeYear],
  );

  const exportInput = useMemo(
    () => ({
      year: activeYear,
      books,
      wishlist,
      monthlyFavorites: getMonthlyFavoritesForYear(activeYear),
      bracket: getBookOfYearBracket(activeYear),
      readingGoal,
      yearPixelLegends,
      settings,
    }),
    [
      activeYear,
      books,
      wishlist,
      getMonthlyFavoritesForYear,
      getBookOfYearBracket,
      readingGoal,
      yearPixelLegends,
      settings,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    setPreparing(true);
    void prepareNotebookExportPayload(exportInput)
      .then((data) => {
        if (!cancelled) setPayload(data);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo preparar la vista previa");
      })
      .finally(() => {
        if (!cancelled) setPreparing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [exportInput]);

  const updateSettings = (patch: Partial<NotebookExportSettings>) => {
    setNotebookExportSettings(activeYear, { ...settings, ...patch });
  };

  const toggleSticker = (stickerId: NotebookStickerId) => {
    const enabled = settings.enabledStickerIds.includes(stickerId);
    updateSettings({
      enabledStickerIds: enabled
        ? settings.enabledStickerIds.filter((id) => id !== stickerId)
        : [...settings.enabledStickerIds, stickerId],
    });
  };

  const handlePhoto = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateSettings({ favoritePhotoUrl: dataUrl });
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setDownloading(true);
    setError(null);
    try {
      await generatePdfFromHtml(
        exportRef.current,
        `diario-lecturas-${activeYear}.pdf`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar el PDF");
    } finally {
      setDownloading(false);
    }
  };

  const fontClass = `${caveat.className} ${specialElite.className}`;

  return (
    <div className={`space-y-6 ${fontClass}`}>
      <PanelHeader
        title="Exportar cuaderno"
        subtitle="Vista previa HTML fiel a tu scrapbook — descarga en PDF"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="bj-btn-secondary inline-flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Ocultar" : "Ver"} previa
            </button>
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading || preparing || !payload}
              className="bj-btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Descargar PDF {activeYear}
            </button>
          </div>
        }
      />

      <div className="bj-panel flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-medium text-bj-navy">Año del cuaderno</p>
          <p className="text-xs text-bj-muted">
            {booksInYear.length} lecturas con actividad en {activeYear}
            {preparing ? " · actualizando vista previa…" : ""}
          </p>
        </div>
        <YearSelector years={years} year={activeYear} onChange={setYear} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showPreview && payload && (
        <section className="bj-panel p-4">
          <h3 className="mb-3 font-serif text-lg font-semibold text-bj-navy">Vista previa</h3>
          <div className="nb-preview-scaler">
            <div
              className="nb-preview-scaler__inner"
              style={{ transform: "scale(0.38)", width: 794, marginBottom: -680 }}
            >
              <NotebookHtmlPages payload={payload} />
            </div>
          </div>
        </section>
      )}

      {/* Contenedor oculto a tamaño real para captura PDF */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -12000, top: 0, pointerEvents: "none" }}
      >
        <div ref={exportRef} className="nb-export-root">
          {payload && <NotebookHtmlPages payload={payload} />}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bj-panel space-y-4 p-5">
          <h3 className="font-serif text-lg font-semibold text-bj-navy">Foto favoritos del mes</h3>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-36 w-28 items-center justify-center overflow-hidden rounded-xl border border-bj-border bg-bj-surface">
              {settings.favoritePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.favoritePhotoUrl}
                  alt="Foto del cuaderno"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-bj-muted/40" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <label className="block text-sm text-bj-muted">
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm"
                  onChange={(e) => void handlePhoto(e.target.files?.[0] ?? null)}
                />
              </label>
              <label className="block text-sm text-bj-muted">
                Pie de foto
                <input
                  type="text"
                  value={settings.favoritePhotoCaption ?? DEFAULT_FAVORITE_CAPTION}
                  onChange={(e) => updateSettings({ favoritePhotoCaption: e.target.value })}
                  className="bj-input mt-1"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="bj-panel space-y-4 p-5">
          <h3 className="font-serif text-lg font-semibold text-bj-navy">Frase de portada</h3>
          <textarea
            value={settings.coverQuote ?? DEFAULT_COVER_QUOTE}
            onChange={(e) => updateSettings({ coverQuote: e.target.value })}
            rows={3}
            className="bj-input"
          />
        </section>

        <section className="bj-panel space-y-4 p-5 lg:col-span-2">
          <h3 className="font-serif text-lg font-semibold text-bj-navy">Pegatinas decorativas</h3>
          <p className="text-sm text-bj-muted">
            Sustituye las imágenes en{" "}
            <code className="text-xs">public/notebook-assets/stickers/</code> por tus PNGs reales.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(NOTEBOOK_STICKERS) as NotebookStickerId[]).map((stickerId) => {
              const sticker = NOTEBOOK_STICKERS[stickerId];
              const checked = settings.enabledStickerIds.includes(stickerId);
              return (
                <label
                  key={stickerId}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-bj-border px-3 py-2 hover:bg-bj-surface/50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSticker(stickerId)}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sticker.path} alt="" className="h-8 w-8 object-contain" />
                  <span className="text-sm text-bj-navy">{sticker.label}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
