"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  PenLine,
  Star,
  Search,
  BarChart3,
  Quote,
  CalendarDays,
  ListChecks,
  Grid3x3,
  Table2,
  Trophy,
  Upload,
  FileDown,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BookcaseView } from "@/components/books/BookcaseView";
import { BookOfYearView } from "@/components/books/BookOfYearView";
import { DashboardView } from "@/components/books/DashboardView";
import { StatsView } from "@/components/books/StatsView";
import { JournalView } from "@/components/books/JournalView";
import { MonthlyRecapView } from "@/components/books/MonthlyRecapView";
import { LibraryView } from "@/components/books/LibraryView";
import { BookReviewForm } from "@/components/books/BookReviewForm";
import { MonthlyFavoritesView } from "@/components/books/MonthlyFavoritesView";
import { WishlistView } from "@/components/books/WishlistView";
import { YearInPixelsView } from "@/components/books/YearInPixelsView";
import { MonthlyOverviewView } from "@/components/books/MonthlyOverviewView";
import { ImportBooksView } from "@/components/books/ImportBooksView";
import { NotebookExportView } from "@/components/books/NotebookExportView";
import { ActivityCalendarView } from "@/components/shared/ActivityCalendarView";
import { YearSelector } from "@/components/ui/YearSelector";
import { useMediaTracker } from "@/context/MediaTrackerContext";
import { isWishlistItemRead } from "@/lib/wishlist";
import { filterWishlistByYear, getTrackerYears } from "@/lib/trackerYears";
import type { Book, BookTab, WishlistItem } from "@/types";

const NAV_ITEMS = [
  { id: "panel", label: "Panel", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "estanteria", label: "Mi estantería", icon: <Library className="h-4 w-4" /> },
  { id: "calendario", label: "Calendario", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <ListChecks className="h-4 w-4" /> },
  { id: "year_pixels", label: "Year in Pixels", icon: <Grid3x3 className="h-4 w-4" /> },
  { id: "overview", label: "Overview", icon: <Table2 className="h-4 w-4" /> },
  { id: "book_of_year", label: "Book of the Year", icon: <Trophy className="h-4 w-4" /> },
  { id: "estadisticas", label: "Estadísticas", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "resumen_mes", label: "Resumen del mes", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "diario", label: "Diario", icon: <Quote className="h-4 w-4" /> },
  { id: "libreria", label: "Búsqueda", icon: <Search className="h-4 w-4" /> },
  { id: "resena", label: "Nueva reseña", icon: <PenLine className="h-4 w-4" /> },
  { id: "importar", label: "Importar", icon: <Upload className="h-4 w-4" /> },
  { id: "exportar_cuaderno", label: "Exportar cuaderno", icon: <FileDown className="h-4 w-4" /> },
  { id: "favoritos", label: "Favoritos", icon: <Star className="h-4 w-4" /> },
];

const YEAR_AWARE_TABS = new Set<BooksSection>([
  "wishlist",
  "year_pixels",
  "overview",
  "favoritos",
  "book_of_year",
]);

type BooksSection = BookTab | "panel" | "importar" | "calendario";

export default function BooksPage() {
  const router = useRouter();
  const {
    books,
    movies,
    series,
    wishlist,
    readingGoal,
    setMonthlyFavorite,
    setBracketWinner,
    resetBookOfYearBracket,
    getMonthlyFavoritesForYear,
    getBookOfYearBracket,
    monthlyFavorites,
    bookOfYearBrackets,
    setReadingGoal,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    linkWishlistToBook,
    getBook,
  } = useMediaTracker();

  const trackerYears = useMemo(
    () => getTrackerYears(books, wishlist, monthlyFavorites, bookOfYearBrackets),
    [books, wishlist, monthlyFavorites, bookOfYearBrackets]
  );

  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<BooksSection>("panel");
  const [editingBookId, setEditingBookId] = useState<string | undefined>();
  const [wishlistDraft, setWishlistDraft] = useState<{
    wishlistId: string;
    title: string;
    seriesLabel?: string;
  } | undefined>();
  const [returnTab, setReturnTab] = useState<BooksSection>("estanteria");

  const year = trackerYears.includes(selectedYear)
    ? selectedYear
    : trackerYears[0] ?? selectedYear;

  const yearWishlist = useMemo(
    () => filterWishlistByYear(wishlist, year),
    [wishlist, year]
  );

  const favoritesForYear = useMemo(
    () => getMonthlyFavoritesForYear(year),
    [getMonthlyFavoritesForYear, year]
  );

  const bracketForYear = useMemo(
    () => getBookOfYearBracket(year),
    [getBookOfYearBracket, year]
  );

  const openBook = useCallback((book: Book) => {
    setReturnTab(activeTab);
    setEditingBookId(book.id);
    setWishlistDraft(undefined);
    setActiveTab("resena");
  }, [activeTab]);

  const handleNewBook = useCallback(() => {
    setEditingBookId(undefined);
    setActiveTab("resena");
  }, []);

  const handleSaved = useCallback(() => {
    setEditingBookId(undefined);
    setWishlistDraft(undefined);
    setActiveTab(returnTab);
  }, [returnTab]);

  const handleDeleted = useCallback(() => {
    setEditingBookId(undefined);
    setWishlistDraft(undefined);
    setActiveTab("libreria");
  }, []);

  const handleWishlistToggle = useCallback(
    (item: WishlistItem) => {
      const linkedBook = item.bookId ? getBook(item.bookId) : undefined;
      const read = isWishlistItemRead(item, linkedBook);

      if (read) {
        updateWishlistItem(item.id, { read: false, bookId: undefined });
        return;
      }

      if (item.bookId && linkedBook) {
        setReturnTab("wishlist");
        setEditingBookId(linkedBook.id);
        setWishlistDraft(undefined);
        setActiveTab("resena");
        return;
      }

      setReturnTab("wishlist");
      setEditingBookId(undefined);
      setWishlistDraft({
        wishlistId: item.id,
        title: item.title,
        seriesLabel: item.seriesLabel,
      });
      setActiveTab("resena");
    },
    [getBook, updateWishlistItem]
  );

  const showYearSelector = YEAR_AWARE_TABS.has(activeTab);

  return (
    <AppShell
      module="books"
      title="Lecturas"
      navItems={NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as BooksSection);
        if (tab !== "resena") {
          setEditingBookId(undefined);
          setWishlistDraft(undefined);
        }
      }}
    >
      {showYearSelector && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-bj-border bg-bj-surface/30 px-4 py-3">
          <p className="text-sm text-bj-muted">
            Mostrando datos de <strong className="text-bj-navy">{year}</strong>
          </p>
          <YearSelector years={trackerYears} year={year} onChange={setSelectedYear} />
        </div>
      )}

      {activeTab === "panel" && (
        <DashboardView
          books={books}
          readingGoal={readingGoal}
          onGoalChange={setReadingGoal}
          onBookClick={openBook}
        />
      )}
      {activeTab === "estanteria" && (
        <BookcaseView books={books} onBookClick={openBook} />
      )}
      {activeTab === "calendario" && (
        <ActivityCalendarView
          books={books}
          movies={movies}
          series={series}
          defaultFilter="book"
          onBookClick={(id) => {
            const book = getBook(id);
            if (book) openBook(book);
          }}
          onMovieClick={() => router.push("/movies")}
          onSeriesClick={() => router.push("/series")}
        />
      )}
      {activeTab === "wishlist" && (
        <WishlistView
          items={yearWishlist}
          books={books}
          year={year}
          onAdd={(title, seriesLabel) => addWishlistItem(title, seriesLabel, year)}
          onToggleRead={handleWishlistToggle}
          onDelete={deleteWishlistItem}
          onOpenBook={(bookId) => {
            const book = getBook(bookId);
            if (book) openBook(book);
          }}
        />
      )}
      {activeTab === "year_pixels" && <YearInPixelsView books={books} year={year} />}
      {activeTab === "overview" && <MonthlyOverviewView books={books} year={year} />}
      {activeTab === "book_of_year" && (
        <BookOfYearView
          books={books}
          year={year}
          monthlyFavorites={favoritesForYear}
          bracket={bracketForYear}
          onPickWinner={(round, index, winnerId) =>
            setBracketWinner(year, round, index, winnerId)
          }
          onResetBracket={() => resetBookOfYearBracket(year)}
          onBookClick={openBook}
        />
      )}
      {activeTab === "estadisticas" && <StatsView books={books} />}
      {activeTab === "resumen_mes" && <MonthlyRecapView books={books} />}
      {activeTab === "diario" && (
        <JournalView books={books} onBookClick={openBook} />
      )}
      {activeTab === "libreria" && (
        <LibraryView books={books} onBookClick={openBook} onNewBook={handleNewBook} />
      )}
      {activeTab === "resena" && (
        <BookReviewForm
          key={editingBookId ?? wishlistDraft?.wishlistId ?? "new"}
          bookId={editingBookId}
          wishlistId={wishlistDraft?.wishlistId}
          prefill={
            wishlistDraft
              ? { title: wishlistDraft.title, seriesLabel: wishlistDraft.seriesLabel }
              : undefined
          }
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onLinkWishlist={linkWishlistToBook}
        />
      )}
      {activeTab === "importar" && <ImportBooksView />}
      {activeTab === "exportar_cuaderno" && <NotebookExportView />}
      {activeTab === "favoritos" && (
        <MonthlyFavoritesView
          books={books}
          year={year}
          monthlyFavorites={favoritesForYear}
          onSelect={(month, bookId) => setMonthlyFavorite(year, month, bookId)}
          onBookClick={openBook}
        />
      )}
    </AppShell>
  );
}
