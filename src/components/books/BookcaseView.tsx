"use client";

import { useState } from "react";
import { BookOpen, LayoutGrid, Library, Rows3 } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { getBookShelf } from "@/lib/bookStats";
import { ScrapbookListView } from "@/components/books/ScrapbookListView";
import { VisualBookshelf } from "@/components/books/VisualBookshelf";
import type { Book, BookShelf } from "@/types";
import { cn } from "@/lib/utils";

type EstanteriaView = "shelves" | "visual" | "scrapbook";

interface BookCoverProps {
  book: Book;
  onClick: () => void;
}

function BookCover({ book, onClick }: BookCoverProps) {
  return (
    <button
      onClick={onClick}
      title={`${book.title} — ${book.author}`}
      className="group relative h-32 shrink-0 overflow-hidden rounded-md border border-black/10 shadow-md transition-all hover:-translate-y-1.5 hover:shadow-xl"
      style={{ backgroundColor: book.spineColor, width: "5.5rem" }}
    >
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-between p-2">
          <BookOpen className="h-4 w-4 text-bj-navy/30" />
          <span className="line-clamp-3 text-center text-[8px] font-semibold leading-tight text-bj-navy/70">
            {book.title}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-bj-navy/90 to-transparent p-2 transition-transform group-hover:translate-y-0">
        <p className="truncate text-[9px] font-medium text-white">{book.title}</p>
      </div>
    </button>
  );
}

const SHELVES: { id: BookShelf; label: string; emoji: string }[] = [
  { id: "leyendo", label: "Leyendo ahora", emoji: "📖" },
  { id: "terminado", label: "Terminados", emoji: "✅" },
  { id: "deseos", label: "Lista de deseos", emoji: "⭐" },
  { id: "abandonado", label: "Abandonados", emoji: "📕" },
];

const VIEW_OPTIONS: { id: EstanteriaView; label: string; icon: React.ReactNode }[] = [
  { id: "shelves", label: "Baldas", icon: <Rows3 className="h-4 w-4" /> },
  { id: "visual", label: "Lomos", icon: <Library className="h-4 w-4" /> },
  { id: "scrapbook", label: "Scrapbook", icon: <LayoutGrid className="h-4 w-4" /> },
];

interface BookcaseViewProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export function BookcaseView({ books, onBookClick }: BookcaseViewProps) {
  const [view, setView] = useState<EstanteriaView>("shelves");

  const grouped = SHELVES.map((shelf) => ({
    ...shelf,
    books: books.filter((b) => getBookShelf(b) === shelf.id),
  }));

  const finishedBooks = books.filter((b) => getBookShelf(b) === "terminado");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <PanelHeader
          title="Mi estantería"
          subtitle="Baldas, lomos por género o fichas estilo cuaderno scrapbook"
        />
        <div className="flex rounded-xl border border-bj-border bg-bj-surface p-1">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setView(opt.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                view === opt.id
                  ? "bg-white text-bj-navy shadow-sm"
                  : "text-bj-muted hover:text-bj-navy"
              )}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-bj-border bg-bj-surface/30 py-20 text-center">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-bj-muted/30" />
          <p className="font-medium text-bj-navy">Tu estantería está vacía</p>
          <p className="mt-1 text-sm text-bj-muted">Añade tu primer libro desde «Nueva reseña»</p>
        </div>
      ) : view === "visual" ? (
        <div>
          <p className="mb-4 text-sm text-bj-muted">
            {finishedBooks.length}{" "}
            {finishedBooks.length === 1 ? "libro terminado" : "libros terminados"} — color del lomo según género
          </p>
          <VisualBookshelf books={finishedBooks} onBookClick={onBookClick} />
        </div>
      ) : view === "scrapbook" ? (
        <ScrapbookListView books={books} onBookClick={onBookClick} />
      ) : (
        <div className="space-y-10">
          {grouped.map((shelf) => (
            <div key={shelf.id}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xl">{shelf.emoji}</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-bj-navy">
                  {shelf.label}
                </h2>
                <span className="ml-auto rounded-full bg-bj-navy/10 px-3 py-0.5 text-xs font-semibold text-bj-navy">
                  {shelf.books.length}
                </span>
              </div>

              <div className="bj-shelf rounded-2xl p-5">
                {shelf.books.length === 0 ? (
                  <p className="py-8 text-center text-sm text-bj-muted/50">Balda vacía</p>
                ) : (
                  <div className="flex flex-wrap items-end gap-4 px-2 pb-3">
                    {shelf.books.map((book) => (
                      <BookCover key={book.id} book={book} onClick={() => onBookClick(book)} />
                    ))}
                  </div>
                )}
                <div className="bj-shelf-board" />
                <div className="bj-shelf-edge" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
