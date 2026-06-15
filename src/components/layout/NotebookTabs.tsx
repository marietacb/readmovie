"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BookTab, MovieTab } from "@/types";

interface Tab {
  id: string;
  label: string;
}

interface NotebookTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  variant?: "books" | "movies";
}

const VARIANT_STYLES = {
  books: {
    active: "bg-[#4a6fa5] text-white",
    inactive: "bg-[#b8cfe8] text-[#2c4a6e] hover:bg-[#9bb8d4]",
    border: "border-[#4a6fa5]",
  },
  movies: {
    active: "bg-[#6b5a4e] text-white",
    inactive: "bg-[#d4c5b8] text-[#4a3f35] hover:bg-[#c5b5a8]",
    border: "border-[#6b5a4e]",
  },
};

export function NotebookTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "books",
}: NotebookTabsProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="flex flex-col gap-1">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative -ml-1 w-28 rounded-l-lg border px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide shadow-sm transition-all",
            styles.border,
            activeTab === tab.id ? styles.active : styles.inactive,
            index === 0 && "rounded-tl-xl"
          )}
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export const BOOK_TABS: { id: BookTab; label: string }[] = [
  { id: "estanteria", label: "Estantería" },
  { id: "libreria", label: "Librería" },
  { id: "resena", label: "Reseñas" },
  { id: "favoritos", label: "Favoritos del mes" },
];

export const MOVIE_TABS: { id: MovieTab; label: string }[] = [
  { id: "lista", label: "Mi Cine" },
  { id: "resena", label: "Reseña" },
];

interface ModuleNavProps {
  current: "home" | "books" | "movies";
}

export function ModuleNav({ current }: ModuleNavProps) {
  return (
    <nav className="flex items-center gap-4 text-sm">
      <Link
        href="/"
        className={cn(
          "transition-colors hover:opacity-70",
          current === "home" ? "font-bold" : "opacity-60"
        )}
      >
        MediaTracker
      </Link>
      <span className="opacity-30">|</span>
      <Link
        href="/books"
        className={cn(
          "transition-colors hover:opacity-70",
          current === "books" ? "font-bold text-[#4a6fa5]" : "opacity-60"
        )}
      >
        Lecturas
      </Link>
      <Link
        href="/movies"
        className={cn(
          "transition-colors hover:opacity-70",
          current === "movies" ? "font-bold text-[#6b5a4e]" : "opacity-60"
        )}
      >
        Cine
      </Link>
    </nav>
  );
}
