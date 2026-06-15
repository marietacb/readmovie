"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  PenLine,
  LayoutDashboard,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MovieListView } from "@/components/movies/MovieListView";
import { MovieReviewForm } from "@/components/movies/MovieReviewForm";
import { MoviesDashboardView } from "@/components/movies/MoviesDashboardView";
import { MoviesStatsView } from "@/components/movies/MoviesStatsView";
import { ActivityCalendarView } from "@/components/shared/ActivityCalendarView";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import type { Movie, MovieTab } from "@/types";

const NAV_ITEMS = [
  { id: "panel" as MovieTab, label: "Panel", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "lista" as MovieTab, label: "Mi colección", icon: <Film className="h-4 w-4" /> },
  { id: "calendario" as MovieTab, label: "Calendario", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "estadisticas" as MovieTab, label: "Estadísticas", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "resena" as MovieTab, label: "Nueva reseña", icon: <PenLine className="h-4 w-4" /> },
];

export default function MoviesPage() {
  const router = useRouter();
  const { books, movies, series } = useMediaTracker();
  const [activeTab, setActiveTab] = useState<MovieTab>("panel");
  const [editingMovieId, setEditingMovieId] = useState<string | undefined>();

  const openMovie = useCallback((movie: Movie) => {
    setEditingMovieId(movie.id);
    setActiveTab("resena");
  }, []);

  const handleNewMovie = useCallback(() => {
    setEditingMovieId(undefined);
    setActiveTab("resena");
  }, []);

  const handleSaved = useCallback(() => {
    setEditingMovieId(undefined);
    setActiveTab("lista");
  }, []);

  const handleDeleted = useCallback(() => {
    setEditingMovieId(undefined);
    setActiveTab("lista");
  }, []);

  return (
    <AppShell
      module="movies"
      title="Cine"
      navItems={NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as MovieTab);
        if (tab !== "resena") setEditingMovieId(undefined);
      }}
    >
      {activeTab === "panel" && (
        <MoviesDashboardView movies={movies} onMovieClick={openMovie} />
      )}
      {activeTab === "lista" && (
        <MovieListView
          movies={movies}
          onMovieClick={openMovie}
          onNewMovie={handleNewMovie}
        />
      )}
      {activeTab === "calendario" && (
        <ActivityCalendarView
          books={books}
          movies={movies}
          series={series}
          defaultFilter="movie"
          onBookClick={() => router.push("/books")}
          onMovieClick={(id) => {
            setEditingMovieId(id);
            setActiveTab("resena");
          }}
          onSeriesClick={() => router.push("/series")}
        />
      )}
      {activeTab === "estadisticas" && <MoviesStatsView movies={movies} />}
      {activeTab === "resena" && (
        <MovieReviewForm
          key={editingMovieId ?? "new"}
          movieId={editingMovieId}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </AppShell>
  );
}
