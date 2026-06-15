"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import {
  ACTIVITY_KIND_COLORS,
  ACTIVITY_KIND_LABELS,
  filterActivityEvents,
  getActivityEvents,
  getActivityYears,
  getEventsForDate,
  getMonthGrid,
  type ActivityFilter,
  type ActivityEvent,
} from "@/lib/mediaActivity";
import { formatDateES } from "@/lib/readingStats";
import { MONTH_SHORT } from "@/lib/bookStats";
import type { Book, Movie, Series } from "@/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"] as const;

const FILTERS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "book", label: "Libros" },
  { id: "movie", label: "Cine" },
  { id: "series", label: "Series" },
];

interface ActivityCalendarViewProps {
  books: Book[];
  movies: Movie[];
  series: Series[];
  defaultFilter?: ActivityFilter;
  onBookClick?: (bookId: string) => void;
  onMovieClick?: (movieId: string) => void;
  onSeriesClick?: (seriesId: string) => void;
}

export function ActivityCalendarView({
  books,
  movies,
  series,
  defaultFilter = "all",
  onBookClick,
  onMovieClick,
  onSeriesClick,
}: ActivityCalendarViewProps) {
  const allEvents = useMemo(
    () => getActivityEvents(books, movies, series),
    [books, movies, series]
  );
  const years = useMemo(() => getActivityYears(allEvents), [allEvents]);

  const [filter, setFilter] = useState<ActivityFilter>(defaultFilter);
  const [year, setYear] = useState(() => years[0] ?? new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const events = useMemo(
    () => filterActivityEvents(allEvents, filter),
    [allEvents, filter]
  );

  const monthEvents = useMemo(
    () =>
      events.filter((event) => {
        const d = new Date(event.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      }),
    [events, year, month]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ActivityEvent[]>();
    monthEvents.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [monthEvents]);

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const selectedEvents = selectedDate ? getEventsForDate(events, selectedDate) : [];

  const shiftMonth = (delta: number) => {
    let nextMonth = month + delta;
    let nextYear = year;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    setMonth(nextMonth);
    setYear(nextYear);
    setSelectedDate(null);
  };

  const handleEventClick = (event: ActivityEvent) => {
    if (event.bookId) onBookClick?.(event.bookId);
    if (event.movieId) onMovieClick?.(event.movieId);
    if (event.seriesId) onSeriesClick?.(event.seriesId);
  };

  return (
    <div>
      <PanelHeader
        title="Calendario de actividad"
        subtitle="Todo lo que has leído, visto y seguido — en un solo sitio"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              filter === item.id
                ? "bg-bj-navy text-white"
                : "border border-bj-border bg-white text-bj-muted hover:text-bj-navy"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg border border-bj-border p-2 hover:bg-bj-surface"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="min-w-[10rem] text-center font-serif text-xl font-bold text-bj-navy">
            {MONTH_SHORT[month - 1]} {year}
          </h3>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg border border-bj-border p-2 hover:bg-bj-surface"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {years.length > 1 && (
          <select
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setSelectedDate(null);
            }}
            className="bj-input w-auto text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-bj-border bg-white p-4 shadow-sm">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-bj-muted"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <div key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square" />;
                }

                const dayEvents = eventsByDate.get(date) ?? [];
                const dayNumber = Number(date.slice(8, 10));
                const isSelected = selectedDate === date;
                const isToday = date === new Date().toISOString().slice(0, 10);

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "relative flex aspect-square flex-col rounded-lg border p-1 text-left transition-colors",
                      isSelected
                        ? "border-bj-terracotta bg-bj-terracotta/5 ring-2 ring-bj-terracotta/30"
                        : "border-bj-border/60 hover:border-bj-terracotta/40 hover:bg-bj-surface/40",
                      isToday && !isSelected && "border-bj-navy/30"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        isToday ? "text-bj-terracotta" : "text-bj-navy"
                      )}
                    >
                      {dayNumber}
                    </span>
                    <div className="mt-auto flex flex-wrap gap-0.5">
                      {dayEvents.slice(0, 4).map((event) => (
                        <span
                          key={event.id}
                          className={cn("h-1.5 w-1.5 rounded-full", ACTIVITY_KIND_COLORS[event.kind])}
                        />
                      ))}
                      {dayEvents.length > 4 && (
                        <span className="text-[8px] text-bj-muted">+{dayEvents.length - 4}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-bj-muted">
        {(Object.keys(ACTIVITY_KIND_LABELS) as Array<keyof typeof ACTIVITY_KIND_LABELS>).map((kind) => (
          <span key={kind} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", ACTIVITY_KIND_COLORS[kind])} />
            {ACTIVITY_KIND_LABELS[kind]}
          </span>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 rounded-2xl border border-bj-border bg-white p-5 shadow-sm">
          <h4 className="mb-3 font-serif text-lg font-bold text-bj-navy">
            {formatDateES(selectedDate)}
          </h4>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-bj-muted">Nada registrado este día.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleEventClick(event)}
                  className="flex w-full items-start gap-3 rounded-xl border border-bj-border bg-bj-surface/30 px-4 py-3 text-left hover:bg-bj-surface"
                >
                  <span
                    className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", ACTIVITY_KIND_COLORS[event.kind])}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-bj-navy">{event.title}</p>
                    {event.subtitle && (
                      <p className="text-sm text-bj-muted">{event.subtitle}</p>
                    )}
                    {event.detail && (
                      <p className="text-xs text-bj-terracotta">{event.detail}</p>
                    )}
                  </div>
                  <span className="text-xs text-bj-muted">{ACTIVITY_KIND_LABELS[event.kind]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
