import { emptyBracket, sanitizeBracket } from "@/lib/bookOfYear";
import type { BookOfYearBracket, YearlyBookOfYearBrackets } from "@/types";

function isBracketShape(value: unknown): value is BookOfYearBracket {
  if (!value || typeof value !== "object") return false;
  const b = value as BookOfYearBracket;
  return Array.isArray(b.r1) && Array.isArray(b.r2) && Array.isArray(b.r3);
}

export function normalizeYearlyBookOfYearBrackets(raw: unknown): YearlyBookOfYearBrackets {
  if (!raw || typeof raw !== "object") return {};

  const record = raw as Record<string, unknown>;
  const yearly: YearlyBookOfYearBrackets = {};

  Object.entries(record).forEach(([yearKey, value]) => {
    const year = Number(yearKey);
    if (Number.isNaN(year) || !isBracketShape(value)) return;
    yearly[year] = {
      r1: [...value.r1] as BookOfYearBracket["r1"],
      r2: [...value.r2] as BookOfYearBracket["r2"],
      r3: [...value.r3] as BookOfYearBracket["r3"],
    };
  });

  return yearly;
}

export function getBracketForYear(
  yearly: YearlyBookOfYearBrackets,
  year: number
): BookOfYearBracket {
  return yearly[year] ?? emptyBracket();
}

export function setBracketForYear(
  yearly: YearlyBookOfYearBrackets,
  year: number,
  bracket: BookOfYearBracket
): YearlyBookOfYearBrackets {
  return { ...yearly, [year]: bracket };
}

export function removeBookFromYearlyBrackets(
  yearly: YearlyBookOfYearBrackets,
  bookId: string
): YearlyBookOfYearBrackets {
  return Object.fromEntries(
    Object.entries(yearly).map(([year, bracket]) => {
      const scrub = (id: string | null) => (id === bookId ? null : id);
      const scrubbed: BookOfYearBracket = {
        r1: bracket.r1.map(scrub) as BookOfYearBracket["r1"],
        r2: bracket.r2.map(scrub) as BookOfYearBracket["r2"],
        r3: bracket.r3.map(scrub) as BookOfYearBracket["r3"],
      };
      return [year, sanitizeBracket(scrubbed)];
    })
  ) as YearlyBookOfYearBrackets;
}
