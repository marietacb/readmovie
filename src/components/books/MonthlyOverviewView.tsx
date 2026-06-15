"use client";

import { useMemo } from "react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { getMonthlyOverview } from "@/lib/monthlyOverview";
import type { Book } from "@/types";

interface MonthlyOverviewViewProps {
  books: Book[];
  year: number;
}

const COLUMNS = [
  { key: "booksFinished", label: "Libros", short: "BOOKS" },
  { key: "pagesRead", label: "Páginas", short: "PAGES" },
  { key: "chaptersRead", label: "Capítulos", short: "CHAPTERS" },
  { key: "fiveStars", label: "5 ★", short: "5 STARS" },
  { key: "ebook", label: "Ebook", short: "EBOOK" },
  { key: "physical", label: "Físico", short: "PHYSICAL" },
  { key: "series", label: "Sagas", short: "SERIES" },
] as const;

export function MonthlyOverviewView({ books, year }: MonthlyOverviewViewProps) {
  const rows = useMemo(() => getMonthlyOverview(books, year), [books, year]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          booksFinished: acc.booksFinished + row.booksFinished,
          pagesRead: acc.pagesRead + row.pagesRead,
          chaptersRead: acc.chaptersRead + row.chaptersRead,
          fiveStars: acc.fiveStars + row.fiveStars,
          ebook: acc.ebook + row.ebook,
          physical: acc.physical + row.physical,
          series: acc.series + row.series,
        }),
        {
          booksFinished: 0,
          pagesRead: 0,
          chaptersRead: 0,
          fiveStars: 0,
          ebook: 0,
          physical: 0,
          series: 0,
        }
      ),
    [rows]
  );

  return (
    <div>
      <div className="mb-6">
        <PanelHeader
          title="Overview"
          subtitle="Tabla mensual de rendimiento — como en tu cuaderno Book Journal"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-bj-border bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-bj-border bg-gradient-to-r from-bj-navy/5 to-bj-terracotta/5">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-bj-navy">
                Mes
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-bj-muted"
                  title={col.label}
                >
                  <span className="hidden sm:inline">{col.short}</span>
                  <span className="sm:hidden">{col.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasData = COLUMNS.some((col) => row[col.key] > 0);
              return (
                <tr
                  key={row.month}
                  className="border-b border-bj-border/60 transition-colors hover:bg-bj-surface/40"
                >
                  <td className="px-4 py-3">
                    <span className="mr-2 font-serif font-bold text-bj-terracotta">{row.roman}</span>
                    <span className="text-bj-navy">{row.label}</span>
                  </td>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-3 text-center tabular-nums ${
                        row[col.key] > 0 ? "font-semibold text-bj-navy" : "text-bj-muted/40"
                      }`}
                    >
                      {hasData || row[col.key] > 0 ? row[col.key] : "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-bj-navy/5 font-semibold text-bj-navy">
              <td className="px-4 py-3 text-xs uppercase tracking-wide">Total {year}</td>
              {COLUMNS.map((col) => (
                <td key={col.key} className="px-3 py-3 text-center tabular-nums">
                  {totals[col.key] > 0 ? totals[col.key].toLocaleString("es-ES") : "—"}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 grid gap-3 text-xs text-bj-muted sm:grid-cols-2 lg:grid-cols-3">
        <p>
          <strong className="text-bj-navy">Libros:</strong> terminados ese mes (fecha fin).
        </p>
        <p>
          <strong className="text-bj-navy">Páginas:</strong> suma del registro diario del mes.
        </p>
        <p>
          <strong className="text-bj-navy">Capítulos:</strong> marcadores alcanzados en sesiones, o total al terminar.
        </p>
        <p>
          <strong className="text-bj-navy">5 ★:</strong> libros terminados con valoración máxima.
        </p>
        <p>
          <strong className="text-bj-navy">Ebook / Físico:</strong> formatos de libros terminados.
        </p>
        <p>
          <strong className="text-bj-navy">Sagas:</strong> bilogía, trilogía, saga o con etiqueta de serie.
        </p>
      </div>
    </div>
  );
}
