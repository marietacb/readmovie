"use client";

import { Plus, Trash2 } from "lucide-react";
import { generateId } from "@/lib/utils";
import type { ChapterMarker } from "@/types";

interface ChapterMarkersEditorProps {
  chapters: ChapterMarker[];
  onChange: (chapters: ChapterMarker[]) => void;
}

export function ChapterMarkersEditor({ chapters, onChange }: ChapterMarkersEditorProps) {
  const add = () => {
    onChange([
      ...chapters,
      { id: generateId(), title: `Capítulo ${chapters.length + 1}`, startPage: 1 },
    ]);
  };

  const update = (id: string, field: "title" | "startPage", value: string) => {
    onChange(
      chapters.map((c) =>
        c.id === id
          ? { ...c, [field]: field === "startPage" ? parseInt(value) || 0 : value }
          : c
      )
    );
  };

  const remove = (id: string) => onChange(chapters.filter((c) => c.id !== id));

  const sorted = [...chapters].sort((a, b) => a.startPage - b.startPage);

  return (
    <div className="rounded-2xl border border-bj-border bg-bj-surface/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-bj-navy">Capítulos del libro</h3>
          <p className="text-xs text-bj-muted">Indica en qué página empieza cada capítulo</p>
        </div>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-bj-navy/10 px-3 py-1.5 text-xs font-medium text-bj-navy hover:bg-bj-navy/15">
          <Plus className="h-3.5 w-3.5" />
          Añadir
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="py-4 text-center text-xs text-bj-muted">
          Sin capítulos definidos. Añade uno para registrar en qué página empieza.
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((ch) => (
            <div key={ch.id} className="flex items-center gap-2">
              <input
                value={ch.title}
                onChange={(e) => update(ch.id, "title", e.target.value)}
                placeholder="Nombre del capítulo"
                className="bj-input flex-1 text-sm"
              />
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-bj-muted">pág.</span>
                <input
                  type="number"
                  min={1}
                  value={ch.startPage}
                  onChange={(e) => update(ch.id, "startPage", e.target.value)}
                  className="bj-input w-20 text-sm text-center"
                />
              </div>
              <button type="button" onClick={() => remove(ch.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
