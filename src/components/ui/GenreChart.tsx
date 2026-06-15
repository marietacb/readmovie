interface GenreChartProps {
  data: { genre: string; count: number }[];
  maxItems?: number;
}

export function GenreChart({ data, maxItems = 6 }: GenreChartProps) {
  const items = data.slice(0, maxItems);
  const max = Math.max(...items.map((d) => d.count), 1);

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-bj-muted">Sin datos de géneros aún</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.genre}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-bj-navy">{item.genre}</span>
            <span className="text-bj-muted">{item.count}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-bj-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-bj-terracotta to-bj-navy transition-all duration-500"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
