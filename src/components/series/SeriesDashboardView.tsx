"use client";

import { Star, TrendingUp, Tv } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatCard } from "@/components/ui/StatCard";
import { GenreChart } from "@/components/ui/GenreChart";
import { SERIES_STATUSES } from "@/lib/constants";
import {
  getSeriesByStatus,
  getSeriesFinishedInYear,
  getSeriesGenreStats,
  getTotalEpisodesWatched,
} from "@/lib/seriesStats";
import type { Series } from "@/types";

interface SeriesDashboardViewProps {
  series: Series[];
  onSeriesClick?: (item: Series) => void;
}

export function SeriesDashboardView({ series, onSeriesClick }: SeriesDashboardViewProps) {
  const year = new Date().getFullYear();
  const watching = getSeriesByStatus(series, "watching");
  const completed = getSeriesByStatus(series, "completed");
  const finishedYear = getSeriesFinishedInYear(series, year);
  const statusLabels = Object.fromEntries(SERIES_STATUSES.map((s) => [s.value, s.label]));

  return (
    <div>
      <PanelHeader
        title="Panel de series"
        subtitle="Progreso, plataformas y lo que llevas este año"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total series" value={series.length} icon={<Tv className="h-5 w-5" />} accent="bg-bj-navy" />
        <StatCard label="Viendo ahora" value={watching.length} icon={<TrendingUp className="h-5 w-5" />} accent="bg-bj-terracotta" />
        <StatCard label="Terminadas" value={completed.length} icon={<Star className="h-5 w-5" />} accent="bg-bj-sage" />
        <StatCard
          label="Episodios vistos"
          value={getTotalEpisodesWatched(series)}
          icon={<Tv className="h-5 w-5" />}
          accent="bg-bj-gold"
          trend={`${finishedYear.length} en ${year}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Viendo ahora</h3>
          {watching.length === 0 ? (
            <p className="text-sm text-bj-muted">No tienes series en curso.</p>
          ) : (
            <div className="space-y-2">
              {watching.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSeriesClick?.(item)}
                  className="flex w-full items-center justify-between rounded-xl border border-bj-border bg-white px-4 py-3 text-left hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-bj-navy">{item.title}</p>
                    <p className="text-xs text-bj-muted">
                      {item.platform}
                      {item.episodesWatched != null && item.totalEpisodes != null
                        ? ` · ${item.episodesWatched}/${item.totalEpisodes} eps.`
                        : ""}
                    </p>
                  </div>
                  <span className="text-xs text-bj-muted">{statusLabels[item.status]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bj-panel p-5">
          <h3 className="mb-4 text-sm font-semibold text-bj-navy">Géneros</h3>
          <GenreChart data={getSeriesGenreStats(series)} />
        </div>
      </div>
    </div>
  );
}
