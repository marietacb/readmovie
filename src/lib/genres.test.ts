import { describe, expect, it } from "vitest";
import {
  formatGenres,
  genresFromStorage,
  genresToStorage,
  normalizeGenres,
  readGenresFromEntity,
} from "@/lib/genres";

describe("genres", () => {
  it("normaliza arrays y elimina duplicados sin distinguir mayúsculas", () => {
    expect(normalizeGenres([" Fantasía ", "fantasía", "Romance"])).toEqual([
      "Fantasía",
      "Romance",
    ]);
  });

  it("lee género legacy como array de uno", () => {
    expect(readGenresFromEntity({ genre: "Drama" })).toEqual(["Drama"]);
    expect(readGenresFromEntity({ genres: ["Sci-fi", "Thriller"] })).toEqual([
      "Sci-fi",
      "Thriller",
    ]);
  });

  it("serializa y deserializa múltiples géneros", () => {
    const stored = genresToStorage(["Drama", "Comedia"]);
    expect(stored).toBe('["Drama","Comedia"]');
    expect(genresFromStorage(stored)).toEqual(["Drama", "Comedia"]);
    expect(genresFromStorage("Thriller")).toEqual(["Thriller"]);
  });

  it("formatea para mostrar", () => {
    expect(formatGenres(["Fantasía", "Romance"])).toBe("Fantasía, Romance");
  });
});
