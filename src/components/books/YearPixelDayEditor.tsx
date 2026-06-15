"use client";

import { useMemo, useState } from "react";
import { Plus, Star, Trash2, X } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { buildSessionForPages, formatDateES } from "@/lib/readingStats";
import { getBooksFinishedOnDate, getSessionsForDate } from "@/lib/yearInPixels";
import type { Book } from "@/types";

interface YearPixelDayEditorProps {
  books: Book[];
  date: string;
  onClose: () => void;
}

export function YearPixelDayEditor({ books, date, onClose }: YearPixelDayEditorProps) {
  const { addReadingSession, updateReadingSession, removeReadingSession } = useMediaTracker();

  const sessions = useMemo(() => getSessionsForDate(books, date), [books, date]);
  const finishedBooks = useMemo(() => getBooksFinishedOnDate(books, date), [books, date]);

  const [pendingEdits, setPendingEdits] = useState<Record<string, string>>({});
  const [newBookId, setNewBookId] = useState("");
  const [newPages, setNewPages] = useState("");

  const totalPages = sessions.reduce((sum, entry) => sum + entry.pages, 0);

  const handleSavePages = (bookId: string, sessionId: string, fromPage: number) => {
    const raw = (pendingEdits[sessionId] ?? "").trim();
    const session = sessions.find((entry) => entry.session.id === sessionId);
    const savedPages = session?.pages ?? 0;
    const pages = raw === "" ? savedPages : Number(raw);
    if (!Number.isFinite(pages) || pages < 0) return;

    setPendingEdits((prev) => {
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });

    if (pages === savedPages) return;

    if (pages === 0) {
      removeReadingSession(bookId, sessionId);
      return;
    }

    updateReadingSession(bookId, sessionId, { toPage: fromPage + pages });
  };

  const handleAddSession = () => {
    const pages = Number(newPages);
    if (!newBookId || !Number.isFinite(pages) || pages <= 0) return;

    const book = books.find((b) => b.id === newBookId);
    if (!book) return;

    const session = buildSessionForPages(book, date, pages);
    if (!session) return;

    addReadingSession(book.id, session);
    setNewPages("");
  };

  return (
    <div className="mt-6 rounded-2xl border border-bj-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-bj-navy">
            {formatDateES(date)}
          </h3>
          <p className="text-sm text-bj-muted">
            {totalPages > 0 ? (
              <>
                <strong className="text-bj-navy">{totalPages}</strong> páginas registradas
              </>
            ) : (
              "Sin lectura este día"
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-bj-muted hover:bg-bj-surface"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {finishedBooks.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            Libro terminado
          </p>
          <ul className="space-y-1">
            {finishedBooks.map((book) => (
              <li key={book.id} className="text-sm font-medium text-amber-950">
                {book.title}
                {book.author && (
                  <span className="font-normal text-amber-800"> · {book.author}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-bj-muted">
            Páginas por libro
          </p>
          {sessions.map(({ book, session, pages }) => (
            <div
              key={session.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-bj-border bg-bj-surface/40 px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-bj-navy">
                {book.title}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={pendingEdits[session.id] ?? String(pages)}
                  onChange={(e) =>
                    setPendingEdits((prev) => ({ ...prev, [session.id]: e.target.value }))
                  }
                  onBlur={() => handleSavePages(book.id, session.id, session.fromPage)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSavePages(book.id, session.id, session.fromPage);
                    }
                  }}
                  className="bj-input w-20 text-center text-sm"
                  aria-label={`Páginas de ${book.title}`}
                />
                <span className="text-xs text-bj-muted">págs.</span>
                <button
                  type="button"
                  onClick={() => removeReadingSession(book.id, session.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                  aria-label={`Eliminar sesión de ${book.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-dashed border-bj-border bg-bj-surface/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Añadir lectura
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            value={newBookId}
            onChange={(e) => setNewBookId(e.target.value)}
            className="bj-input min-w-[180px] flex-1 text-sm"
          >
            <option value="">Elige un libro</option>
            {[...books]
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
          </select>
          <input
            type="number"
            min={1}
            value={newPages}
            onChange={(e) => setNewPages(e.target.value)}
            placeholder="Páginas"
            className="bj-input w-24 text-sm"
          />
          <button
            type="button"
            onClick={handleAddSession}
            disabled={!newBookId || !newPages || Number(newPages) <= 0}
            className="bj-btn-primary flex items-center gap-1 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
