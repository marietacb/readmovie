import { describe, expect, it } from "vitest";
import { EMPTY_MONTHLY_FAVORITES } from "@/lib/constants";
import {
  bracketMatchIndexForMonth,
  buildBracketMatches,
  emptyBracket,
  getBookOfYear,
  invalidateBracketForMonth,
  pickBracketWinner,
  sanitizeBracket,
} from "@/lib/bookOfYear";
import type { Month, MonthlyFavorites } from "@/types";

function favoritesWithPairs(pairs: [string, string][]): MonthlyFavorites {
  const favorites = EMPTY_MONTHLY_FAVORITES();
  pairs.forEach(([left, right], index) => {
    favorites[(index * 2 + 1) as Month] = left;
    favorites[(index * 2 + 2) as Month] = right;
  });
  return favorites;
}

describe("bookOfYear", () => {
  const favorites = favoritesWithPairs([
    ["b1", "b2"],
    ["b3", "b4"],
    ["b5", "b6"],
    ["b7", "b8"],
    ["b9", "b10"],
    ["b11", "b12"],
  ]);

  it("empareja meses consecutivos en r1", () => {
    const matches = buildBracketMatches(favorites, emptyBracket());
    const r1 = matches.filter((m) => m.round === "r1");

    expect(r1).toHaveLength(6);
    expect(r1[0].leftBookId).toBe("b1");
    expect(r1[0].rightBookId).toBe("b2");
    expect(r1[5].leftBookId).toBe("b11");
    expect(r1[5].rightBookId).toBe("b12");
  });

  it("recorre el torneo hasta elegir libro del año", () => {
    let bracket = emptyBracket();

    bracket = pickBracketWinner(bracket, "r1", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r1", 1, "b3", favorites);
    bracket = pickBracketWinner(bracket, "r1", 2, "b5", favorites);
    bracket = pickBracketWinner(bracket, "r1", 3, "b7", favorites);
    bracket = pickBracketWinner(bracket, "r1", 4, "b9", favorites);
    bracket = pickBracketWinner(bracket, "r1", 5, "b11", favorites);

    bracket = pickBracketWinner(bracket, "r2", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r2", 1, "b5", favorites);
    bracket = pickBracketWinner(bracket, "r2", 2, "b9", favorites);

    bracket = pickBracketWinner(bracket, "r3", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r3", 1, "b1", favorites);

    expect(getBookOfYear(bracket)).toBe("b1");
  });

  it("limpia rondas posteriores al cambiar un ganador de r1", () => {
    let bracket = emptyBracket();
    bracket = pickBracketWinner(bracket, "r1", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r1", 1, "b3", favorites);
    bracket = pickBracketWinner(bracket, "r2", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r1", 0, "b2", favorites);

    expect(bracket.r1[0]).toBe("b2");
    expect(bracket.r2[0]).toBeNull();
    expect(bracket.r3[0]).toBeNull();
    expect(bracket.r3[1]).toBeNull();
  });

  it("invalida el enfrentamiento al cambiar un favorito mensual", () => {
    let bracket = emptyBracket();
    bracket = pickBracketWinner(bracket, "r1", 0, "b1", favorites);
    bracket = pickBracketWinner(bracket, "r1", 1, "b3", favorites);
    bracket = pickBracketWinner(bracket, "r2", 0, "b1", favorites);

    const reset = invalidateBracketForMonth(bracket, 2);

    expect(reset.r1[0]).toBeNull();
    expect(reset.r2[0]).toBeNull();
    expect(reset.r3[0]).toBeNull();
    expect(reset.r3[1]).toBeNull();
  });

  it("mapea cada mes al índice correcto de r1", () => {
    expect(bracketMatchIndexForMonth(1)).toBe(0);
    expect(bracketMatchIndexForMonth(2)).toBe(0);
    expect(bracketMatchIndexForMonth(3)).toBe(1);
    expect(bracketMatchIndexForMonth(12)).toBe(5);
  });

  it("rechaza ganadores que no pertenecen al enfrentamiento", () => {
    const bracket = emptyBracket();
    const next = pickBracketWinner(bracket, "r1", 0, "b99", favorites);
    expect(next).toEqual(bracket);
  });

  it("sanea ganadores inválidos tras borrar un contendiente", () => {
    const bracket: ReturnType<typeof emptyBracket> = {
      r1: ["b1", "b2", null, null, null, null],
      r2: ["b99", null, null],
      r3: ["b99", "b99"],
    };

    const clean = sanitizeBracket(bracket);

    expect(clean.r2[0]).toBeNull();
    expect(clean.r3[0]).toBeNull();
    expect(clean.r3[1]).toBeNull();
  });
});
