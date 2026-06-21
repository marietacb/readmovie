"use client";

import { useState } from "react";
import { Trash2, Save, BookMarked, FileText, ScrollText } from "lucide-react";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { BOOK_FORMATS, STORY_TYPES } from "@/lib/constants";
import { clampBookRating } from "@/lib/ratings";
import { RatingIcons } from "@/components/ui/RatingIcons";
import { GenreTagsInput } from "@/components/ui/GenreTagsInput";
import { TagCheckbox } from "@/components/ui/TagCheckbox";
import { normalizeGenres } from "@/lib/genres";
import { ChapterMarkersEditor } from "@/components/books/ChapterMarkersEditor";
import { BookReadingJournal } from "@/components/books/BookReadingJournal";
import { BookSummaryView } from "@/components/books/BookSummaryView";
import type { Book, BookFormat, ChapterMarker, StoryType } from "@/types";
import { cn } from "@/lib/utils";

interface BookReviewFormProps {
  bookId?: string;
  wishlistId?: string;
  prefill?: { title?: string; seriesLabel?: string };
  onSaved: (book: Book) => void;
  onDeleted?: () => void;
  onLinkWishlist?: (wishlistId: string, bookId: string) => void;
  initialTab?: FormTab;
}

type FormTab = "datos" | "registro" | "resumen";

const EMPTY_FORM = {
  title: "",
  author: "",
  pages: "",
  totalChapters: "",
  format: [] as BookFormat[],
  startDate: "",
  endDate: "",
  publisher: "",
  genres: [] as string[],
  originalNationality: "",
  publishYear: "",
  storyType: [] as StoryType[],
  seriesLabel: "",
  characters: "",
  opinion: "",
  rating: 0,
  romanceRating: 0,
  hypeRating: 0,
  coverUrl: "",
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function bookToForm(b: Book) {
  return {
    title: b.title,
    author: b.author,
    pages: b.pages?.toString() ?? "",
    totalChapters: b.totalChapters?.toString() ?? "",
    format: b.format,
    startDate: b.startDate ?? "",
    endDate: b.endDate ?? "",
    publisher: b.publisher ?? "",
    genres: b.genres,
    originalNationality: b.originalNationality ?? "",
    publishYear: b.publishYear?.toString() ?? "",
    storyType: b.storyType,
    seriesLabel: b.seriesLabel ?? "",
    characters: b.characters ?? "",
    opinion: b.opinion ?? "",
    rating: b.rating,
    romanceRating: b.romanceRating,
    hypeRating: b.hypeRating,
    coverUrl: b.coverUrl ?? "",
  };
}

function buildInitialForm(book?: Book, prefill?: { title?: string; seriesLabel?: string }) {
  if (book) return bookToForm(book);
  if (prefill) {
    return {
      ...EMPTY_FORM,
      title: prefill.title ?? "",
      seriesLabel: prefill.seriesLabel ?? "",
      endDate: new Date().toISOString().slice(0, 10),
    };
  }
  return EMPTY_FORM;
}

export function BookReviewForm({
  bookId,
  wishlistId,
  prefill,
  onSaved,
  onDeleted,
  onLinkWishlist,
  initialTab = "datos",
}: BookReviewFormProps) {
  const { getBook, addBook, updateBook, deleteBook } = useMediaTracker();
  const book = bookId ? getBook(bookId) : undefined;
  const [form, setForm] = useState(() => buildInitialForm(book, prefill));
  const [chapters, setChapters] = useState<ChapterMarker[]>(() => book?.chapters ?? []);
  const [activeTab, setActiveTab] = useState<FormTab>(initialTab);

  const showResumen =
    book &&
    (book.endDate ||
      book.readingSessions.length > 0 ||
      book.quotes.length > 0);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFormat = (fmt: BookFormat) => {
    set("format", form.format.includes(fmt) ? form.format.filter((f) => f !== fmt) : [...form.format, fmt]);
  };

  const toggleStoryType = (type: StoryType) => {
    set("storyType", form.storyType.includes(type) ? form.storyType.filter((t) => t !== type) : [...form.storyType, type]);
  };

  const buildData = () => ({
    title: form.title.trim(),
    author: form.author.trim(),
    pages: form.pages ? parseInt(form.pages) : undefined,
    totalChapters: form.totalChapters ? parseInt(form.totalChapters) : undefined,
    format: form.format,
    startDate: form.startDate || undefined,
    endDate: form.endDate || undefined,
    publisher: form.publisher || undefined,
    genres: normalizeGenres(form.genres),
    originalNationality: form.originalNationality.trim() || undefined,
    publishYear: form.publishYear ? parseInt(form.publishYear) : undefined,
    storyType: form.storyType,
    seriesLabel: form.seriesLabel.trim() || undefined,
    characters: form.characters || undefined,
    opinion: form.opinion || undefined,
    rating: clampBookRating(form.rating),
    romanceRating: clampBookRating(form.romanceRating),
    hypeRating: clampBookRating(form.hypeRating),
    coverUrl: form.coverUrl || undefined,
    chapters,
    readingSessions: book?.readingSessions ?? [],
    quotes: book?.quotes ?? [],
  });

  const handleSave = () => {
    if (!form.title.trim() || !form.author.trim()) return;
    const data = buildData();

    if (bookId) {
      updateBook(bookId, data);
      const updated = getBook(bookId);
      if (updated) {
        if (wishlistId && onLinkWishlist) onLinkWishlist(wishlistId, updated.id);
        onSaved(updated);
      }
    } else {
      const created = addBook(data);
      if (wishlistId && onLinkWishlist) onLinkWishlist(wishlistId, created.id);
      onSaved(created);
    }
  };

  const handleDelete = () => {
    if (bookId && confirm("¿Eliminar esta lectura?")) {
      deleteBook(bookId);
      onDeleted?.();
    }
  };

  const TABS: { id: FormTab; label: string; icon: React.ReactNode; needsId?: boolean }[] = [
    { id: "datos", label: "Datos", icon: <FileText className="h-4 w-4" /> },
    { id: "registro", label: "Registro diario", icon: <BookMarked className="h-4 w-4" />, needsId: true },
    { id: "resumen", label: "Resumen", icon: <ScrollText className="h-4 w-4" />, needsId: true },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-bj-navy">
          {bookId ? "Editar lectura" : "Nueva lectura"}
        </h1>
        <p className="mt-1 text-sm text-bj-muted">
          Datos del libro, registro diario de páginas y resumen final
        </p>
      </div>

      {/* Tabs internas */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-bj-surface p-1">
        {TABS.filter((t) => !t.needsId || bookId).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.needsId && !bookId}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-bj-navy shadow-sm"
                : "text-bj-muted hover:text-bj-navy",
              tab.needsId && !bookId && "opacity-40"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "datos" && (
        <>
          <div className="grid gap-8 md:grid-cols-[160px_1fr]">
            <div className="flex flex-col gap-2">
              <div className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-xl border border-bj-border bg-bj-surface shadow-sm">
                {form.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.coverUrl} alt="Portada" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-bj-muted">Portada</span>
                )}
              </div>
              <input
                value={form.coverUrl}
                onChange={(e) => set("coverUrl", e.target.value)}
                placeholder="URL de portada"
                className="bj-input text-xs"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Título">
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className="bj-input" />
              </FormField>
              <FormField label="Autor/a">
                <input value={form.author} onChange={(e) => set("author", e.target.value)} className="bj-input" />
              </FormField>
              <FormField label="Páginas totales">
                <input value={form.pages} onChange={(e) => set("pages", e.target.value)} type="number" className="bj-input" />
              </FormField>
              <FormField label="Capítulos totales">
                <input
                  value={form.totalChapters}
                  onChange={(e) => set("totalChapters", e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Ej. 35"
                  className="bj-input"
                />
              </FormField>
              <FormField label="Géneros">
                <GenreTagsInput
                  value={form.genres}
                  onChange={(genres) => set("genres", genres)}
                />
              </FormField>
              <FormField label="Nacionalidad original">
                <input
                  value={form.originalNationality}
                  onChange={(e) => set("originalNationality", e.target.value)}
                  placeholder="Ej. España, Japón, Reino Unido"
                  className="bj-input"
                />
              </FormField>
              <FormField label="Serie / saga">
                <input
                  value={form.seriesLabel}
                  onChange={(e) => set("seriesLabel", e.target.value)}
                  placeholder='Ej. "Crave 1", "Los chicos de Tommen 2"'
                  className="bj-input"
                />
              </FormField>
              <FormField label="Editorial">
                <input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} className="bj-input" />
              </FormField>
              <FormField label="Año de publicación">
                <input value={form.publishYear} onChange={(e) => set("publishYear", e.target.value)} className="bj-input" />
              </FormField>
              <FormField label="Fecha inicio">
                <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="bj-input" />
              </FormField>
              <FormField label="Fecha final">
                <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="bj-input" />
              </FormField>
            </div>
          </div>

          <div className="mt-6">
            <ChapterMarkersEditor chapters={chapters} onChange={setChapters} />
          </div>

          <div className="mt-6">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-bj-muted">Formato</span>
            <div className="flex flex-wrap gap-3">
              {BOOK_FORMATS.map((fmt) => (
                <TagCheckbox key={fmt.value} label={fmt.label} checked={form.format.includes(fmt.value)} onChange={() => toggleFormat(fmt.value)} color="#1e3a5f" />
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-bj-border bg-bj-surface/30 p-5">
              <RatingIcons type="star" value={form.rating} onChange={(v) => set("rating", v)} label="Clasificación" allowHalf />
              <RatingIcons type="heart" value={form.romanceRating} onChange={(v) => set("romanceRating", v)} label="Romance" allowHalf />
              <RatingIcons type="flame" value={form.hypeRating} onChange={(v) => set("hypeRating", v)} label="Emoción / Picante" allowHalf />
            </div>
            <div className="rounded-xl border border-bj-border bg-bj-surface/30 p-5">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-bj-muted">Tipo de historia</span>
              <div className="flex flex-col gap-2">
                {STORY_TYPES.map((type) => (
                  <TagCheckbox key={type.value} label={type.label} checked={form.storyType.includes(type.value)} onChange={() => toggleStoryType(type.value)} color="#1e3a5f" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <FormField label="Personajes">
              <input value={form.characters} onChange={(e) => set("characters", e.target.value)} className="bj-input" />
            </FormField>
          </div>

          <div className="mt-6">
            <FormField label="Opinión final">
              <textarea value={form.opinion} onChange={(e) => set("opinion", e.target.value)} rows={4} placeholder="Tu opinión al terminar el libro..." className="bj-input resize-none" />
            </FormField>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-bj-border pt-6">
            {bookId && (
              <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            )}
            <button onClick={handleSave} disabled={!form.title.trim() || !form.author.trim()} className="bj-btn-primary flex items-center gap-2 disabled:opacity-40">
              <Save className="h-4 w-4" />
              Guardar
            </button>
          </div>

          {!bookId && (
            <p className="mt-4 text-center text-xs text-bj-muted">
              Guarda el libro para poder registrar páginas diarias y frases favoritas
            </p>
          )}
        </>
      )}

      {activeTab === "registro" && book && <BookReadingJournal book={book} />}

      {activeTab === "resumen" && book && showResumen && <BookSummaryView book={book} />}

      {activeTab === "resumen" && book && !showResumen && (
        <div className="rounded-2xl border-2 border-dashed border-bj-border py-16 text-center">
          <p className="text-sm text-bj-muted">
            Aún no hay datos para el resumen. Registra lecturas diarias o marca el libro como terminado.
          </p>
        </div>
      )}
    </div>
  );
}
