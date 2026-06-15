"use client";

import { Star, Heart, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { clampBookRating, cycleBookRating, getStarFillState } from "@/lib/ratings";

type RatingType = "star" | "heart" | "flame";

interface RatingIconsProps {
  type: RatingType;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  /** Permite medias estrellas (0.5) — recomendado para libros */
  allowHalf?: boolean;
}

const ICONS = {
  star: Star,
  heart: Heart,
  flame: Flame,
};

const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

const FILLED = {
  star: "fill-amber-400 text-amber-400",
  heart: "fill-rose-400 text-rose-400",
  flame: "fill-orange-400 text-orange-400",
};

export function RatingIcons({
  type,
  value,
  onChange,
  max = 5,
  size = "md",
  label,
  allowHalf = false,
}: RatingIconsProps) {
  const Icon = ICONS[type];
  const normalized = allowHalf ? clampBookRating(value) : Math.round(value);

  const handleClick = (n: number, half: boolean) => {
    if (allowHalf) {
      onChange(cycleBookRating(normalized, n, half));
      return;
    }
    onChange(normalized === n ? 0 : n);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      )}
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
            if (allowHalf) {
              const fill = getStarFillState(normalized, n);
              return (
                <div
                  key={n}
                  className={cn("relative flex", SIZES[size])}
                  role="group"
                  aria-label={`${n} de ${max}`}
                >
                  <Icon
                    className={cn(SIZES[size], "pointer-events-none fill-none text-current opacity-40")}
                    strokeWidth={type === "star" && size === "lg" ? 1.5 : 2}
                  />
                  {fill !== "empty" && (
                    <span
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                      style={{ width: fill === "half" ? "50%" : "100%" }}
                    >
                      <Icon
                        className={cn(SIZES[size], FILLED[type])}
                        strokeWidth={type === "star" && size === "lg" ? 1.5 : 2}
                      />
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 w-1/2 transition-transform hover:scale-110"
                    onClick={() => handleClick(n, true)}
                    aria-label={`${n - 0.5} de ${max}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 w-1/2 transition-transform hover:scale-110"
                    onClick={() => handleClick(n, false)}
                    aria-label={`${n} de ${max}`}
                  />
                </div>
              );
            }

            return (
              <button
                key={n}
                type="button"
                onClick={() => handleClick(n, false)}
                className="transition-transform hover:scale-110"
                aria-label={`${n} de ${max}`}
              >
                <Icon
                  className={cn(
                    SIZES[size],
                    "transition-colors",
                    n <= normalized ? FILLED[type] : "fill-none text-current opacity-40"
                  )}
                  strokeWidth={type === "star" && size === "lg" ? 1.5 : 2}
                />
              </button>
            );
          })}
        </div>
        {allowHalf && normalized > 0 && (
          <span className="text-xs font-medium text-bj-muted">
            {Number.isInteger(normalized) ? normalized : normalized.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
