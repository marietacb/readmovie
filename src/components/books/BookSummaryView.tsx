"use client";

import { BookOpen, Calendar, Quote, BookMarked } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import {
  getTotalPagesRead,
  getCurrentPage,
  sessionPages,
  formatDateES,
} from "@/lib/readingStats";
import { formatDate } from "@/lib/utils";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import type { Book } from "@/types";

interface BookSummaryViewProps {
  book: Book;
}

export function BookSummaryView({ book }: BookSummaryViewProps) {
  const totalPages = getTotalPagesRead(book);
  const currentPage = getCurrentPage(book);
  const daysRead = new Set(book.readingSessions.map((s) => s.date)).size;
  const sessions = [...book.readingSessions].sort((a, b) => a.date.localeCompare(b.date));
  const quotes = [...book.quotes].sort((a, b) => a.date.localeCompare(b.date));
  const chapters = [...book.chapters].sort((a, b) => a.startPage - b.startPage);

  const avgPagesPerDay =
    daysRead > 0 ? Math.round(totalPages / daysRead) : 0;

  return (
    <div>
      <PanelHeader
        title="Resumen de lectura"
        subtitle={`${book.title} — ${book.author}`}
      />

      {/* Hero resumen */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-bj-navy/20 bg-gradient-to-br from-bj-navy/5 via-white to-bj-terracotta/5 p-6 md:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div
            className="h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-bj-border shadow-md"
            style={{ backgroundColor: book.spineColor }}
          >
            {book.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-bj-navy">{book.title}</h2>
            <p className="text-bj-muted">{book.author}</p>
            {book.rating > 0 && (
              <div className="mt-2">
                <StarRatingDisplay value={book.rating} size="md" />
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {book.startDate && (
                <span className="flex items-center gap-1 text-bj-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(book.startDate)} → {book.endDate ? formatDate(book.endDate) : "en curso"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Páginas leídas", value: totalPages },
            { label: "Página final", value: currentPage || "—" },
            { label: "Días de lectura", value: daysRead },
            { label: "Media págs./día", value: avgPagesPerDay },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/80 px-4 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-bj-navy">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-bj-muted">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Sesiones registradas", value: sessions.length },
            { label: "Frases favoritas", value: quotes.length },
            { label: "Capítulos marcados", value: chapters.length },
            { label: "Capítulos totales", value: book.totalChapters ?? "—" },
            { label: "Total del libro", value: book.pages ?? "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/60 px-4 py-3 text-center">
              <p className="text-lg font-bold text-bj-terracotta">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-bj-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {book.opinion && (
        <div className="bj-panel mb-6 p-5">
          <h3 className="mb-2 text-sm font-semibold text-bj-navy">Mi opinión final</h3>
          <p className="text-sm leading-relaxed text-bj-text/80">{book.opinion}</p>
        </div>
      )}

      {/* Timeline de lectura */}
      {sessions.length > 0 && (
        <div className="bj-panel mb-6 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BookMarked className="h-4 w-4" />
            Cronología de lectura
          </h3>
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <div key={session.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-bj-terracotta" />
                  {i < sessions.length - 1 && (
                    <div className="w-px flex-1 bg-bj-border" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-bj-navy">
                    {formatDateES(session.date)} · págs. {session.fromPage}–{session.toPage}
                    <span className="text-bj-terracotta"> (+{sessionPages(session)})</span>
                  </p>
                  {session.note && (
                    <p className="text-xs italic text-bj-muted">{session.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capítulos */}
      {chapters.length > 0 && (
        <div className="bj-panel mb-6 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BookOpen className="h-4 w-4" />
            Capítulos
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between rounded-lg bg-bj-surface/60 px-3 py-2"
              >
                <span className="text-sm text-bj-navy">{ch.title}</span>
                <span className="text-xs text-bj-muted">pág. {ch.startPage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frases */}
      {quotes.length > 0 && (
        <div className="bj-panel p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <Quote className="h-4 w-4" />
            Todas mis frases favoritas
          </h3>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <blockquote
                key={quote.id}
                className="border-l-4 border-bj-terracotta/50 pl-4"
              >
                <p className="font-serif text-sm italic text-bj-navy">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="mt-1 text-xs text-bj-muted">
                  {formatDateES(quote.date)}
                  {quote.page && ` · pág. ${quote.page}`}
                  {quote.chapter && ` · ${quote.chapter}`}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
