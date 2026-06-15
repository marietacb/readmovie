"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Settings2 } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import {
  DEFAULT_PIXEL_LEGEND_2025,
  DEFAULT_PIXEL_LEGEND_2026,
  cloneBands,
  formatBandLabel,
  getDefaultLegendForYear,
  resolvePixelLegend,
  sanitizeBandsForSave,
  type PixelLegendBand,
} from "@/lib/pixelLegends";

interface YearPixelLegendEditorProps {
  year: number;
}

function emptyBand(previous?: PixelLegendBand): PixelLegendBand {
  const min = previous ? (previous.max ?? previous.min) + 1 : 1;
  return {
    min,
    max: min + 9,
    label: formatBandLabel(min, min + 9),
    color: "#c8e6c9",
  };
}

export function YearPixelLegendEditor({ year }: YearPixelLegendEditorProps) {
  const { yearPixelLegends, setPixelLegendForYear, resetPixelLegendForYear } = useMediaTracker();
  const [open, setOpen] = useState(false);

  const savedLegend = useMemo(
    () => resolvePixelLegend(yearPixelLegends, year),
    [yearPixelLegends, year]
  );
  const [draft, setDraft] = useState<PixelLegendBand[]>(() => cloneBands(savedLegend));

  const isCustom = Boolean(yearPixelLegends[year]);

  const updateBand = (index: number, patch: Partial<PixelLegendBand>) => {
    setDraft((prev) =>
      prev.map((band, i) => {
        if (i !== index) return band;
        const next = { ...band, ...patch };
        if ("min" in patch || "max" in patch) {
          next.label = formatBandLabel(next.min, next.max);
        }
        return next;
      })
    );
  };

  const handleSave = () => {
    setPixelLegendForYear(year, sanitizeBandsForSave(draft));
  };

  const loadPreset = (bands: PixelLegendBand[]) => {
    setDraft(cloneBands(bands));
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-xl border border-bj-border bg-white px-4 py-2.5 text-sm font-medium text-bj-navy shadow-sm hover:bg-bj-surface/40"
      >
        <Settings2 className="h-4 w-4" />
        Configurar leyenda de {year}
        {isCustom && (
          <span className="rounded-full bg-bj-terracotta/10 px-2 py-0.5 text-xs text-bj-terracotta">
            personalizada
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-bj-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-bj-navy">
            Leyenda de páginas · {year}
          </h3>
          <p className="text-sm text-bj-muted">
            Cada color representa cuántas páginas leíste en un día.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-bj-muted hover:text-bj-navy"
        >
          Cerrar
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => loadPreset(DEFAULT_PIXEL_LEGEND_2025)}
          className="rounded-lg border border-bj-border px-3 py-1.5 text-xs font-medium text-bj-navy hover:bg-bj-surface"
        >
          Plantilla cuaderno 2025
        </button>
        <button
          type="button"
          onClick={() => loadPreset(DEFAULT_PIXEL_LEGEND_2026)}
          className="rounded-lg border border-bj-border px-3 py-1.5 text-xs font-medium text-bj-navy hover:bg-bj-surface"
        >
          Plantilla cuaderno 2026
        </button>
        <button
          type="button"
          onClick={() => {
            resetPixelLegendForYear(year);
            setDraft(cloneBands(getDefaultLegendForYear(year)));
          }}
          className="flex items-center gap-1 rounded-lg border border-bj-border px-3 py-1.5 text-xs font-medium text-bj-muted hover:bg-bj-surface"
        >
          <RotateCcw className="h-3 w-3" />
          Restaurar por defecto
        </button>
      </div>

      <div className="space-y-2">
        {draft.map((band, index) => (
          <div
            key={`${index}-${band.min}`}
            className="grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-2 rounded-xl border border-bj-border/60 bg-bj-surface/30 px-3 py-2"
          >
            <div
              className="h-8 w-8 rounded-md border border-black/10"
              style={{ backgroundColor: band.color }}
            />
            <div>
              <label className="mb-0.5 block text-[10px] uppercase text-bj-muted">Desde</label>
              <input
                type="number"
                min={0}
                value={band.min}
                onChange={(e) => updateBand(index, { min: Number(e.target.value) || 0 })}
                className="bj-input w-full text-sm"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] uppercase text-bj-muted">Hasta</label>
              <input
                type="number"
                min={band.min}
                value={band.max ?? ""}
                placeholder="+"
                onChange={(e) => {
                  const raw = e.target.value.trim();
                  updateBand(index, { max: raw === "" ? null : Number(raw) });
                }}
                className="bj-input w-full text-sm"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] uppercase text-bj-muted">Etiqueta</label>
              <input
                value={band.label}
                onChange={(e) => updateBand(index, { label: e.target.value })}
                className="bj-input w-full text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-bj-muted">Color</label>
              <input
                type="color"
                value={band.color}
                onChange={(e) => updateBand(index, { color: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded border border-bj-border bg-white p-0.5"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDraft((prev) => [...prev, emptyBand(prev[prev.length - 1])])}
          className="rounded-lg border border-dashed border-bj-border px-3 py-2 text-sm text-bj-muted hover:border-bj-terracotta hover:text-bj-navy"
        >
          + Añadir rango
        </button>
        {draft.length > 1 && (
          <button
            type="button"
            onClick={() => setDraft((prev) => prev.slice(0, -1))}
            className="rounded-lg border border-bj-border px-3 py-2 text-sm text-bj-muted hover:bg-bj-surface"
          >
            Quitar último
          </button>
        )}
        <button type="button" onClick={handleSave} className="bj-btn-primary ml-auto">
          Guardar leyenda de {year}
        </button>
      </div>
    </div>
  );
}
