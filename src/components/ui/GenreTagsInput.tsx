"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { normalizeGenres } from "@/lib/genres";

interface GenreTagsInputProps {
  value: string[];
  onChange: (genres: string[]) => void;
  placeholder?: string;
}

export function GenreTagsInput({
  value,
  onChange,
  placeholder = "Escribe un género y pulsa Enter",
}: GenreTagsInputProps) {
  const [draft, setDraft] = useState("");
  const genres = normalizeGenres(value);

  const addGenre = (raw: string) => {
    const next = normalizeGenres([...genres, raw]);
    if (next.length !== genres.length) onChange(next);
    setDraft("");
  };

  const removeGenre = (genre: string) => {
    onChange(genres.filter((g) => g !== genre));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (draft.trim()) addGenre(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && genres.length > 0) {
      onChange(genres.slice(0, -1));
    }
  };

  return (
    <div className="rounded-xl border border-bj-border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-bj-sage/30">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <span
            key={genre}
            className="inline-flex items-center gap-1 rounded-full bg-bj-surface px-2.5 py-1 text-xs font-medium text-bj-navy"
          >
            {genre}
            <button
              type="button"
              onClick={() => removeGenre(genre)}
              className="rounded-full p-0.5 text-bj-muted hover:bg-white hover:text-bj-navy"
              aria-label={`Quitar ${genre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) addGenre(draft);
          }}
          placeholder={genres.length === 0 ? placeholder : ""}
          className="min-w-[8rem] flex-1 border-0 bg-transparent py-1 text-sm text-bj-navy outline-none placeholder:text-bj-muted"
        />
      </div>
    </div>
  );
}
