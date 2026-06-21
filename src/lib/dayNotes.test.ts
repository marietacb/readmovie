import { describe, expect, it } from "vitest";
import { getDayNote, normalizeDayNotes, setDayNoteInMap } from "@/lib/dayNotes";

describe("dayNotes", () => {
  it("normalizes and trims notes", () => {
    expect(
      normalizeDayNotes({
        "2025-03-01": "  Leí en el tren ",
        "bad": 1,
        "2025-03-02": "",
      }),
    ).toEqual({ "2025-03-01": "Leí en el tren" });
  });

  it("sets and removes notes by date", () => {
    const withNote = setDayNoteInMap({}, "2025-06-15", "Día tranquilo");
    expect(getDayNote(withNote, "2025-06-15")).toBe("Día tranquilo");
    const cleared = setDayNoteInMap(withNote, "2025-06-15", "");
    expect(getDayNote(cleared, "2025-06-15")).toBeUndefined();
  });
});
