"use client";

import { Calendar } from "lucide-react";

interface YearSelectorProps {
  years: number[];
  year: number;
  onChange: (year: number) => void;
  className?: string;
}

export function YearSelector({ years, year, onChange, className }: YearSelectorProps) {
  const options = years.includes(year) ? years : [year, ...years].sort((a, b) => b - a);

  return (
    <div className={className}>
      <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bj-muted">
        <Calendar className="h-3.5 w-3.5" />
        Año
      </label>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bj-input min-w-[108px]"
      >
        {options.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
