import { describe, expect, it } from "vitest";
import {
  countUniqueEpisodes,
  formatEpisodeLabel,
  getLogsForDate,
  normalizeEpisodeWatchLogs,
} from "@/lib/episodeWatchLogs";

describe("episodeWatchLogs", () => {
  it("normaliza y ordena registros por fecha descendente", () => {
    const logs = normalizeEpisodeWatchLogs([
      { id: "a", date: "2026-01-10", season: 1, episode: 2 },
      { id: "b", date: "2026-01-15", season: 1, episode: 1, note: "  con amigos  " },
      { id: "bad", date: "", season: 0, episode: 1 },
    ]);

    expect(logs).toHaveLength(2);
    expect(logs[0].id).toBe("b");
    expect(logs[0].note).toBe("con amigos");
    expect(logs[1].id).toBe("a");
  });

  it("cuenta episodios únicos aunque se repitan en fechas distintas", () => {
    const logs = normalizeEpisodeWatchLogs([
      { id: "1", date: "2026-01-01", season: 1, episode: 1 },
      { id: "2", date: "2026-01-05", season: 1, episode: 1 },
      { id: "3", date: "2026-01-06", season: 1, episode: 2 },
    ]);

    expect(countUniqueEpisodes(logs)).toBe(2);
    expect(getLogsForDate(logs, "2026-01-05")).toHaveLength(1);
    expect(formatEpisodeLabel(2, 5)).toBe("T2 E5");
  });
});
