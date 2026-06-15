"use client";

import { useMemo, useState } from "react";
import { Check, ListChecks, Plus, Trash2 } from "lucide-react";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { isWishlistItemRead, splitWishlistColumns } from "@/lib/wishlist";
import type { Book, WishlistItem } from "@/types";
import { cn } from "@/lib/utils";

interface WishlistViewProps {
  items: WishlistItem[];
  books: Book[];
  year: number;
  onAdd: (title: string, seriesLabel?: string) => void;
  onToggleRead: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onOpenBook?: (bookId: string) => void;
}

function WishlistColumn({
  items,
  books,
  onToggleRead,
  onDelete,
  onOpenBook,
}: {
  items: WishlistItem[];
  books: Book[];
  onToggleRead: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onOpenBook?: (bookId: string) => void;
}) {
  const bookMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const linkedBook = item.bookId ? bookMap.get(item.bookId) : undefined;
        const read = isWishlistItemRead(item, linkedBook);

        return (
          <li
            key={item.id}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-bj-border hover:bg-bj-surface/40",
              read && "opacity-70"
            )}
          >
            <button
              type="button"
              onClick={() => onToggleRead(item)}
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                read
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-bj-navy/30 bg-white hover:border-bj-navy"
              )}
              aria-label={read ? "Marcar como pendiente" : "Marcar como leído"}
            >
              {read && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  if (linkedBook && onOpenBook) onOpenBook(linkedBook.id);
                  else if (!read) onToggleRead(item);
                }}
                className={cn(
                  "block w-full text-left font-medium uppercase tracking-wide text-bj-navy",
                  read && "line-through decoration-bj-muted/50"
                )}
              >
                {item.title}
              </button>
              {item.seriesLabel && (
                <p className="mt-0.5 text-xs text-bj-muted">{item.seriesLabel}</p>
              )}
              {linkedBook?.endDate && (
                <p className="mt-0.5 text-[10px] text-emerald-700">Reseña completada</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="shrink-0 rounded p-1 text-bj-muted opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
              aria-label="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function WishlistView({
  items,
  books,
  year,
  onAdd,
  onToggleRead,
  onDelete,
  onOpenBook,
}: WishlistViewProps) {
  const [title, setTitle] = useState("");
  const [seriesLabel, setSeriesLabel] = useState("");

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.title.localeCompare(b.title, "es")),
    [items]
  );
  const [left, right] = splitWishlistColumns(sorted);
  const readCount = sorted.filter((item) =>
    isWishlistItemRead(item, item.bookId ? books.find((b) => b.id === item.bookId) : undefined)
  ).length;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), seriesLabel.trim() || undefined);
    setTitle("");
    setSeriesLabel("");
  };

  return (
    <div>
      <PanelHeader
        title="Wishlist"
        subtitle={`Tu lista de lectura pendiente de ${year} — como en tu cuaderno digital`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-bj-border bg-bj-surface/30 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bj-navy px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          <ListChecks className="h-3.5 w-3.5" />
          Wishlist
        </span>
        <span className="text-sm text-bj-muted">
          {readCount} leídos · {sorted.length - readCount} pendientes
        </span>
      </div>

      <div className="mb-8 rounded-xl border border-bj-border bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bj-muted">
          Añadir título
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del libro"
            className="bj-input"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <input
            value={seriesLabel}
            onChange={(e) => setSeriesLabel(e.target.value)}
            placeholder="Serie / saga (ej. Crave 1)"
            className="bj-input"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button type="button" onClick={handleAdd} disabled={!title.trim()} className="bj-btn-primary flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-bj-border py-16 text-center">
          <ListChecks className="mx-auto mb-3 h-10 w-10 text-bj-muted/40" />
          <p className="text-sm text-bj-muted">No hay entradas en la wishlist de {year}</p>
          <p className="mt-1 text-xs text-bj-muted">Añade libros que quieras leer este año</p>
        </div>
      ) : (
        <div className="relative rounded-2xl border border-bj-border bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:18px_18px] p-5 md:p-8">
          <div className="absolute inset-y-5 left-1/2 hidden w-px bg-bj-border md:block" />
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <WishlistColumn
              items={left}
              books={books}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onOpenBook={onOpenBook}
            />
            <WishlistColumn
              items={right}
              books={books}
              onToggleRead={onToggleRead}
              onDelete={onDelete}
              onOpenBook={onOpenBook}
            />
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-bj-muted">
        Marca un libro como leído para abrir la reseña y registrarlo en Terminados
      </p>
    </div>
  );
}
