"use client";

import { cn } from "@/lib/utils";
import { ModuleNav } from "./NotebookTabs";

interface AppLayoutProps {
  children: React.ReactNode;
  module: "home" | "books" | "movies";
  sidebar?: React.ReactNode;
  mobileTabs?: React.ReactNode;
  bgClass?: string;
}

export function AppLayout({
  children,
  module,
  sidebar,
  mobileTabs,
  bgClass = "bg-[#f9f7f2]",
}: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen", bgClass)}>
      <header className="border-b border-black/10 px-6 py-4">
        <ModuleNav current={module} />
      </header>
      {mobileTabs && (
        <div className="border-b border-black/10 px-4 py-2 md:hidden">{mobileTabs}</div>
      )}
      <div className="flex">
        <main className="min-h-[calc(100vh-65px)] flex-1 p-6 md:p-10">{children}</main>
        {sidebar && (
          <aside className="hidden w-32 shrink-0 pt-10 pr-2 md:block">{sidebar}</aside>
        )}
      </div>
    </div>
  );
}
