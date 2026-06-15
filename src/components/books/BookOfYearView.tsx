"use client";

import { Crown, RotateCcw, Trophy } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import {
  buildBracketMatches,
  getBookById,
  getBookOfYear,
  type BracketRound,
} from "@/lib/bookOfYear";
import { countAssignedFavorites } from "@/lib/yearlyFavorites";
import type { Book, BookOfYearBracket, MonthlyFavorites } from "@/types";
import { cn } from "@/lib/utils";

interface BookOfYearViewProps {
  books: Book[];
  year: number;
  monthlyFavorites: MonthlyFavorites;
  bracket: BookOfYearBracket;
  onPickWinner: (round: BracketRound, index: number, winnerId: string) => void;
  onResetBracket: () => void;
  onBookClick: (book: Book) => void;
}

function BracketBookCard({
  book,
  label,
  selected,
  disabled,
  onSelect,
  onOpen,
}: {
  book: Book | undefined;
  label: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  if (!book) {
    return (
      <div className="flex min-h-[120px] flex-1 items-center justify-center rounded-xl border border-dashed border-bj-border bg-bj-surface/30 px-3 text-center text-xs text-bj-muted">
        {label}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      onDoubleClick={onOpen}
      className={cn(
        "flex min-h-[120px] flex-1 flex-col items-center rounded-xl border px-3 py-3 text-center transition-all",
        selected
          ? "border-bj-gold bg-amber-50 shadow-md ring-2 ring-bj-gold/40"
          : "border-bj-border bg-white hover:border-bj-navy/30 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-50"
      )}
      title="Clic para elegir ganador · Doble clic para abrir reseña"
    >
      <div
        className="mb-2 h-20 w-14 overflow-hidden rounded-md border border-bj-border shadow-sm"
        style={{ backgroundColor: book.spineColor }}
      >
        {book.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <p className="line-clamp-2 text-xs font-semibold text-bj-navy">{book.title}</p>
      <p className="mt-0.5 line-clamp-1 text-[10px] text-bj-muted">{book.author}</p>
      {book.rating > 0 && (
        <span className="mt-1">
          <StarRatingDisplay value={book.rating} size="sm" />
        </span>
      )}
    </button>
  );
}

export function BookOfYearView({
  books,
  year,
  monthlyFavorites,
  bracket,
  onPickWinner,
  onResetBracket,
  onBookClick,
}: BookOfYearViewProps) {
  const assigned = countAssignedFavorites(monthlyFavorites);
  const matches = buildBracketMatches(monthlyFavorites, bracket);
  const championId = getBookOfYear(bracket);
  const champion = getBookById(books, championId);

  const r1Matches = matches.filter((m) => m.round === "r1");
  const r2Matches = matches.filter((m) => m.round === "r2");
  const r3Matches = matches.filter((m) => m.round === "r3");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <PanelHeader
          title="Book of the Year"
          subtitle={`Eliminatorias ${year} — elige ganadores entre tus 12 favoritos del mes`}
        />
        <button
          type="button"
          onClick={onResetBracket}
          className="flex items-center gap-2 rounded-xl border border-bj-border px-3 py-2 text-xs font-medium text-bj-muted transition-colors hover:border-bj-navy/20 hover:text-bj-navy"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar torneo
        </button>
      </div>

      {assigned < 12 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Tienes <strong>{assigned}/12</strong> favoritos asignados para {year}. Completa la pestaña{" "}
          <strong>Favoritos</strong> para activar todos los enfrentamientos.
        </div>
      )}

      {champion && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-bj-gold/40 bg-gradient-to-br from-amber-50 via-white to-bj-cream p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bj-gold/20">
              <Crown className="h-8 w-8 text-bj-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-bj-gold">Libro del año {year}</p>
              <button
                type="button"
                onClick={() => onBookClick(champion)}
                className="mt-1 text-left font-serif text-2xl font-bold text-bj-navy hover:underline"
              >
                {champion.title}
              </button>
              <p className="text-sm text-bj-muted">{champion.author}</p>
            </div>
            {champion.rating > 0 && <StarRatingDisplay value={champion.rating} />}
          </div>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-bj-navy">
            <Trophy className="h-5 w-5 text-bj-terracotta" />
            Primera ronda
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {r1Matches.map((match) => {
              const left = getBookById(books, match.leftBookId);
              const right = getBookById(books, match.rightBookId);
              return (
                <div key={match.id} className="rounded-2xl border border-bj-border bg-bj-surface/20 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">{match.title}</p>
                  <div className="flex items-stretch gap-3">
                    <BracketBookCard
                      book={left}
                      label={match.leftLabel}
                      selected={match.winnerId === match.leftBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.leftBookId && onPickWinner("r1", match.index, match.leftBookId)}
                      onOpen={() => left && onBookClick(left)}
                    />
                    <span className="self-center text-xs font-bold text-bj-muted">VS</span>
                    <BracketBookCard
                      book={right}
                      label={match.rightLabel}
                      selected={match.winnerId === match.rightBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.rightBookId && onPickWinner("r1", match.index, match.rightBookId)}
                      onOpen={() => right && onBookClick(right)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-lg font-bold text-bj-navy">Semifinales</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {r2Matches.map((match) => {
              const left = getBookById(books, match.leftBookId);
              const right = getBookById(books, match.rightBookId);
              return (
                <div key={match.id} className="rounded-2xl border border-bj-border bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">{match.title}</p>
                  <div className="flex flex-col gap-3">
                    <BracketBookCard
                      book={left}
                      label="Pendiente"
                      selected={match.winnerId === match.leftBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.leftBookId && onPickWinner("r2", match.index, match.leftBookId)}
                      onOpen={() => left && onBookClick(left)}
                    />
                    <BracketBookCard
                      book={right}
                      label="Pendiente"
                      selected={match.winnerId === match.rightBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.rightBookId && onPickWinner("r2", match.index, match.rightBookId)}
                      onOpen={() => right && onBookClick(right)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-lg font-bold text-bj-navy">Finales</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {r3Matches.map((match) => {
              const left = getBookById(books, match.leftBookId);
              const right = getBookById(books, match.rightBookId);
              const isGrandFinal = match.index === 1;
              return (
                <div
                  key={match.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    isGrandFinal
                      ? "border-bj-gold/50 bg-gradient-to-br from-amber-50/80 to-white shadow-md"
                      : "border-bj-border bg-white shadow-sm"
                  )}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">{match.title}</p>
                  <div className="flex items-stretch gap-3">
                    <BracketBookCard
                      book={left}
                      label="Pendiente"
                      selected={match.winnerId === match.leftBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.leftBookId && onPickWinner("r3", match.index, match.leftBookId)}
                      onOpen={() => left && onBookClick(left)}
                    />
                    <span className="self-center text-xs font-bold text-bj-muted">VS</span>
                    <BracketBookCard
                      book={right}
                      label="Pendiente"
                      selected={match.winnerId === match.rightBookId}
                      disabled={!match.enabled}
                      onSelect={() => match.rightBookId && onPickWinner("r3", match.index, match.rightBookId)}
                      onOpen={() => right && onBookClick(right)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
