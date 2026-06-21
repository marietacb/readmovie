"use client";

import Link from "next/link";
import { BookOpen, Film, Home, Menu, Tv, X } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { cn } from "@/lib/utils";

const MODULE_LINKS = [
  { href: "/", label: "Inicio", icon: Home, module: "home" as const },
  { href: "/books", label: "Lecturas", icon: BookOpen, module: "books" as const },
  { href: "/movies", label: "Cine", icon: Film, module: "movies" as const },
  { href: "/series", label: "Series", icon: Tv, module: "series" as const },
];

interface MainHeaderProps {
  activeModule: "home" | "books" | "movies" | "series";
}

export function MainHeader({ activeModule }: MainHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bj-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-bj-navy to-bj-navy/80 shadow-sm">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif text-lg font-bold text-bj-navy">
            Diario<span className="font-normal text-bj-muted">.com</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {MODULE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition-all",
                  activeModule === link.module
                    ? "bg-bj-navy text-white shadow-sm"
                    : "text-bj-muted hover:bg-bj-surface hover:text-bj-navy",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          <AuthButton />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-bj-navy md:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-bj-border bg-white px-4 py-3 md:hidden">
          {MODULE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm",
                activeModule === link.module && "bg-bj-surface font-medium text-bj-navy",
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
