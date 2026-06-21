"use client";

import { useState } from "react";
import { Film, Plus, Trash2 } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { countMovieWatchLogs } from "@/lib/movieWatchLogs";
import { formatDateES } from "@/lib/readingStats";
import type { Movie } from "@/types";

interface MovieWatchJournalProps {
  movie: Movie;
}

export function MovieWatchJournal({ movie }: MovieWatchJournalProps) {
  const { addMovieWatchLog, removeMovieWatchLog } = useMediaTracker();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: today,
    note: "",
  });

  const logs = movie.watchLogs ?? [];
  const totalCount = countMovieWatchLogs(logs);

  const handleAdd = () => {
    if (!form.date) return;

    addMovieWatchLog(movie.id, {
      date: form.date,
      note: form.note.trim() || undefined,
    });

    setForm((prev) => ({ ...prev, note: "" }));
  };

  return (
    <div className="mt-6 space-y-6 rounded-2xl border border-bj-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-bj-navy">
            <Film className="h-5 w-5 text-bj-navy" />
            Visionados por día
          </h3>
          <p className="mt-1 text-sm text-bj-muted">
            Registra cada vez que ves la película. Puedes añadir la misma película en fechas distintas.
          </p>
        </div>
        <div className="text-right text-sm text-bj-muted">
          <p>
            <strong className="text-bj-navy">{totalCount}</strong> visionados
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-bj-border bg-bj-surface/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Añadir visionado
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
            <label className="mb-1 block text-xs text-bj-muted">Nota (opcional)</label>
            <input
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Ej. en el cine con Ana"
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
                  {formatDateES(log.date)}
                </p>
                {log.note && (
                  <p className="mt-0.5 text-xs italic text-bj-muted">&ldquo;{log.note}&rdquo;</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeMovieWatchLog(movie.id, log.id)}
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
          Aún no has registrado visionados por día.
        </p>
      )}
    </div>
  );
}
