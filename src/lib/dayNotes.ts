export type DayNotes = Record<string, string>;

export function normalizeDayNotes(raw: unknown): DayNotes {
  if (!raw || typeof raw !== "object") return {};

  const result: DayNotes = {};
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    result[date.slice(0, 10)] = trimmed;
  }
  return result;
}

export function setDayNoteInMap(
  notes: DayNotes,
  date: string,
  note: string | null | undefined,
): DayNotes {
  const key = date.slice(0, 10);
  const trimmed = note?.trim() ?? "";
  if (!trimmed) {
    const next = { ...notes };
    delete next[key];
    return next;
  }
  return { ...notes, [key]: trimmed };
}

export function getDayNote(notes: DayNotes, date: string): string | undefined {
  return notes[date.slice(0, 10)];
}
