"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tv,
  PenLine,
  LayoutDashboard,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SeriesListView } from "@/components/series/SeriesListView";
import { SeriesReviewForm } from "@/components/series/SeriesReviewForm";
import { SeriesDashboardView } from "@/components/series/SeriesDashboardView";
import { SeriesStatsView } from "@/components/series/SeriesStatsView";
import { ActivityCalendarView } from "@/components/shared/ActivityCalendarView";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import type { Series, SeriesStatus, SeriesTab } from "@/types";

const NAV_ITEMS = [
  { id: "panel" as SeriesTab, label: "Panel", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "lista" as SeriesTab, label: "Mi colección", icon: <Tv className="h-4 w-4" /> },
  { id: "calendario" as SeriesTab, label: "Calendario", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "estadisticas" as SeriesTab, label: "Estadísticas", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "resena" as SeriesTab, label: "Nueva reseña", icon: <PenLine className="h-4 w-4" /> },
];

export default function SeriesPage() {
  const router = useRouter();
  const { books, movies, series } = useMediaTracker();
  const [activeTab, setActiveTab] = useState<SeriesTab>("panel");
  const [editingSeriesId, setEditingSeriesId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<SeriesStatus | "all">("all");

  const filteredSeries = useMemo(
    () =>
      statusFilter === "all"
        ? series
        : series.filter((item) => item.status === statusFilter),
    [series, statusFilter]
  );

  const openSeries = useCallback((item: Series) => {
    setEditingSeriesId(item.id);
    setActiveTab("resena");
  }, []);

  const handleNewSeries = useCallback(() => {
    setEditingSeriesId(undefined);
    setActiveTab("resena");
  }, []);

  const handleSaved = useCallback(() => {
    setEditingSeriesId(undefined);
    setActiveTab("lista");
  }, []);

  const handleDeleted = useCallback(() => {
    setEditingSeriesId(undefined);
    setActiveTab("lista");
  }, []);

  return (
    <AppShell
      module="series"
      title="Series"
      navItems={NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as SeriesTab);
        if (tab !== "resena") setEditingSeriesId(undefined);
      }}
    >
      {activeTab === "panel" && (
        <SeriesDashboardView series={series} onSeriesClick={openSeries} />
      )}
      {activeTab === "lista" && (
        <SeriesListView
          series={filteredSeries}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSeriesClick={openSeries}
          onNewSeries={handleNewSeries}
        />
      )}
      {activeTab === "calendario" && (
        <ActivityCalendarView
          books={books}
          movies={movies}
          series={series}
          defaultFilter="series"
          onBookClick={() => router.push("/books")}
          onMovieClick={() => router.push("/movies")}
          onSeriesClick={(id) => {
            setEditingSeriesId(id);
            setActiveTab("resena");
          }}
        />
      )}
      {activeTab === "estadisticas" && <SeriesStatsView series={series} />}
      {activeTab === "resena" && (
        <SeriesReviewForm
          key={editingSeriesId ?? "new"}
          seriesId={editingSeriesId}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </AppShell>
  );
}
