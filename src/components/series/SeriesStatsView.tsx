"use client";

import { BarChart3 } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { GenreChart } from "@/components/ui/GenreChart";
import { SERIES_STATUSES } from "@/lib/constants";
import {
  getAverageSeriesRating,
  getSeriesByStatus,
  getSeriesFinishedInYear,
  getSeriesGenreStats,
  getTotalEpisodesWatched,
} from "@/lib/seriesStats";
import type { Series } from "@/types";

interface SeriesStatsViewProps {
  series: Series[];
}

export function SeriesStatsView({ series }: SeriesStatsViewProps) {
  const year = new Date().getFullYear();
  const statusLabels = Object.fromEntries(SERIES_STATUSES.map((s) => [s.value, s.label]));

  return (
    <div>
      <PanelHeader title="Estadísticas de series" subtitle="Estado, géneros y progreso" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SERIES_STATUSES.map((status) => (
          <div key={status.value} className="bj-panel p-4 text-center">
            <p className="text-2xl font-bold text-bj-navy">
              {getSeriesByStatus(series, status.value).length}
            </p>
            <p className="text-xs text-bj-muted">{statusLabels[status.value]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BarChart3 className="h-4 w-4" />
            Por género
          </h3>
          <GenreChart data={getSeriesGenreStats(series)} />
        </div>
        <div className="bj-panel p-5">
          <h3 className="mb-2 text-sm font-semibold text-bj-navy">Resumen</h3>
          <ul className="space-y-2 text-sm text-bj-muted">
            <li>
              <strong className="text-bj-navy">{series.length}</strong> series en tu colección
            </li>
            <li>
              <strong className="text-bj-navy">{getSeriesFinishedInYear(series, year).length}</strong>{" "}
              terminadas en {year}
            </li>
            <li>
              <strong className="text-bj-navy">{getTotalEpisodesWatched(series)}</strong> episodios
              registrados
            </li>
            <li>
              Valoración media:{" "}
              <strong className="text-bj-navy">{getAverageSeriesRating(series)}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
