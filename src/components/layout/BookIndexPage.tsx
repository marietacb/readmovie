"use client";

import { cn } from "@/lib/utils";

interface IndexItem {
  label: string;
  pageIndex: number;
  description?: string;
}

interface BookIndexPageProps {
  title?: string;
  items: IndexItem[];
  onNavigate: (pageIndex: number) => void;
  variant: "books" | "movies";
}

export function BookIndexPage({
  title = "Índice",
  items,
  onNavigate,
  variant,
}: BookIndexPageProps) {
  const isBooks = variant === "books";

  return (
    <div className="mx-auto max-w-lg py-8">
      <h1
        className={cn(
          "mb-10 text-center font-serif text-5xl font-bold",
          isBooks ? "text-[#2c4a6e]" : "text-[#4a3f35]"
        )}
      >
        {title}
      </h1>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const lightness = isBooks
            ? 85 - i * 12
            : 88 - i * 10;
          const hue = isBooks ? "210" : "30";

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.pageIndex)}
              className="group rounded-lg border border-black/10 px-6 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background: isBooks
                  ? `linear-gradient(90deg, hsl(${hue}, 45%, ${lightness}%), hsl(${hue}, 50%, ${lightness - 15}%))`
                  : `linear-gradient(90deg, hsl(${hue}, 20%, ${lightness}%), hsl(${hue}, 25%, ${lightness - 12}%))`,
              }}
            >
              <span
                className={cn(
                  "font-semibold",
                  isBooks ? "text-[#2c4a6e]" : "text-[#4a3f35]"
                )}
              >
                {item.label}
              </span>
              {item.description && (
                <p className="mt-0.5 text-xs opacity-60">{item.description}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
