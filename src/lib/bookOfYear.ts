import { MONTH_NAMES } from "@/lib/constants";
import type { Book, BookOfYearBracket, Month, MonthlyFavorites } from "@/types";

export function emptyBracket(): BookOfYearBracket {
  return {
    r1: [null, null, null, null, null, null],
    r2: [null, null, null],
    r3: [null, null],
  };
}

export type BracketRound = "r1" | "r2" | "r3";

export interface BracketMatchView {
  id: string;
  round: BracketRound;
  index: number;
  title: string;
  leftBookId: string | null;
  rightBookId: string | null;
  leftLabel: string;
  rightLabel: string;
  winnerId: string | null;
  enabled: boolean;
}

function monthPair(index: number): [Month, Month] {
  return [(index * 2 + 1) as Month, (index * 2 + 2) as Month];
}

function favoriteBookId(favorites: MonthlyFavorites, month: Month): string | null {
  return favorites[month] ?? null;
}

function monthLabel(month: Month, favorites: MonthlyFavorites): string {
  const name = MONTH_NAMES[month];
  return favorites[month] ? name : `${name} — vacío`;
}

export function buildBracketMatches(
  favorites: MonthlyFavorites,
  bracket: BookOfYearBracket
): BracketMatchView[] {
  const matches: BracketMatchView[] = [];

  for (let i = 0; i < 6; i++) {
    const [leftMonth, rightMonth] = monthPair(i);
    const leftBookId = favoriteBookId(favorites, leftMonth);
    const rightBookId = favoriteBookId(favorites, rightMonth);
    matches.push({
      id: `r1-${i}`,
      round: "r1",
      index: i,
      title: `Enfrentamiento ${i + 1}`,
      leftBookId,
      rightBookId,
      leftLabel: monthLabel(leftMonth, favorites),
      rightLabel: monthLabel(rightMonth, favorites),
      winnerId: bracket.r1[i],
      enabled: Boolean(leftBookId && rightBookId),
    });
  }

  for (let i = 0; i < 3; i++) {
    const leftBookId = bracket.r1[i * 2];
    const rightBookId = bracket.r1[i * 2 + 1];
    matches.push({
      id: `r2-${i}`,
      round: "r2",
      index: i,
      title: `Semifinal ${i + 1}`,
      leftBookId,
      rightBookId,
      leftLabel: "Ganador anterior",
      rightLabel: "Ganador anterior",
      winnerId: bracket.r2[i],
      enabled: Boolean(leftBookId && rightBookId),
    });
  }

  matches.push({
    id: "r3-0",
    round: "r3",
    index: 0,
    title: "Semifinal final",
    leftBookId: bracket.r2[0],
    rightBookId: bracket.r2[1],
    leftLabel: "Ganador semifinal 1",
    rightLabel: "Ganador semifinal 2",
    winnerId: bracket.r3[0],
    enabled: Boolean(bracket.r2[0] && bracket.r2[1]),
  });

  matches.push({
    id: "r3-1",
    round: "r3",
    index: 1,
    title: "Gran final",
    leftBookId: bracket.r3[0],
    rightBookId: bracket.r2[2],
    leftLabel: "Finalista",
    rightLabel: "Ganador semifinal 3",
    winnerId: bracket.r3[1],
    enabled: Boolean(bracket.r3[0] && bracket.r2[2]),
  });

  return matches;
}

export function clearDownstream(bracket: BookOfYearBracket, round: BracketRound, index: number): BookOfYearBracket {
  const next = {
    r1: [...bracket.r1] as BookOfYearBracket["r1"],
    r2: [...bracket.r2] as BookOfYearBracket["r2"],
    r3: [...bracket.r3] as BookOfYearBracket["r3"],
  };

  if (round === "r1") {
    const r2Index = Math.floor(index / 2);
    next.r2[r2Index] = null;
    next.r3[0] = null;
    next.r3[1] = null;
    return next;
  }

  if (round === "r2") {
    if (index <= 1) next.r3[0] = null;
    next.r3[1] = null;
    return next;
  }

  if (round === "r3" && index === 0) {
    next.r3[1] = null;
  }

  return next;
}

export function pickBracketWinner(
  bracket: BookOfYearBracket,
  round: BracketRound,
  index: number,
  winnerId: string,
  favorites: MonthlyFavorites
): BookOfYearBracket {
  const matches = buildBracketMatches(favorites, bracket);
  const match = matches.find((m) => m.round === round && m.index === index);
  if (!match?.enabled) return bracket;
  if (winnerId !== match.leftBookId && winnerId !== match.rightBookId) return bracket;

  const next = clearDownstream(bracket, round, index);

  if (round === "r1") {
    next.r1[index] = winnerId;
  } else if (round === "r2") {
    next.r2[index] = winnerId;
  } else {
    next.r3[index] = winnerId;
  }

  return next;
}

export function getBookOfYear(
  bracket: BookOfYearBracket
): string | null {
  return bracket.r3[1];
}

export function getBookById(books: Book[], id: string | null): Book | undefined {
  if (!id) return undefined;
  return books.find((b) => b.id === id);
}

export function bracketMatchIndexForMonth(month: Month): number {
  return Math.floor((month - 1) / 2);
}

/** Invalida el enfrentamiento de r1 y todo lo downstream al cambiar un favorito mensual */
export function invalidateBracketForMonth(
  bracket: BookOfYearBracket,
  month: Month
): BookOfYearBracket {
  const matchIndex = bracketMatchIndexForMonth(month);
  const next = clearDownstream(bracket, "r1", matchIndex);
  next.r1[matchIndex] = null;
  return next;
}

/** Elimina ganadores inválidos tras borrar un libro o cambiar contendientes */
export function sanitizeBracket(bracket: BookOfYearBracket): BookOfYearBracket {
  const next: BookOfYearBracket = {
    r1: [...bracket.r1],
    r2: [...bracket.r2],
    r3: [...bracket.r3],
  };

  for (let i = 0; i < 3; i++) {
    const left = next.r1[i * 2];
    const right = next.r1[i * 2 + 1];
    const winner = next.r2[i];
    if (!left || !right || (winner && winner !== left && winner !== right)) {
      next.r2[i] = null;
    }
  }

  const semiLeft = next.r2[0];
  const semiRight = next.r2[1];
  if (!semiLeft || !semiRight || (next.r3[0] && next.r3[0] !== semiLeft && next.r3[0] !== semiRight)) {
    next.r3[0] = null;
  }

  const finalist = next.r3[0];
  const semiThree = next.r2[2];
  if (!finalist || !semiThree || (next.r3[1] && next.r3[1] !== finalist && next.r3[1] !== semiThree)) {
    next.r3[1] = null;
  }

  return next;
}
