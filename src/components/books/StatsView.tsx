"use client";

import { PanelHeader } from "@/components/ui/PanelHeader";
import { GenreChart } from "@/components/ui/GenreChart";
import {
  getGenreStats,
  getFormatStats,
  getRatingDistribution,
  getMonthlyFinished,
  getTotalPages,
  getFinishedThisYear,
  MONTH_SHORT,
} from "@/lib/bookStats";
import type { Book } from "@/types";

interface StatsViewProps {
  books: Book[];
}

export function StatsView({ books }: StatsViewProps) {
  const finished = books.filter((b) => b.endDate);
  const finishedYear = getFinishedThisYear(books);
  const monthly = getMonthlyFinished(books);
  const maxMonth = Math.max(...monthly, 1);
  const ratings = getRatingDistribution(books);
  const maxRating = Math.max(...ratings, 1);
  const formats = getFormatStats(books);

  return (
    <div>
      <PanelHeader
        title="Estadísticas personales"
        subtitle="Analiza tus hábitos de lectura como en BookJournal o Nightstand"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Terminados (total)", value: finished.length },
          { label: `Terminados ${new Date().getFullYear()}`, value: finishedYear.length },
          { label: "Páginas totales", value: getTotalPages(books).toLocaleString("es-ES") },
          { label: "Autores únicos", value: new Set(books.map((b) => b.author)).size },
        ].map((s) => (
          <div key={s.label} className="bj-panel p-4 text-center">
            <p className="text-2xl font-bold text-bj-navy">{s.value}</p>
            <p className="mt-1 text-xs text-bj-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-6">
          <h3 className="mb-5 text-sm font-semibold text-bj-navy">Libros por mes ({new Date().getFullYear()})</h3>
          <div className="flex items-end gap-1.5" style={{ height: 120 }}>
            {monthly.map((count, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-bj-navy to-bj-terracotta/70 transition-all"
                    style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count > 0 ? 8 : 2 }}
                  />
                </div>
                <span className="text-[9px] text-bj-muted">{MONTH_SHORT[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bj-panel p-6">
          <h3 className="mb-5 text-sm font-semibold text-bj-navy">Distribución de valoraciones</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratings[stars - 1];
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-bj-muted">{"★".repeat(stars)}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bj-surface">
                    <div
                      className="h-full rounded-full bg-bj-gold/80"
                      style={{ width: `${(count / maxRating) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs text-bj-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bj-panel p-6">
          <h3 className="mb-5 text-sm font-semibold text-bj-navy">Por género</h3>
          <GenreChart data={getGenreStats(books)} />
        </div>

        <div className="bj-panel p-6">
          <h3 className="mb-5 text-sm font-semibold text-bj-navy">Por formato</h3>
          {formats.length === 0 ? (
            <p className="text-sm text-bj-muted">Sin datos de formato</p>
          ) : (
            <div className="space-y-4">
              {formats.map((f) => (
                <div key={f.format} className="flex items-center justify-between rounded-xl bg-bj-surface/60 px-4 py-3">
                  <span className="text-sm text-bj-navy">{f.format}</span>
                  <span className="rounded-full bg-bj-navy/10 px-3 py-0.5 text-sm font-semibold text-bj-navy">
                    {f.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
