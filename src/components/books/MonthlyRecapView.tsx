"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, BookMarked } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { MONTH_NAMES } from "@/lib/constants";
import { getMonthlyReadingStats, formatDateES, sessionPages } from "@/lib/readingStats";
import type { Book, Month } from "@/types";

interface MonthlyRecapViewProps {
  books: Book[];
}

export function MonthlyRecapView({ books }: MonthlyRecapViewProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState<Month>((now.getMonth() + 1) as Month);

  const stats = getMonthlyReadingStats(books, year, month);
  const maxDayPages = Math.max(...stats.pagesByDay.map((d) => d.pages), 1);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((month - 1) as Month);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((month + 1) as Month);
    }
  };

  return (
    <div>
      <PanelHeader
        title="Resumen del mes"
        subtitle="Todas tus estadísticas, páginas y frases del mes"
      />

      {/* Selector mes */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <button onClick={prevMonth} className="rounded-xl border border-bj-border p-2 hover:bg-bj-surface">
          <ChevronLeft className="h-5 w-5 text-bj-navy" />
        </button>
        <div className="text-center">
          <p className="font-serif text-2xl font-bold text-bj-navy">
            {MONTH_NAMES[month]} {year}
          </p>
        </div>
        <button onClick={nextMonth} className="rounded-xl border border-bj-border p-2 hover:bg-bj-surface">
          <ChevronRight className="h-5 w-5 text-bj-navy" />
        </button>
      </div>

      {/* Stats principales */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Páginas leídas", value: stats.totalPages, color: "text-bj-terracotta" },
          { label: "Días leyendo", value: stats.daysRead, color: "text-bj-navy" },
          { label: "Sesiones", value: stats.sessionsCount, color: "text-bj-navy" },
          { label: "Frases guardadas", value: stats.quotesCount, color: "text-bj-sage" },
          { label: "Libros tocados", value: stats.booksTouched, color: "text-bj-gold" },
        ].map((s) => (
          <div key={s.label} className="bj-panel p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-bj-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico páginas por día */}
      {stats.pagesByDay.length > 0 && (
        <div className="bj-panel mb-8 p-6">
          <h3 className="mb-5 text-sm font-semibold text-bj-navy">Páginas por día</h3>
          <div className="flex items-end gap-1.5 overflow-x-auto pb-2" style={{ minHeight: 100 }}>
            {stats.pagesByDay.map((day) => (
              <div key={day.date} className="flex min-w-[32px] flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-bj-terracotta">{day.pages}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-bj-navy to-bj-terracotta/70"
                  style={{
                    height: `${Math.max(8, (day.pages / maxDayPages) * 80)}px`,
                  }}
                />
                <span className="text-[9px] text-bj-muted">
                  {new Date(day.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sesiones del mes */}
        <div className="bj-panel p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BookMarked className="h-4 w-4" />
            Registro diario ({stats.sessionsCount})
          </h3>
          {stats.sessions.length === 0 ? (
            <p className="py-6 text-center text-sm text-bj-muted">Sin lecturas este mes</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {stats.sessions
                .sort((a, b) => b.session.date.localeCompare(a.session.date))
                .map(({ book, session }) => (
                  <div
                    key={session.id}
                    className="rounded-xl border border-bj-border bg-bj-surface/40 px-3 py-2.5"
                  >
                    <p className="text-xs font-medium text-bj-navy">{book.title}</p>
                    <p className="text-sm text-bj-text">
                      {formatDateES(session.date)} · {session.fromPage}→{session.toPage}
                      <span className="text-bj-terracotta"> (+{sessionPages(session)})</span>
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Frases del mes */}
        <div className="bj-panel-accent p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <Quote className="h-4 w-4" />
            Frases del mes ({stats.quotesCount})
          </h3>
          {stats.quotes.length === 0 ? (
            <p className="py-6 text-center text-sm text-bj-muted">Sin frases este mes</p>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {stats.quotes.map(({ book, quote }) => (
                <div key={quote.id} className="rounded-xl bg-white/80 p-3">
                  <p className="font-serif text-sm italic text-bj-navy">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-[10px] text-bj-muted">
                    {book.title}
                    {quote.page && ` · pág. ${quote.page}`}
                    · {formatDateES(quote.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats.totalPages === 0 && stats.quotesCount === 0 && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-bj-border py-12 text-center">
          <p className="text-sm text-bj-muted">
            No hay actividad de lectura en {MONTH_NAMES[month]} {year}
          </p>
          <p className="mt-1 text-xs text-bj-muted/70">
            Registra tus páginas diarias desde la reseña de un libro
          </p>
        </div>
      )}
    </div>
  );
}
