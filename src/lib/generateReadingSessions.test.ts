import { describe, expect, it } from "vitest";
import { generateReadingSessionsFromBook, listDatesInclusive } from "@/lib/generateReadingSessions";

describe("generateReadingSessions", () => {
  it("lista todos los días entre inicio y fin", () => {
    expect(listDatesInclusive("2025-01-20", "2025-01-22")).toEqual([
      "2025-01-20",
      "2025-01-21",
      "2025-01-22",
    ]);
  });

  it("reparte páginas entre los días de lectura", () => {
    const sessions = generateReadingSessionsFromBook({
      startDate: "2025-01-20",
      endDate: "2025-01-22",
      pages: 30,
    });

    expect(sessions).toHaveLength(3);
    expect(sessions.reduce((s, x) => s + (x.toPage - x.fromPage + 1), 0)).toBe(30);
    expect(sessions[0].date).toBe("2025-01-20");
  });

  it("usa sesiones explícitas si vienen en el JSON", () => {
    const sessions = generateReadingSessionsFromBook({
      pages: 100,
      readingSessions: [{ date: "2025-03-01", fromPage: 1, toPage: 50 }],
    });

    expect(sessions).toHaveLength(1);
    expect(sessions[0].toPage).toBe(50);
  });

  it("genera sesiones desde páginas acumuladas diarias", () => {
    const sessions = generateReadingSessionsFromBook({
      cumulativeDailyPages: {
        startDate: "2026-03-03",
        toPages: [11, 13, 17],
      },
    });

    expect(sessions).toHaveLength(3);
    expect(sessions[0]).toMatchObject({ date: "2026-03-03", fromPage: 1, toPage: 11 });
    expect(sessions[1]).toMatchObject({ date: "2026-03-04", fromPage: 11, toPage: 13 });
    expect(sessions[2]).toMatchObject({ date: "2026-03-05", fromPage: 13, toPage: 17 });
  });
});
