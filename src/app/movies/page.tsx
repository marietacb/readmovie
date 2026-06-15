"use client";

import { useState, useCallback } from "react";
import { Film, PenLine } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MovieListView } from "@/components/movies/MovieListView";
import { MovieReviewForm } from "@/components/movies/MovieReviewForm";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import type { Movie, MovieTab } from "@/types";

const NAV_ITEMS = [
  { id: "lista" as MovieTab, label: "Mi colección", icon: <Film className="h-4 w-4" /> },
  { id: "resena" as MovieTab, label: "Nueva reseña", icon: <PenLine className="h-4 w-4" /> },
];

export default function MoviesPage() {
  const { movies } = useMediaTracker();
  const [activeTab, setActiveTab] = useState<MovieTab>("lista");
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
      {activeTab === "lista" && (
        <MovieListView
          movies={movies}
          onMovieClick={openMovie}
          onNewMovie={handleNewMovie}
        />
      )}
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
