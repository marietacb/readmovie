"use client";

import { useState, useCallback } from "react";
import { Tv, PenLine } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SeriesListView } from "@/components/series/SeriesListView";
import { SeriesReviewForm } from "@/components/series/SeriesReviewForm";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import type { Series, SeriesTab } from "@/types";

const NAV_ITEMS = [
  { id: "lista" as SeriesTab, label: "Mi colección", icon: <Tv className="h-4 w-4" /> },
  { id: "resena" as SeriesTab, label: "Nueva reseña", icon: <PenLine className="h-4 w-4" /> },
];

export default function SeriesPage() {
  const { series } = useMediaTracker();
  const [activeTab, setActiveTab] = useState<SeriesTab>("lista");
  const [editingSeriesId, setEditingSeriesId] = useState<string | undefined>();

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
      {activeTab === "lista" && (
        <SeriesListView
          series={series}
          onSeriesClick={openSeries}
          onNewSeries={handleNewSeries}
        />
      )}
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
