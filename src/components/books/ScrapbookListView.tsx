"use client";

import type { Book } from "@/types";
import { ScrapbookEntry } from "./ScrapbookEntry";

interface ScrapbookListViewProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export function ScrapbookListView({ books, onBookClick }: ScrapbookListViewProps) {
  const sorted = [...books].sort((a, b) => {
    const dateA = a.endDate ?? a.startDate ?? a.updatedAt;
    const dateB = b.endDate ?? b.startDate ?? b.updatedAt;
    return dateB.localeCompare(dateA);
  });

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-bj-border py-16 text-center">
        <p className="text-sm text-bj-muted">Aún no hay lecturas para mostrar en scrapbook</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {sorted.map((book, index) => (
        <ScrapbookEntry
          key={book.id}
          book={book}
          index={index}
          onClick={() => onBookClick(book)}
        />
      ))}
    </div>
  );
}
