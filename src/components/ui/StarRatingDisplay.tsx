"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStarFillState } from "@/lib/ratings";

interface StarRatingDisplayProps {
  value: number;
  size?: "sm" | "md";
  className?: string;
}

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
};

export function StarRatingDisplay({
  value,
  size = "sm",
  className,
}: StarRatingDisplayProps) {
  if (value <= 0) return null;

  return (
    <span className={cn("inline-flex gap-0.5 text-amber-400", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const starIndex = i + 1;
        const fill = getStarFillState(value, starIndex);
        return (
          <span key={starIndex} className="relative inline-flex">
            <Star className={cn(SIZES[size], "text-bj-border")} />
            {fill !== "empty" && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: fill === "half" ? "50%" : "100%" }}
              >
                <Star className={cn(SIZES[size], "fill-amber-400 text-amber-400")} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
