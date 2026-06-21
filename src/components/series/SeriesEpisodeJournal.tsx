"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Tv } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import {
  countUniqueEpisodes,
  formatEpisodeLabel,
} from "@/lib/episodeWatchLogs";
import { formatDateES } from "@/lib/readingStats";
import type { Series } from "@/types";

interface SeriesEpisodeJournalProps {
  series: Series;
}

export function SeriesEpisodeJournal({ series }: SeriesEpisodeJournalProps) {
  const { addEpisodeWatchLog, removeEpisodeWatchLog } = useMediaTracker();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: today,
    season: "1",
    episode: "1",
    note: "",
  });

  const logs = series.episodeWatchLogs ?? [];
  const uniqueCount = useMemo(() => countUniqueEpisodes(logs), [logs]);

  const handleAdd = () => {
    const season = Number(form.season);
    const episode = Number(form.episode);
    if (!form.date || !Number.isFinite(season) || !Number.isFinite(episode)) return;
    if (season < 1 || episode < 1) return;

    addEpisodeWatchLog(series.id, {
      date: form.date,
      season,
      episode,
      note: form.note.trim() || undefined,
    });

    setForm((prev) => ({
      ...prev,
      episode: String(episode + 1),
      note: "",
    }));
  };

  return (
    <div className="mt-6 space-y-6 rounded-2xl border border-bj-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-bj-navy">
            <Tv className="h-5 w-5 text-bj-sage" />
            Episodios por día
          </h3>
          <p className="mt-1 text-sm text-bj-muted">
            Registra qué episodio viste cada día. Puedes repetir el mismo episodio en fechas distintas.
          </p>
        </div>
        <div className="text-right text-sm text-bj-muted">
          <p>
            <strong className="text-bj-navy">{uniqueCount}</strong> episodios únicos
          </p>
          <p>
            <strong className="text-bj-navy">{logs.length}</strong> registros en total
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-bj-border bg-bj-surface/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Añadir visionado
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="bj-input text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Temporada</label>
            <input
              type="number"
              min={1}
              value={form.season}
              onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
              className="bj-input text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Episodio</label>
            <input
              type="number"
              min={1}
              value={form.episode}
              onChange={(e) => setForm((f) => ({ ...f, episode: e.target.value }))}
              className="bj-input text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs text-bj-muted">Nota (opcional)</label>
            <input
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Ej. con mi hermana"
              className="bj-input text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAdd}
              className="bj-btn-primary flex w-full items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Añadir
            </button>
          </div>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-bj-muted">Historial</p>
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-bj-border bg-bj-surface/30 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-bj-navy">
                  {formatEpisodeLabel(log.season, log.episode)}
                  <span className="ml-2 font-normal text-bj-muted">
                    · {formatDateES(log.date)}
                  </span>
                </p>
                {log.note && (
                  <p className="mt-0.5 text-xs italic text-bj-muted">&ldquo;{log.note}&rdquo;</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeEpisodeWatchLog(series.id, log.id)}
                className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                aria-label="Eliminar registro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-bj-muted">
          Aún no has registrado episodios por día.
        </p>
      )}
    </div>
  );
}
