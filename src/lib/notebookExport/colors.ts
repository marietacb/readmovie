import type { Book } from "@/types";

const MIN_STROKE = 1;
const MAX_STROKE = 8;

/** Grosor lineal: 0★ mínimo, 5★ máximo (respuesta 6A + 7C). */
export function ratingToStrokeWidth(rating: number): number {
  const clamped = Math.max(0, Math.min(5, rating));
  if (clamped === 0) return MIN_STROKE;
  return MIN_STROKE + (clamped / 5) * (MAX_STROKE - MIN_STROKE);
}

function averageRgb(data: Uint8ClampedArray): string | null {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue;
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];
    const max = Math.max(pr, pg, pb);
    const min = Math.min(pr, pg, pb);
    if (max - min < 18) continue;
    r += pr;
    g += pg;
    b += pb;
    count += 1;
  }

  if (count === 0) return null;
  const toHex = (n: number) => Math.round(n / count).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Extrae color dominante de portada; null si falla (CORS, sin imagen…). */
export async function extractDominantColor(coverUrl: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const pixels = ctx.getImageData(0, 0, size, size).data;
        resolve(averageRgb(pixels));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = coverUrl;
  });
}

export async function resolveBookColor(book: Book): Promise<string> {
  if (book.coverUrl) {
    const extracted = await extractDominantColor(book.coverUrl);
    if (extracted) return extracted;
  }
  return book.spineColor || "#B8D4E8";
}

export interface BookLineStyle {
  bookId: string;
  color: string;
  strokeWidth: number;
  rating: number;
}

export async function buildBookLineStyles(books: Book[]): Promise<BookLineStyle[]> {
  const styles: BookLineStyle[] = [];
  for (const book of books) {
    const color = await resolveBookColor(book);
    styles.push({
      bookId: book.id,
      color,
      strokeWidth: ratingToStrokeWidth(book.rating),
      rating: book.rating,
    });
  }
  return styles;
}
