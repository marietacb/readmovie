"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { YearPixelDayEditor } from "@/components/books/YearPixelDayEditor";
import { YearPixelLegendEditor } from "@/components/books/YearPixelLegendEditor";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { resolvePixelLegend } from "@/lib/pixelLegends";
import {
  MONTH_INITIALS,
  buildYearPixelGrid,
  getPixelClassName,
  getPixelColor,
} from "@/lib/yearInPixels";
import type { Book } from "@/types";
import { cn } from "@/lib/utils";

interface YearInPixelsViewProps {
  books: Book[];
  year: number;
}

export function YearInPixelsView({ books, year }: YearInPixelsViewProps) {
  const { yearPixelLegends } = useMediaTracker();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const bands = useMemo(
    () => resolvePixelLegend(yearPixelLegends, year),
    [yearPixelLegends, year]
  );
  const grid = useMemo(() => buildYearPixelGrid(books, year), [books, year]);
  const daysWithReading = useMemo(
    () => grid.flat().filter((c) => c.valid && c.pages > 0).length,
    [grid]
  );
  const totalPages = useMemo(
    () => grid.flat().reduce((s, c) => s + (c.valid ? c.pages : 0), 0),
    [grid]
  );
  const daysWithFinishedBook = useMemo(
    () => grid.flat().filter((c) => c.valid && c.finishedBooks.length > 0).length,
    [grid]
  );

  return (
    <div>
      <div className="mb-6">
        <PanelHeader
          title="Year in Pixels"
          subtitle="Haz clic en un día para editar las páginas · la estrella marca cuando terminaste un libro"
        />
      </div>

      <YearPixelLegendEditor key={year} year={year} />

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-bj-muted">
        <span>
          <strong className="text-bj-navy">{daysWithReading}</strong> días con lectura
        </span>
        <span>
          <strong className="text-bj-navy">{totalPages.toLocaleString("es-ES")}</strong> páginas en {year}
        </span>
        {daysWithFinishedBook > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <strong className="text-bj-navy">{daysWithFinishedBook}</strong> días con libro terminado
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-bj-border bg-white p-4 shadow-sm md:p-6">
        <div className="min-w-[640px]">
          <div className="mb-2 grid grid-cols-[2rem_repeat(12,1fr)] gap-1">
            <div />
            {MONTH_INITIALS.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="text-center text-[10px] font-bold uppercase tracking-wider text-bj-navy"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {grid.map((row, rowIndex) => {
              const day = rowIndex + 1;
              return (
                <div key={day} className="grid grid-cols-[2rem_repeat(12,1fr)] items-center gap-1">
                  <span className="text-right text-[10px] font-medium text-bj-muted">{day}</span>
                  {row.map((cell) => {
                    const hasStar = cell.finishedBooks.length > 0;
                    const isSelected = selectedDate === cell.date;
                    const titleParts: string[] = [];
                    if (cell.valid) {
                      if (cell.pages > 0) titleParts.push(`${cell.pages} págs.`);
                      if (hasStar) {
                        titleParts.push(
                          `Terminado: ${cell.finishedBooks.map((b) => b.title).join(", ")}`
                        );
                      }
                      if (titleParts.length === 0) titleParts.push("Sin lectura");
                    }

                    const fillColor = getPixelColor(cell.pages, bands);

                    return (
                      <button
                        key={cell.date}
                        type="button"
                        disabled={!cell.valid}
                        onClick={() => cell.valid && setSelectedDate(cell.date)}
                        title={cell.valid ? `${cell.date}: ${titleParts.join(" · ")}` : undefined}
                        style={fillColor ? { backgroundColor: fillColor } : undefined}
                        className={cn(
                          "relative aspect-square w-full max-w-[28px] rounded-sm transition-transform",
                          getPixelClassName(cell.pages, cell.valid, bands),
                          !cell.valid && "pointer-events-none bg-transparent",
                          cell.valid && "cursor-pointer hover:scale-110 hover:ring-2 hover:ring-bj-terracotta/40",
                          isSelected && "ring-2 ring-bj-terracotta"
                        )}
                      >
                        {hasStar && (
                          <Star
                            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-amber-400 text-amber-500 drop-shadow-sm"
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <YearPixelDayEditor
          key={selectedDate}
          books={books}
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <div className="mt-6 rounded-xl border border-bj-border bg-bj-surface/30 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Leyenda {year} · páginas leídas por día
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm border border-bj-border/40 bg-bj-cream" />
            <span className="text-xs text-bj-muted">0</span>
          </div>
          {bands.map((band) => (
            <div key={`${band.min}-${band.label}`} className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-sm border border-black/10"
                style={{ backgroundColor: band.color }}
              />
              <span className="text-xs text-bj-muted">{band.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            <span className="text-xs text-bj-muted">Libro terminado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
