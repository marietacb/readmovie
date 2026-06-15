/** Valoración de libro: 0–5 en pasos de 0.5 */
export type BookRating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

const BOOK_RATING_STEPS: BookRating[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function clampBookRating(value: number): BookRating {
  const snapped = Math.round(value * 2) / 2;
  const clamped = Math.min(5, Math.max(0, snapped));
  return clamped as BookRating;
}

export function formatBookRating(value: number): string {
  if (value <= 0) return "—";
  const clamped = clampBookRating(value);
  return Number.isInteger(clamped) ? String(clamped) : clamped.toFixed(1);
}

/** Estado visual de cada estrella (1–5) para medias */
export function getStarFillState(
  value: number,
  starIndex: number
): "empty" | "half" | "full" {
  if (value >= starIndex) return "full";
  if (value >= starIndex - 0.5) return "half";
  return "empty";
}

export function cycleBookRating(current: number, starIndex: number, half: boolean): BookRating {
  const target = half ? starIndex - 0.5 : starIndex;
  const clamped = clampBookRating(target);
  if (current === clamped) return 0;
  return clamped;
}

export function isFiveStarRating(value: number): boolean {
  return clampBookRating(value) === 5;
}

export { BOOK_RATING_STEPS };
