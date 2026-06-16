import type { BookLineStyle } from "@/lib/notebookExport/colors";

export interface CoverLinePath {
  d: string;
  color: string;
  strokeWidth: number;
}

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Trazos orgánicos alrededor del centro, uno por libro. */
export function generateCoverLinePaths(
  lineStyles: BookLineStyle[],
  width: number,
  height: number,
): CoverLinePath[] {
  const cx = width / 2;
  const cy = height / 2;
  const paths: CoverLinePath[] = [];

  lineStyles.forEach((style, index) => {
    const rand = seeded(index * 9973 + 42);
    const angle = rand() * Math.PI * 2;
    const radius = 80 + rand() * 120;
    const startX = cx + Math.cos(angle) * radius * 0.3;
    const startY = cy + Math.sin(angle) * radius * 0.3;
    const cp1x = startX + (rand() - 0.5) * 180;
    const cp1y = startY + (rand() - 0.5) * 180;
    const cp2x = cx + (rand() - 0.5) * 160;
    const cp2y = cy + (rand() - 0.5) * 160;
    const endX = cx + (rand() - 0.5) * 100;
    const endY = cy + (rand() - 0.5) * 100;

    paths.push({
      d: `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`,
      color: style.color,
      strokeWidth: style.strokeWidth,
    });
  });

  return paths;
}

/** Líneas verticales para collage (página 4). */
export function generateVerticalBarLines(
  lineStyles: BookLineStyle[],
  width: number,
  height: number,
): CoverLinePath[] {
  const count = Math.max(lineStyles.length, 1);
  const gap = width / (count + 1);

  return lineStyles.map((style, index) => {
    const x = gap * (index + 1);
    const w = style.strokeWidth * 1.8;
    return {
      d: `M ${(x - w / 2).toFixed(1)} 0 L ${(x - w / 2).toFixed(1)} ${height} L ${(x + w / 2).toFixed(1)} ${height} L ${(x + w / 2).toFixed(1)} 0 Z`,
      color: style.color,
      strokeWidth: 0,
    };
  });
}
