import { describe, expect, it } from "vitest";
import {
  countMovieWatchLogs,
  getLatestWatchDate,
  normalizeMovieWatchLogs,
} from "@/lib/movieWatchLogs";

describe("movieWatchLogs", () => {
  it("normaliza y ordena por fecha descendente", () => {
    const logs = normalizeMovieWatchLogs([
      { id: "a", date: "2026-01-10", note: " cine " },
      { id: "b", date: "2026-01-15" },
      { id: "bad", date: "" },
    ]);

    expect(logs).toHaveLength(2);
    expect(logs[0].id).toBe("b");
    expect(logs[1].note).toBe("cine");
  });

  it("cuenta visionados y devuelve la fecha más reciente", () => {
    const logs = normalizeMovieWatchLogs([
      { id: "1", date: "2026-01-01" },
      { id: "2", date: "2026-06-01" },
    ]);

    expect(countMovieWatchLogs(logs)).toBe(2);
    expect(getLatestWatchDate(logs)).toBe("2026-06-01");
  });
});
