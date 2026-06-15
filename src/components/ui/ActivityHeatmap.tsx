import { getActivityDays } from "@/lib/bookStats";
import type { Book } from "@/types";

interface ActivityHeatmapProps {
  books: Book[];
  weeks?: number;
}

export function ActivityHeatmap({ books, weeks = 16 }: ActivityHeatmapProps) {
  const activity = getActivityDays(books);
  const today = new Date();

  const cols = weeks;
  const rows = 7;
  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let w = 0; w < cols; w++) {
    for (let d = 0; d < rows; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (cols - 1 - w) * 7 - (6 - d));
      const key = date.toISOString().split("T")[0];
      matrix[d][w] = activity[key] || 0;
    }
  }

  const max = Math.max(...matrix.flat(), 1);

  const intensity = (count: number) => {
    if (count === 0) return "bg-bj-surface";
    const level = count / max;
    if (level > 0.66) return "bg-bj-navy";
    if (level > 0.33) return "bg-bj-navy/50";
    return "bg-bj-navy/25";
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-fit">
        {Array.from({ length: cols }, (_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: rows }, (_, d) => (
              <div
                key={d}
                className={`h-3 w-3 rounded-sm ${intensity(matrix[d][w])}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-bj-muted">
        <span>Menos</span>
        <div className="flex gap-1">
          {["bg-bj-surface", "bg-bj-navy/25", "bg-bj-navy/50", "bg-bj-navy"].map((c) => (
            <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
        </div>
        <span>Más</span>
      </div>
    </div>
  );
}
