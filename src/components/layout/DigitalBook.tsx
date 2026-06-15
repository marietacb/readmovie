"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookPage {
  id: string;
  tabLabel?: string;
  content: ReactNode;
}

interface DigitalBookProps {
  title: string;
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  variant: "books" | "movies";
  homeHref?: string;
}

const VARIANT = {
  books: {
    paper: "bg-[#faf8f3]",
    spine: "from-[#3d5a80] to-[#2c4a6e]",
    tabActive: "bg-[#4a6fa5] text-white",
    tabInactive: "bg-[#b8cfe8] text-[#2c4a6e] hover:bg-[#9bb8d4]",
    tabBorder: "border-[#4a6fa5]",
    accent: "text-[#4a6fa5]",
    btn: "bg-[#4a6fa5] hover:bg-[#3d5a80]",
    desk: "bg-[#e8e4dc]",
  },
  movies: {
    paper: "bg-[#fdfbf7]",
    spine: "from-[#8b7355] to-[#6b5a4e]",
    tabActive: "bg-[#6b5a4e] text-white",
    tabInactive: "bg-[#d4c5b8] text-[#4a3f35] hover:bg-[#c5b5a8]",
    tabBorder: "border-[#6b5a4e]",
    accent: "text-[#6b5a4e]",
    btn: "bg-[#6b5a4e] hover:bg-[#5a4a3e]",
    desk: "bg-[#e8e0d4]",
  },
};

export function DigitalBook({
  title,
  pages,
  currentPage,
  onPageChange,
  variant,
  homeHref = "/",
}: DigitalBookProps) {
  const styles = VARIANT[variant];
  const [animDir, setAnimDir] = useState<"next" | "prev" | "jump" | null>(null);

  const tabPages = pages
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.tabLabel);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" | "jump") => {
      if (index < 0 || index >= pages.length || index === currentPage) return;
      setAnimDir(dir);
      onPageChange(index);
    },
    [currentPage, onPageChange, pages.length]
  );

  const next = useCallback(() => goTo(currentPage + 1, "next"), [currentPage, goTo]);
  const prev = useCallback(() => goTo(currentPage - 1, "prev"), [currentPage, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  useEffect(() => {
    if (animDir) {
      const t = setTimeout(() => setAnimDir(null), 350);
      return () => clearTimeout(t);
    }
  }, [animDir, currentPage]);

  return (
    <div className={cn("flex h-dvh flex-col overflow-hidden", styles.desk)}>
      {/* Barra superior */}
      <header className="flex h-11 shrink-0 items-center justify-between px-4 md:px-6">
        <Link
          href={homeHref}
          className={cn(
            "flex items-center gap-2 text-sm transition-opacity hover:opacity-70",
            styles.accent
          )}
        >
          <Home className="h-4 w-4" />
          <span>Biblioteca</span>
        </Link>
        <span className="font-serif text-sm font-semibold tracking-wide opacity-60">
          {title}
        </span>
        <span className="text-xs opacity-40">
          {currentPage + 1} / {pages.length}
        </span>
      </header>

      {/* Área del libro — tamaño fijo adaptado al viewport */}
      <div className="book-viewport relative flex min-h-0 flex-1 items-center justify-center px-3 py-2 md:px-6">
        <div className="book-assembly flex h-full max-h-full items-start justify-center">
          {/* Sombra */}
          <div className="pointer-events-none absolute bottom-1 left-1/2 h-4 w-[70%] max-w-2xl -translate-x-1/2 rounded-[50%] bg-black/10 blur-md" />

          {/* Libro */}
          <div className="book-frame relative flex overflow-hidden rounded-l-sm rounded-r-md shadow-2xl">
            {/* Lomo */}
            <div className={cn("w-3 shrink-0 bg-gradient-to-r", styles.spine)} />

            {/* Página */}
            <div className={cn("relative flex min-h-0 min-w-0 flex-1 flex-col", styles.paper)}>
              {/* Textura de papel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg, transparent, transparent 27px, #888 27px, #888 28px
                  )`,
                }}
              />

              {/* Contenido con scroll interno */}
              <div
                key={currentPage}
                className={cn(
                  "book-page-content min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 md:px-10 md:py-8",
                  animDir === "next" && "animate-page-next",
                  animDir === "prev" && "animate-page-prev",
                  animDir === "jump" && "animate-page-jump"
                )}
              >
                {pages[currentPage]?.content}
              </div>

              {/* Número de página */}
              <div className="shrink-0 pb-3 text-center text-xs opacity-30">
                — {currentPage + 1} —
              </div>
            </div>
          </div>

          {/* Pestañas escritorio */}
          <div className="ml-1 hidden h-full shrink-0 flex-col justify-start gap-1 pt-10 md:flex">
            {tabPages.map((page) => (
              <button
                key={page.id}
                onClick={() => goTo(page.index, "jump")}
                className={cn(
                  "relative w-24 rounded-l-lg border px-2 py-2.5 text-right text-[9px] font-semibold uppercase tracking-wide shadow-sm transition-all lg:w-28 lg:px-3 lg:py-3 lg:text-[10px]",
                  styles.tabBorder,
                  currentPage === page.index ? styles.tabActive : styles.tabInactive
                )}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)" }}
              >
                {page.tabLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pestañas móvil */}
      <div className="flex h-9 shrink-0 items-center gap-1 overflow-x-auto px-3 md:hidden">
        {tabPages.map((page) => (
          <button
            key={page.id}
            onClick={() => goTo(page.index, "jump")}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase",
              currentPage === page.index ? styles.tabActive : "bg-black/5"
            )}
          >
            {page.tabLabel}
          </button>
        ))}
      </div>

      {/* Navegación */}
      <div className="flex h-14 shrink-0 items-center justify-center gap-4 px-4 md:gap-6">
        <button
          onClick={prev}
          disabled={currentPage === 0}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-all disabled:opacity-30 md:gap-2 md:px-5 md:py-2.5",
            styles.btn
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="hidden text-xs opacity-40 lg:block">
          Usa ← → para pasar páginas
        </span>

        <button
          onClick={next}
          disabled={currentPage === pages.length - 1}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-all disabled:opacity-30 md:gap-2 md:px-5 md:py-2.5",
            styles.btn
          )}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
