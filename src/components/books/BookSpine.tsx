"use client";

import { cn } from "@/lib/utils";
import type { Book } from "@/types";

interface BookSpineProps {
  book: Book;
  onClick: () => void;
  height?: number;
}

export function BookSpine({ book, onClick, height }: BookSpineProps) {
  const spineHeight = height ?? 80 + (book.title.length % 5) * 12;

  return (
    <button
      onClick={onClick}
      title={`${book.title} — ${book.author}`}
      className={cn(
        "group relative flex shrink-0 cursor-pointer flex-col items-center justify-end",
        "rounded-sm border border-black/20 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
      )}
      style={{
        backgroundColor: book.spineColor,
        width: "28px",
        height: `${spineHeight}px`,
      }}
    >
      <span
        className="mb-2 max-h-[70%] overflow-hidden px-0.5 text-[7px] font-semibold uppercase leading-tight text-[#2c4a6e]/80"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        {book.title}
      </span>
    </button>
  );
}
