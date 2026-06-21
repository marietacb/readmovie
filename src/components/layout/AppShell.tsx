"use client";

import type { ReactNode } from "react";
import { MainHeader } from "@/components/layout/MainHeader";
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

export function AppShell({
  children,
  module,
  navItems,
  activeTab,
  onTabChange,
  title,
}: AppShellProps) {
  return (
    <div className="bj-app-bg flex min-h-dvh flex-col">
      <MainHeader activeModule={module} />

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
