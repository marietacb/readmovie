"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Film, Home, Menu, Tv, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface AppShellProps {
  children: ReactNode;
  module: "books" | "movies" | "series";
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
}

const MODULE_LINKS = [
  { href: "/books", label: "Lecturas", icon: BookOpen, module: "books" as const },
  { href: "/movies", label: "Cine", icon: Film, module: "movies" as const },
  { href: "/series", label: "Series", icon: Tv, module: "series" as const },
];

export function AppShell({
  children,
  module,
  navItems,
  activeTab,
  onTabChange,
  title,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bj-app-bg flex min-h-dvh flex-col">
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
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition-all",
                  pathname === "/"
                    ? "bg-bj-navy text-white shadow-sm"
                    : "text-bj-muted hover:bg-bj-surface hover:text-bj-navy"
                )}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              {MODULE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition-all",
                    module === link.module
                      ? "bg-bj-navy text-white shadow-sm"
                      : "text-bj-muted hover:bg-bj-surface hover:text-bj-navy"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <AuthButton />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl p-2 text-bj-navy md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-bj-border bg-white px-4 py-3 md:hidden">
            <Link href="/" className="block rounded-xl px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>Inicio</Link>
            {MODULE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-20 overflow-hidden rounded-2xl border border-bj-border bg-white shadow-sm">
            <div className="border-b border-bj-border bg-gradient-to-r from-bj-navy/5 to-bj-terracotta/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-bj-navy">{title}</p>
            </div>
            <nav className="flex flex-col gap-0.5 p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all",
                    activeTab === item.id
                      ? "bg-bj-navy font-medium text-white shadow-sm"
                      : "text-bj-text hover:bg-bj-surface"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-bj-border bg-white/95 px-2 py-2 backdrop-blur-sm md:hidden">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  activeTab === item.id ? "bg-bj-navy text-white" : "bg-bj-surface text-bj-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <main className="min-w-0 flex-1 pb-20 md:pb-6">
          <div className="rounded-2xl border border-bj-border/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
