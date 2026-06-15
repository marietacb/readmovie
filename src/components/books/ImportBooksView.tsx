"use client";

import { useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { parseNotebookImport, type ImportResult } from "@/lib/importBooks";

const EXAMPLE = `{
  "year": 2025,
  "books": [
    {
      "title": "Mi libro",
      "author": "Autor/a",
      "pages": 300,
      "genre": "Fantasy",
      "endDate": "2025-03-12",
      "rating": 4.5
    }
  ]
}`;

export function ImportBooksView() {
  const { importNotebook } = useMediaTracker();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    setError(null);
    setResult(null);
    try {
      const parsed = parseNotebookImport(JSON.parse(jsonText));
      const importResult = importNotebook(parsed);
      setResult(importResult);
      if (
        importResult.booksImported === 0
        && importResult.wishlistImported === 0
        && importResult.booksUpdated === 0
        && importResult.sessionsBackfilled === 0
      ) {
        setError("No se importó nada: los libros ya existían o el JSON está vacío.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON inválido");
    }
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    setJsonText(text);
    setError(null);
    setResult(null);
  };

  return (
    <div>
      <PanelHeader
        title="Importar cuaderno"
        subtitle="Sube todos tus libros de golpe desde un archivo JSON (ideal para migrar desde tu PDF)"
      />

      <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        <strong>Year in Pixels</strong> y <strong>Overview</strong> se calculan solos desde el registro
        diario de páginas. Al importar, la app genera esas sesiones repartiendo las páginas entre las
        fechas de inicio y fin de cada libro.
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="bj-btn-primary flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          Elegir archivo .json
        </button>
        <button
          type="button"
          onClick={() => setJsonText(EXAMPLE)}
          className="rounded-xl border border-bj-border px-4 py-2 text-sm text-bj-muted hover:text-bj-navy"
        >
          Cargar ejemplo
        </button>
      </div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
        JSON del cuaderno
      </label>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={16}
        spellCheck={false}
        placeholder="Pega aquí el JSON con tus libros..."
        className="bj-input mb-4 w-full font-mono text-xs"
      />

      <button
        type="button"
        onClick={handleImport}
        disabled={!jsonText.trim()}
        className="bj-btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        Importar a la base de datos
      </button>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p>
            <strong>{result.booksImported}</strong> libros importados
            {result.booksSkipped > 0 && (
              <> · <strong>{result.booksSkipped}</strong> omitidos (ya existían)</>
            )}
          </p>
          {(result.sessionsGenerated > 0 || result.sessionsBackfilled > 0 || result.booksUpdated > 0) && (
            <p className="mt-1">
              <strong>{result.sessionsGenerated}</strong> días de lectura generados
              {result.sessionsBackfilled > 0 && (
                <> · <strong>{result.sessionsBackfilled}</strong> libros existentes con sesiones añadidas</>
              )}
              {result.booksUpdated > 0 && (
                <> · <strong>{result.booksUpdated}</strong> libros actualizados</>
              )}
              {" "}→ activa Year in Pixels y Overview
            </p>
          )}
          {result.wishlistImported > 0 && (
            <p className="mt-1">
              <strong>{result.wishlistImported}</strong> entradas de wishlist añadidas
            </p>
          )}
          {result.favoritesLinked > 0 && (
            <p className="mt-1">
              <strong>{result.favoritesLinked}</strong> favoritos del mes vinculados
            </p>
          )}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-bj-border bg-bj-surface/30 p-5 text-sm text-bj-muted">
        <p className="mb-2 font-semibold text-bj-navy">Formato del JSON</p>
        <ul className="list-inside list-disc space-y-1">
          <li><code>books</code> — con <code>startDate</code>, <code>endDate</code> y <code>pages</code> para Pixels/Overview</li>
          <li><code>generateReadingSessions</code> — true por defecto (crea el registro diario)</li>
          <li><code>backfillExisting</code> — true si ya importaste y quieres añadir sesiones a libros existentes</li>
          <li><code>wishlist</code> — títulos pendientes de leer</li>
          <li><code>monthlyFavorites</code> — mes 1–12 → título del libro</li>
        </ul>
        <p className="mt-3">
          Plantillas: <code>data/notebook-import-2025.json</code> y <code>data/notebook-import-2026.json</code>
        </p>
      </div>
    </div>
  );
}
