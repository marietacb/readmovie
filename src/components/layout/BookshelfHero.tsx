import { BookOpen } from "lucide-react";

/** Estantería decorativa estilo BookJournal para la landing */
export function BookshelfHero() {
  const books = [
    { h: 140, color: "#c17f59", w: 36 },
    { h: 160, color: "#1e3a5f", w: 32 },
    { h: 130, color: "#7d9b76", w: 34 },
    { h: 155, color: "#8b6914", w: 30 },
    { h: 145, color: "#9b6b8a", w: 36 },
    { h: 150, color: "#4a6741", w: 32 },
    { h: 135, color: "#b85c38", w: 34 },
    { h: 158, color: "#2c4a6e", w: 30 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Fondo estantería */}
      <div className="rounded-2xl bg-gradient-to-b from-bj-wood-light to-bj-wood p-6 shadow-xl">
        <div className="relative flex items-end justify-center gap-3 px-4 pb-3">
          {books.map((book, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-sm shadow-md transition-transform hover:-translate-y-1"
              style={{
                height: book.h,
                width: book.w,
                backgroundColor: book.color,
              }}
            >
              <div className="absolute inset-x-1 top-3 h-px bg-white/20" />
              <div className="absolute inset-x-1 top-6 h-px bg-white/10" />
              {i === 3 && (
                <BookOpen className="absolute bottom-4 left-1/2 h-5 w-5 -translate-x-1/2 text-white/40" />
              )}
            </div>
          ))}
        </div>
        {/* Balda */}
        <div className="mx-2 h-3 rounded-sm bg-bj-wood-dark shadow-inner" />
        <div className="mx-4 mt-1 h-1 rounded-full bg-black/10" />
      </div>
      <div className="absolute -bottom-4 left-1/2 h-8 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-xl" />
    </div>
  );
}
