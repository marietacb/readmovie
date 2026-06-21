"use client";

import { useEffect, useState } from "react";
import { Trash2, Save } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { MOVIE_FEELINGS, SERIES_STATUSES } from "@/lib/constants";
import { RatingIcons } from "@/components/ui/RatingIcons";
import { GenreTagsInput } from "@/components/ui/GenreTagsInput";
import { normalizeGenres } from "@/lib/genres";
import { TagCheckbox } from "@/components/ui/TagCheckbox";
import type { MovieFeeling, Series, SeriesStatus } from "@/types";
import { countUniqueEpisodes } from "@/lib/episodeWatchLogs";
import { SeriesEpisodeJournal } from "@/components/series/SeriesEpisodeJournal";

interface SeriesReviewFormProps {
  seriesId?: string;
  onSaved: (series: Series) => void;
  onDeleted?: () => void;
}

const EMPTY_FORM = {
  title: "",
  creator: "",
  genres: [] as string[],
  originalNationality: "",
  platform: "",
  summary: "",
  rating: 0,
  status: "plan_to_watch" as SeriesStatus,
  seasons: "",
  totalEpisodes: "",
  episodesWatched: "",
  startDate: "",
  endDate: "",
  feelings: [] as MovieFeeling[],
  favoriteCharacters: "",
  favoriteEpisodes: ["", "", ""],
  bestMoments: ["", "", ""],
  worstMoments: ["", "", ""],
  favouriteQuotes: ["", "", "", ""],
  posterUrl: "",
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

function seriesToForm(item: Series) {
  return {
    title: item.title,
    creator: item.creator,
    genres: item.genres,
    originalNationality: item.originalNationality ?? "",
    platform: item.platform,
    summary: item.summary,
    rating: item.rating,
    status: item.status,
    seasons: item.seasons?.toString() ?? "",
    totalEpisodes: item.totalEpisodes?.toString() ?? "",
    episodesWatched: item.episodesWatched?.toString() ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    feelings: item.feelings,
    favoriteCharacters: item.favoriteCharacters ?? "",
    favoriteEpisodes: [...item.favoriteEpisodes, "", "", ""].slice(0, 3),
    bestMoments: [...item.bestMoments, "", "", ""].slice(0, 3),
    worstMoments: [...item.worstMoments, "", "", ""].slice(0, 3),
    favouriteQuotes: [...item.favouriteQuotes, "", "", "", ""].slice(0, 4),
    posterUrl: item.posterUrl ?? "",
  };
}

export function SeriesReviewForm({ seriesId, onSaved, onDeleted }: SeriesReviewFormProps) {
  const { getSeries, addSeries, updateSeries, deleteSeries } = useMediaTracker();
  const item = seriesId ? getSeries(seriesId) : undefined;
  const [form, setForm] = useState(() => (item ? seriesToForm(item) : EMPTY_FORM));

  useEffect(() => {
    if (!item || (item.episodeWatchLogs?.length ?? 0) === 0) return;
    const synced = String(
      item.episodesWatched ?? countUniqueEpisodes(item.episodeWatchLogs),
    );
    setForm((prev) =>
      prev.episodesWatched === synced ? prev : { ...prev, episodesWatched: synced },
    );
  }, [item?.id, item?.episodesWatched, item?.episodeWatchLogs]);

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

  const parseOptionalNumber = (value: string) => {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const logs = item?.episodeWatchLogs ?? [];
    const episodesWatched =
      logs.length > 0
        ? countUniqueEpisodes(logs)
        : parseOptionalNumber(form.episodesWatched);

    const data = {
      title: form.title.trim(),
      creator: form.creator.trim(),
      genres: normalizeGenres(form.genres),
      originalNationality: form.originalNationality.trim() || undefined,
      platform: form.platform.trim(),
      summary: form.summary.trim(),
      rating: form.rating,
      status: form.status,
      seasons: parseOptionalNumber(form.seasons),
      totalEpisodes: parseOptionalNumber(form.totalEpisodes),
      episodesWatched,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      feelings: form.feelings,
      favoriteCharacters: form.favoriteCharacters.trim() || undefined,
      favoriteEpisodes: form.favoriteEpisodes.filter((e) => e.trim()),
      bestMoments: form.bestMoments.filter((m) => m.trim()),
      worstMoments: form.worstMoments.filter((m) => m.trim()),
      favouriteQuotes: form.favouriteQuotes.filter((q) => q.trim()),
      posterUrl: form.posterUrl || undefined,
      episodeWatchLogs: logs,
    };

    if (seriesId) {
      updateSeries(seriesId, data);
      const updated = getSeries(seriesId);
      if (updated) onSaved(updated);
    } else {
      const created = addSeries(data);
      onSaved(created);
    }
  };

  const handleDelete = () => {
    if (seriesId && confirm("¿Eliminar esta reseña?")) {
      deleteSeries(seriesId);
      onDeleted?.();
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-bj-navy">
          {seriesId ? "Editar reseña" : "Nueva reseña"}
        </h1>
        <p className="mt-1 text-sm text-bj-muted">
          Documenta tu experiencia con esta serie
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_180px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Título">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="bj-input" />
          </FormField>
          <FormField label="Creador/a">
            <input value={form.creator} onChange={(e) => set("creator", e.target.value)} className="bj-input" />
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
              placeholder="Ej. Estados Unidos, España"
              className="bj-input"
            />
          </FormField>
          <FormField label="Plataforma">
            <input
              value={form.platform}
              onChange={(e) => set("platform", e.target.value)}
              placeholder="Netflix, HBO, Disney+..."
              className="bj-input"
            />
          </FormField>
          <FormField label="Estado">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as SeriesStatus)}
              className="bj-input"
            >
              {SERIES_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
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

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <FormField label="Temporadas">
          <input
            type="number"
            min={1}
            value={form.seasons}
            onChange={(e) => set("seasons", e.target.value)}
            className="bj-input"
          />
        </FormField>
        <FormField label="Episodios totales">
          <input
            type="number"
            min={1}
            value={form.totalEpisodes}
            onChange={(e) => set("totalEpisodes", e.target.value)}
            className="bj-input"
          />
        </FormField>
        <FormField label="Episodios vistos">
          <input
            type="number"
            min={0}
            value={form.episodesWatched}
            onChange={(e) => set("episodesWatched", e.target.value)}
            disabled={(item?.episodeWatchLogs?.length ?? 0) > 0}
            className="bj-input disabled:cursor-not-allowed disabled:opacity-60"
          />
          {item && (item.episodeWatchLogs?.length ?? 0) > 0 && (
            <p className="mt-1 text-xs text-bj-muted">
              Se calcula automáticamente desde el diario de episodios (
              {item.episodeWatchLogs?.length} registros).
            </p>
          )}
        </FormField>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Fecha de inicio">
          <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="bj-input" />
        </FormField>
        <FormField label="Fecha de fin">
          <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="bj-input" />
        </FormField>
      </div>

      {item && <SeriesEpisodeJournal key={item.id} series={item} />}

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

      <div className="mt-6">
        <FormField label="Personajes favoritos">
          <textarea
            value={form.favoriteCharacters}
            onChange={(e) => set("favoriteCharacters", e.target.value)}
            rows={2}
            placeholder="¿Quiénes te han gustado más?"
            className="bj-input resize-none"
          />
        </FormField>
      </div>

      <div className="mt-6 rounded-xl border border-bj-border p-5">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Episodios favoritos
        </span>
        <BulletInputs items={form.favoriteEpisodes} onChange={(v) => set("favoriteEpisodes", v)} count={3} />
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
        {seriesId && (
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
