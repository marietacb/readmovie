import { describe, expect, it } from "vitest";
import { emptyBracket } from "@/lib/bookOfYear";
import {
  getBracketForYear,
  normalizeYearlyBookOfYearBrackets,
  removeBookFromYearlyBrackets,
  setBracketForYear,
} from "@/lib/yearlyBrackets";

describe("yearlyBrackets", () => {
  it("normaliza brackets guardados por año", () => {
    const yearly = normalizeYearlyBookOfYearBrackets({
      "2025": {
        r1: ["a", null, null, null, null, null],
        r2: [null, null, null],
        r3: [null, null],
      },
    });

    expect(yearly[2025].r1[0]).toBe("a");
    expect(yearly[2025].r1[1]).toBeNull();
  });

  it("devuelve bracket vacío para años sin datos", () => {
    expect(getBracketForYear({}, 2025)).toEqual(emptyBracket());
  });

  it("guarda y recupera el bracket de un año", () => {
    const bracket = emptyBracket();
    bracket.r1[0] = "winner";
    const yearly = setBracketForYear({}, 2026, bracket);

    expect(getBracketForYear(yearly, 2026).r1[0]).toBe("winner");
  });

  it("elimina un libro y sanea ganadores inválidos", () => {
    const yearly = setBracketForYear({}, 2025, {
      r1: ["gone", "stay", null, null, null, null],
      r2: ["gone", null, null],
      r3: ["gone", "gone"],
    });

    const cleaned = removeBookFromYearlyBrackets(yearly, "gone");

    expect(cleaned[2025].r1[0]).toBeNull();
    expect(cleaned[2025].r1[1]).toBe("stay");
    expect(cleaned[2025].r2[0]).toBeNull();
    expect(cleaned[2025].r3[0]).toBeNull();
    expect(cleaned[2025].r3[1]).toBeNull();
  });
});
