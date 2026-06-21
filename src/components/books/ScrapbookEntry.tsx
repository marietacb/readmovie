"use client";

import { BookOpen } from "lucide-react";
import { BOOK_FORMATS } from "@/lib/constants";
import { formatGenres } from "@/lib/genres";
import { StarRatingDisplay } from "@/components/ui/StarRatingDisplay";
import { formatDate } from "@/lib/utils";
import type { Book } from "@/types";
import { cn } from "@/lib/utils";

interface ScrapbookEntryProps {
  book: Book;
  index: number;
  onClick: () => void;
}

function formatLabel(value: string) {
  const found = BOOK_FORMATS.find((f) => f.value === value);
  return found?.label ?? value;
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm leading-relaxed">
      <span className="font-semibold uppercase tracking-wide text-bj-terracotta">{label}:</span>{" "}
      <span className="font-serif text-bj-navy">{value}</span>
    </p>
  );
}

export function ScrapbookEntry({ book, index, onClick }: ScrapbookEntryProps) {
  const imageRight = index % 2 === 1;
  const dateRange = [
    book.startDate ? formatDate(book.startDate) : null,
    book.endDate ? formatDate(book.endDate) : "en curso",
  ]
    .filter(Boolean)
    .join(" – ");

  const formatStr = book.format.length
    ? book.format.map(formatLabel).join(", ")
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "bj-panel group w-full overflow-hidden p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md md:p-6",
        "bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]",
        "bg-[size:20px_20px] bg-white"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6 md:flex-row md:items-start",
          imageRight && "md:flex-row-reverse"
        )}
      >
        <div className="mx-auto shrink-0 md:mx-0">
          <div className="overflow-hidden rounded-lg border-2 border-bj-navy/10 bg-bj-surface shadow-sm">
            <div
              className="flex h-44 w-32 items-center justify-center overflow-hidden sm:h-52 sm:w-36"
              style={{ backgroundColor: book.spineColor }}
            >
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-10 w-10 text-bj-navy/25" />
              )}
            </div>
            {book.rating > 0 && (
              <div className="border-t border-bj-border bg-white/90 px-3 py-2">
                <StarRatingDisplay value={book.rating} size="md" />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2 font-serif">
          <FieldRow label="Book" value={book.title} />
          <FieldRow label="Author" value={book.author} />
          <FieldRow label="Format" value={formatStr} />
          <FieldRow label="Genre" value={formatGenres(book.genres) || undefined} />
          <FieldRow label="Nationality" value={book.originalNationality} />
          {book.seriesLabel && <FieldRow label="Series" value={book.seriesLabel} />}
          <FieldRow label="Pages" value={book.pages?.toString()} />
          {dateRange && <FieldRow label="Dates" value={dateRange} />}
          {book.opinion && (
            <p className="mt-3 line-clamp-3 text-sm italic text-bj-muted/90">
              &ldquo;{book.opinion}&rdquo;
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
