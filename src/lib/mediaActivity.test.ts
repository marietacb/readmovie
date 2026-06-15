import { describe, expect, it } from "vitest";
import { getActivityEvents, getEventsForDate } from "@/lib/mediaActivity";
import type { Book, Movie, Series } from "@/types";

describe("mediaActivity", () => {
  it("agrupa lectura, cine y series por fecha", () => {
    const books: Book[] = [
      {
        id: "b1",
        title: "Dune",
        author: "Herbert",
        format: ["libro"],
        storyType: ["autoconclusivo"],
        rating: 0,
        romanceRating: 0,
        hypeRating: 0,
        spineColor: "#000",
        chapters: [],
        readingSessions: [{ id: "s1", date: "2026-03-01", fromPage: 1, toPage: 21 }],
        quotes: [],
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];
    const movies: Movie[] = [
      {
        id: "m1",
        title: "Inception",
        director: "Nolan",
        genre: "Sci-fi",
        summary: "",
        rating: 5,
        feelings: [],
        bestMoments: [],
        worstMoments: [],
        favouriteQuotes: [],
        watchDate: "2026-03-01",
        createdAt: "2026-03-01",
        updatedAt: "2026-03-01",
      },
    ];
    const series: Series[] = [
      {
        id: "sr1",
        title: "The Bear",
        creator: "Creator",
        genre: "Drama",
        platform: "Disney+",
        summary: "",
        rating: 4,
        status: "completed",
        feelings: [],
        favoriteEpisodes: [],
        bestMoments: [],
        worstMoments: [],
        favouriteQuotes: [],
        endDate: "2026-03-02",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];

    const events = getActivityEvents(books, movies, series);
    expect(getEventsForDate(events, "2026-03-01").length).toBeGreaterThanOrEqual(2);
    expect(getEventsForDate(events, "2026-03-02").some((e) => e.kind === "series")).toBe(true);
  });
});
