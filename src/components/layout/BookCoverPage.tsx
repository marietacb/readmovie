"use client";

import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverPageProps {
  title: string;
  subtitle?: string;
  variant: "books" | "movies";
}

export function BookCoverPage({ title, subtitle, variant }: BookCoverPageProps) {
  const isBooks = variant === "books";

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div
        className={cn(
          "relative w-full max-w-sm rounded-xl border-2 bg-white px-10 py-16 text-center shadow-sm",
          isBooks ? "border-[#4a6fa5]/40" : "border-[#8b7355]/40"
        )}
      >
        {/* Patrón decorativo */}
        <div
          className="absolute inset-0 rounded-xl opacity-[0.07]"
          style={{
            backgroundImage: isBooks
              ? `radial-gradient(circle at 25% 25%, #4a6fa5 2px, transparent 2px),
                 radial-gradient(circle at 75% 75%, #b8cfe8 2px, transparent 2px)`
              : `repeating-linear-gradient(45deg, #8b7355 0, #8b7355 1px, transparent 1px, transparent 12px)`,
            backgroundSize: isBooks ? "32px 32px" : "auto",
          }}
        />

        <Paperclip
          className={cn(
            "absolute -top-1 right-6 h-6 w-6 rotate-12",
            isBooks ? "text-[#4a6fa5]/50" : "text-[#8b7355]/50"
          )}
        />

        <h1
          className={cn(
            "relative font-serif text-5xl font-bold tracking-widest",
            isBooks ? "text-[#2c4a6e]" : "text-[#4a3f35]"
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              "relative mt-4 text-sm",
              isBooks ? "text-[#4a6fa5]/60" : "text-[#8b7355]/60"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      <p className="mt-10 text-xs opacity-40">
        Pulsa «Siguiente» o → para abrir
      </p>
    </div>
  );
}
