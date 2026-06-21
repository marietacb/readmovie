"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookMarked,
  CalendarDays,
  Film,
  TrendingUp,
  Tv,
} from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ReadingGoalRing } from "@/components/ui/ReadingGoalRing";
import { useAuth } from "@/context/AuthContext";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import {
  ACTIVITY_KIND_COLORS,
  ACTIVITY_KIND_LABELS,
  getActivityEvents,
} from "@/lib/mediaActivity";
import { getFinishedThisYear, getBookShelf } from "@/lib/bookStats";
import { getMoviesWatchedInYear } from "@/lib/movieStats";
import { getSeriesByStatus, getSeriesFinishedInYear } from "@/lib/seriesStats";
import { formatDateES } from "@/lib/readingStats";
import { cn } from "@/lib/utils";

export function HomeDashboardView() {
  const router = useRouter();
  const { user } = useAuth();
  const { books, movies, series, readingGoal, setReadingGoal, isLoaded } = useMediaTracker();

  const year = new Date().getFullYear();
  const finishedBooks = getFinishedThisYear(books);
  const readingNow = books.filter((b) => getBookShelf(b) === "leyendo");
  const watchingNow = getSeriesByStatus(series, "watching");
  const moviesThisYear = getMoviesWatchedInYear(movies, year);
  const seriesFinishedYear = getSeriesFinishedInYear(series, year);

  const recentActivity = getActivityEvents(books, movies, series).slice(0, 8);

  const greetingName = user?.email?.split("@")[0] ?? "Lector";

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-bj-border border-t-bj-navy" />
      </div>
    );
  }

  return (
    <div>
      <PanelHeader
        title={`Hola, ${greetingName}`}
        subtitle="Tu diario unificado de lecturas, cine y series"
      />

      <div className="mb-8">
        <ReadingGoalRing
          current={finishedBooks.length}
          goal={readingGoal}
          onGoalChange={setReadingGoal}
        />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Libros"
          value={books.length}
          icon={<BookOpen className="h-5 w-5" />}
          accent="bg-bj-terracotta"
          trend={`${readingNow.length} leyendo`}
        />
        <StatCard
          label="Películas"
          value={movies.length}
          icon={<Film className="h-5 w-5" />}
          accent="bg-bj-navy"
          trend={`${moviesThisYear.length} en ${year}`}
        />
        <StatCard
          label="Series"
          value={series.length}
          icon={<Tv className="h-5 w-5" />}
          accent="bg-bj-sage"
          trend={`${watchingNow.length} en curso`}
        />
        <StatCard
          label="Actividad"
          value={recentActivity.length}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="bg-bj-gold"
          trend="últimos registros"
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/books"
          className="bj-panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3 h-1 w-10 rounded-full bg-bj-terracotta" />
          <BookOpen className="mb-3 h-7 w-7 text-bj-navy" />
          <h3 className="font-serif text-xl font-bold text-bj-navy">Lecturas</h3>
          <p className="mt-1 flex-1 text-sm text-bj-muted">
            {finishedBooks.length} terminados este año · {readingNow.length} en curso
          </p>
          <span className="mt-4 text-sm font-semibold text-bj-terracotta group-hover:underline">
            Ir al diario →
          </span>
        </Link>
        <Link
          href="/movies"
          className="bj-panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3 h-1 w-10 rounded-full bg-bj-navy" />
          <Film className="mb-3 h-7 w-7 text-bj-navy" />
          <h3 className="font-serif text-xl font-bold text-bj-navy">Cine</h3>
          <p className="mt-1 flex-1 text-sm text-bj-muted">
            {moviesThisYear.length} visionadas en {year}
          </p>
          <span className="mt-4 text-sm font-semibold text-bj-terracotta group-hover:underline">
            Ir al diario →
          </span>
        </Link>
        <Link
          href="/series"
          className="bj-panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3 h-1 w-10 rounded-full bg-bj-sage" />
          <Tv className="mb-3 h-7 w-7 text-bj-navy" />
          <h3 className="font-serif text-xl font-bold text-bj-navy">Series</h3>
          <p className="mt-1 flex-1 text-sm text-bj-muted">
            {watchingNow.length} viendo · {seriesFinishedYear.length} terminadas en {year}
          </p>
          <span className="mt-4 text-sm font-semibold text-bj-terracotta group-hover:underline">
            Ir al diario →
          </span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bj-panel p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-bj-navy">
            <BookMarked className="h-4 w-4" />
            Leyendo y viendo ahora
          </h3>
          {readingNow.length === 0 && watchingNow.length === 0 ? (
            <p className="text-sm text-bj-muted">No tienes lecturas ni series en curso.</p>
          ) : (
            <div className="space-y-2">
              {readingNow.slice(0, 3).map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => router.push("/books")}
                  className="flex w-full items-center justify-between rounded-xl border border-bj-border bg-white px-4 py-3 text-left hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-bj-navy">{book.title}</p>
                    <p className="text-xs text-bj-muted">{book.author} · Libro</p>
                  </div>
                </button>
              ))}
              {watchingNow.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push("/series")}
                  className="flex w-full items-center justify-between rounded-xl border border-bj-border bg-white px-4 py-3 text-left hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-bj-navy">{item.title}</p>
                    <p className="text-xs text-bj-muted">
                      {item.platform || "Serie"}
                      {item.episodesWatched != null && item.totalEpisodes != null
                        ? ` · ${item.episodesWatched}/${item.totalEpisodes} eps.`
                        : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bj-panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-bj-navy">
              <CalendarDays className="h-4 w-4" />
              Actividad reciente
            </h3>
            <Link href="/books" className="text-xs font-medium text-bj-terracotta hover:underline">
              Ver calendario
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-bj-muted">Aún no hay actividad registrada.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    if (event.kind === "book") router.push("/books");
                    else if (event.kind === "movie") router.push("/movies");
                    else router.push("/series");
                  }}
                  className="flex w-full items-start gap-3 rounded-xl border border-bj-border bg-white px-4 py-3 text-left hover:shadow-sm"
                >
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      ACTIVITY_KIND_COLORS[event.kind],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-bj-navy">{event.title}</p>
                    <p className="text-xs text-bj-muted">
                      {ACTIVITY_KIND_LABELS[event.kind]}
                      {event.detail ? ` · ${event.detail}` : ""}
                      {" · "}
                      {formatDateES(event.date)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
