"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { MOVIE_FEELINGS } from "@/lib/constants";
import { RatingIcons } from "@/components/ui/RatingIcons";
import { GenreTagsInput } from "@/components/ui/GenreTagsInput";
import { normalizeGenres } from "@/lib/genres";
import { TagCheckbox } from "@/components/ui/TagCheckbox";
import type { Movie, MovieFeeling } from "@/types";

interface MovieReviewFormProps {
  movieId?: string;
  onSaved: (movie: Movie) => void;
  onDeleted?: () => void;
}

const EMPTY_FORM = {
  title: "",
  director: "",
  genres: [] as string[],
  originalNationality: "",
  summary: "",
  rating: 0,
  feelings: [] as MovieFeeling[],
  bestMoments: ["", "", ""],
  worstMoments: ["", "", ""],
  favouriteQuotes: ["", "", "", ""],
  posterUrl: "",
  watchDate: new Date().toISOString().split("T")[0],
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function BulletInputs({
  items,
  onChange,
  count,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  count: number;
}) {
  const padded = [...items];
  while (padded.length < count) padded.push("");

  return (
    <div className="space-y-2">
      {padded.slice(0, count).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-bj-terracotta/60" />
          <input
            value={item}
            onChange={(e) => {
              const updated = [...padded];
              updated[i] = e.target.value;
              onChange(updated);
            }}
            className="bj-input"
          />
        </div>
      ))}
    </div>
  );
}

function movieToForm(movie: Movie) {
  return {
    title: movie.title,
    director: movie.director,
    genres: movie.genres,
    originalNationality: movie.originalNationality ?? "",
    summary: movie.summary,
    rating: movie.rating,
    feelings: movie.feelings,
    bestMoments: [...movie.bestMoments, "", "", ""].slice(0, 3),
    worstMoments: [...movie.worstMoments, "", "", ""].slice(0, 3),
    favouriteQuotes: [...movie.favouriteQuotes, "", "", "", ""].slice(0, 4),
    posterUrl: movie.posterUrl ?? "",
    watchDate: movie.watchDate ?? "",
  };
}

export function MovieReviewForm({ movieId, onSaved, onDeleted }: MovieReviewFormProps) {
  const { getMovie, addMovie, updateMovie, deleteMovie } = useMediaTracker();
  const movie = movieId ? getMovie(movieId) : undefined;
  const [form, setForm] = useState(() => (movie ? movieToForm(movie) : EMPTY_FORM));

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFeeling = (feeling: MovieFeeling) => {
    set(
      "feelings",
      form.feelings.includes(feeling)
        ? form.feelings.filter((f) => f !== feeling)
        : [...form.feelings, feeling]
    );
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const data = {
      title: form.title.trim(),
      director: form.director.trim(),
      genres: normalizeGenres(form.genres),
      originalNationality: form.originalNationality.trim() || undefined,
      summary: form.summary.trim(),
      rating: form.rating,
      feelings: form.feelings,
      bestMoments: form.bestMoments.filter((m) => m.trim()),
      worstMoments: form.worstMoments.filter((m) => m.trim()),
      favouriteQuotes: form.favouriteQuotes.filter((q) => q.trim()),
      posterUrl: form.posterUrl || undefined,
      watchDate: form.watchDate || undefined,
    };

    if (movieId) {
      updateMovie(movieId, data);
      const updated = getMovie(movieId);
      if (updated) onSaved(updated);
    } else {
      const created = addMovie(data);
      onSaved(created);
    }
  };

  const handleDelete = () => {
    if (movieId && confirm("¿Eliminar esta reseña?")) {
      deleteMovie(movieId);
      onDeleted?.();
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-bj-navy">
          {movieId ? "Editar reseña" : "Nueva reseña"}
        </h1>
        <p className="mt-1 text-sm text-bj-muted">
          Documenta tu experiencia con esta película
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_180px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Título">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="bj-input" />
          </FormField>
          <FormField label="Director/a">
            <input value={form.director} onChange={(e) => set("director", e.target.value)} className="bj-input" />
          </FormField>
          <FormField label="Géneros">
            <GenreTagsInput
              value={form.genres}
              onChange={(genres) => set("genres", genres)}
            />
          </FormField>
          <FormField label="Nacionalidad original">
            <input
              value={form.originalNationality}
              onChange={(e) => set("originalNationality", e.target.value)}
              placeholder="Ej. Francia, Corea del Sur"
              className="bj-input"
            />
          </FormField>
          <FormField label="Fecha de visionado">
            <input
              type="date"
              value={form.watchDate}
              onChange={(e) => set("watchDate", e.target.value)}
              className="bj-input"
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-xl border border-bj-border bg-bj-surface shadow-sm">
            {form.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.posterUrl} alt="Póster" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-bj-muted">Póster</span>
            )}
          </div>
          <input
            value={form.posterUrl}
            onChange={(e) => set("posterUrl", e.target.value)}
            placeholder="URL del póster"
            className="bj-input text-xs"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-bj-border bg-bj-surface/30 p-5">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Mis sensaciones
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MOVIE_FEELINGS.map((feeling) => (
            <TagCheckbox
              key={feeling.value}
              label={feeling.label}
              checked={form.feelings.includes(feeling.value)}
              onChange={() => toggleFeeling(feeling.value)}
              color="#c17f59"
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
        <FormField label="En resumen">
          <textarea
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={3}
            placeholder="Sinopsis u opinión breve..."
            className="bj-input resize-none"
          />
        </FormField>
        <div className="flex items-end">
          <RatingIcons type="star" value={form.rating} onChange={(v) => set("rating", v)} size="lg" label="Valoración" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-bj-border p-5">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">Mejores momentos</span>
          <BulletInputs items={form.bestMoments} onChange={(v) => set("bestMoments", v)} count={3} />
        </div>
        <div className="rounded-xl border border-bj-border p-5">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">Peores momentos</span>
          <BulletInputs items={form.worstMoments} onChange={(v) => set("worstMoments", v)} count={3} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-bj-border p-5">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">Citas favoritas</span>
        <BulletInputs items={form.favouriteQuotes} onChange={(v) => set("favouriteQuotes", v)} count={4} />
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-bj-border pt-6">
        {movieId && (
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        )}
        <button onClick={handleSave} disabled={!form.title.trim()} className="bj-btn-primary flex items-center gap-2 disabled:opacity-40">
          <Save className="h-4 w-4" />
          Guardar reseña
        </button>
      </div>
    </div>
  );
}
