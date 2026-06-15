"use client";

import { useState } from "react";
import { Plus, Trash2, BookMarked, Quote } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import {
  sessionPages,
  getCurrentPage,
  getChapterAtPage,
  formatDateES,
} from "@/lib/readingStats";
import type { Book } from "@/types";

interface BookReadingJournalProps {
  book: Book;
}

export function BookReadingJournal({ book }: BookReadingJournalProps) {
  const { addReadingSession, removeReadingSession, addBookQuote, removeBookQuote } =
    useMediaTracker();

  const today = new Date().toISOString().split("T")[0];
  const lastPage = getCurrentPage(book);

  const [sessionForm, setSessionForm] = useState({
    date: today,
    fromPage: lastPage > 0 ? lastPage : 1,
    toPage: lastPage > 0 ? lastPage + 20 : 20,
    note: "",
  });

  const [quoteForm, setQuoteForm] = useState({
    text: "",
    page: "",
    chapter: "",
    date: today,
  });

  const handleAddSession = () => {
    if (sessionForm.toPage <= sessionForm.fromPage) return;
    addReadingSession(book.id, {
      date: sessionForm.date,
      fromPage: sessionForm.fromPage,
      toPage: sessionForm.toPage,
      note: sessionForm.note || undefined,
    });
    setSessionForm({
      date: today,
      fromPage: sessionForm.toPage,
      toPage: sessionForm.toPage + 20,
      note: "",
    });
  };

  const handleAddQuote = () => {
    if (!quoteForm.text.trim()) return;
    const page = quoteForm.page ? parseInt(quoteForm.page) : undefined;
    const chapter =
      quoteForm.chapter ||
      (page ? getChapterAtPage(book.chapters, page)?.title : undefined);

    addBookQuote(book.id, {
      text: quoteForm.text.trim(),
      page,
      chapter,
      date: quoteForm.date,
    });
    setQuoteForm({ text: "", page: "", chapter: "", date: today });
  };

  const sessions = [...book.readingSessions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const quotes = [...book.quotes].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="space-y-8">
      {/* Progreso actual */}
      <div className="flex flex-wrap gap-4 rounded-2xl border border-bj-terracotta/20 bg-gradient-to-r from-bj-terracotta/5 to-transparent p-5">
        <div>
          <p className="text-xs text-bj-muted">Página actual</p>
          <p className="text-2xl font-bold text-bj-navy">
            {lastPage || "—"}
            {book.pages && <span className="text-base font-normal text-bj-muted"> / {book.pages}</span>}
          </p>
        </div>
        <div>
          <p className="text-xs text-bj-muted">Páginas leídas (total)</p>
          <p className="text-2xl font-bold text-bj-terracotta">
            {book.readingSessions.reduce((s, sess) => s + sessionPages(sess), 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-bj-muted">Días de lectura</p>
          <p className="text-2xl font-bold text-bj-navy">
            {new Set(book.readingSessions.map((s) => s.date)).size}
          </p>
        </div>
      </div>

      {/* Registro diario */}
      <div className="bj-panel p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
          <BookMarked className="h-4 w-4" />
          Registro de hoy
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Fecha</label>
            <input
              type="date"
              value={sessionForm.date}
              onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))}
              className="bj-input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Desde página</label>
            <input
              type="number"
              min={1}
              value={sessionForm.fromPage}
              onChange={(e) =>
                setSessionForm((f) => ({ ...f, fromPage: parseInt(e.target.value) || 0 }))
              }
              className="bj-input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-bj-muted">Hasta página</label>
            <input
              type="number"
              min={1}
              value={sessionForm.toPage}
              onChange={(e) =>
                setSessionForm((f) => ({ ...f, toPage: parseInt(e.target.value) || 0 }))
              }
              className="bj-input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddSession}
              disabled={sessionForm.toPage <= sessionForm.fromPage}
              className="bj-btn-primary flex w-full items-center justify-center gap-1 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              {sessionForm.toPage > sessionForm.fromPage
                ? `+${sessionForm.toPage - sessionForm.fromPage} págs.`
                : "Registrar"}
            </button>
          </div>
        </div>
        <input
          value={sessionForm.note}
          onChange={(e) => setSessionForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="Nota opcional (ej. leí en el tren, capítulo emocionante...)"
          className="bj-input mt-3 text-sm"
        />
      </div>

      {/* Historial sesiones */}
      {sessions.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-bj-navy">Historial diario</h3>
          <div className="space-y-2">
            {sessions.map((session) => {
              const pages = sessionPages(session);
              const chapter = getChapterAtPage(book.chapters, session.toPage);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-bj-border bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-bj-navy">
                      {formatDateES(session.date)} · págs. {session.fromPage} → {session.toPage}
                      <span className="ml-2 text-bj-terracotta">({pages} págs.)</span>
                    </p>
                    {chapter && (
                      <p className="text-xs text-bj-muted">Capítulo: {chapter.title}</p>
                    )}
                    {session.note && (
                      <p className="text-xs italic text-bj-muted">{session.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeReadingSession(book.id, session.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Frases favoritas */}
      <div className="bj-panel-accent p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
          <Quote className="h-4 w-4" />
          Añadir frase favorita
        </h3>
        <textarea
          value={quoteForm.text}
          onChange={(e) => setQuoteForm((f) => ({ ...f, text: e.target.value }))}
          placeholder="Escribe la frase que te ha gustado..."
          rows={3}
          className="bj-input mb-3 resize-none"
        />
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="number"
            value={quoteForm.page}
            onChange={(e) => setQuoteForm((f) => ({ ...f, page: e.target.value }))}
            placeholder="Página"
            className="bj-input text-sm"
          />
          <input
            value={quoteForm.chapter}
            onChange={(e) => setQuoteForm((f) => ({ ...f, chapter: e.target.value }))}
            placeholder="Capítulo (opcional)"
            className="bj-input text-sm"
          />
          <input
            type="date"
            value={quoteForm.date}
            onChange={(e) => setQuoteForm((f) => ({ ...f, date: e.target.value }))}
            className="bj-input text-sm"
          />
          <button
            onClick={handleAddQuote}
            disabled={!quoteForm.text.trim()}
            className="bj-btn-primary flex items-center justify-center gap-1 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Guardar frase
          </button>
        </div>
      </div>

      {quotes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-bj-navy">
            Frases guardadas ({quotes.length})
          </h3>
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="relative rounded-xl border border-bj-border bg-white p-4 pl-5"
              >
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-bj-terracotta/60" />
                <p className="font-serif text-sm italic leading-relaxed text-bj-navy">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="mt-2 text-xs text-bj-muted">
                  {formatDateES(quote.date)}
                  {quote.page && ` · pág. ${quote.page}`}
                  {quote.chapter && ` · ${quote.chapter}`}
                </p>
                <button
                  onClick={() => removeBookQuote(book.id, quote.id)}
                  className="absolute right-3 top-3 rounded-lg p-1 text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
