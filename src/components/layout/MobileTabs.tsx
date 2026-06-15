"use client";

import { cn } from "@/lib/utils";

interface MobileTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  variant?: "books" | "movies";
}

export function MobileTabs({ tabs, activeTab, onTabChange, variant = "books" }: MobileTabsProps) {
  const activeColor = variant === "books" ? "bg-[#4a6fa5]" : "bg-[#6b5a4e]";

  return (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold uppercase transition-colors",
            activeTab === tab.id
              ? `${activeColor} text-white`
              : "bg-black/5 text-current hover:bg-black/10"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
