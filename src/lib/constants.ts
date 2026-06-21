import type { BookFormat, MovieFeeling, MovieStatus, Month, SeriesStatus, StoryType } from "@/types";

export const MONTH_NAMES: Record<Month, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

export const BOOK_FORMATS: { value: BookFormat; label: string }[] = [
  { value: "libro", label: "Libro" },
  { value: "ebook", label: "Libro electrónico" },
  { value: "audiolibro", label: "Audiolibro" },
];

export const STORY_TYPES: { value: StoryType; label: string }[] = [
  { value: "autoconclusivo", label: "Autoconclusivo" },
  { value: "bilogia", label: "Bilogía" },
  { value: "trilogia", label: "Trilogía" },
  { value: "saga", label: "Saga" },
];

export const SERIES_STATUSES: { value: SeriesStatus; label: string }[] = [
  { value: "watching", label: "Viendo ahora" },
  { value: "completed", label: "Terminada" },
  { value: "plan_to_watch", label: "Quiero verla" },
  { value: "watched_again", label: "Vista de nuevo" },
  { value: "partially_dropped", label: "Medio abandonada" },
  { value: "dropped", label: "Abandonada" },
];

export const MOVIE_STATUSES: { value: MovieStatus; label: string }[] = [
  { value: "watched", label: "Vista" },
  { value: "plan_to_watch", label: "Quiero verla" },
  { value: "watched_again", label: "Vista de nuevo" },
  { value: "partially_dropped", label: "Medio abandonada" },
  { value: "dropped", label: "Abandonada" },
];

export const MOVIE_FEELINGS: { value: MovieFeeling; label: string }[] = [
  { value: "will_watch_again", label: "La volvería a ver" },
  { value: "did_not_like", label: "No me gustó nada" },
  { value: "new_favourite", label: "Mi nueva película favorita" },
  { value: "very_moving", label: "Muy emotiva" },
  { value: "must_watch", label: "Imprescindible" },
  { value: "extremely_boring", label: "Extremadamente aburrida" },
  { value: "regret_watching", label: "Me arrepiento de verla" },
  { value: "very_funny", label: "Muy divertida" },
];

export const PASTEL_COLORS = [
  "#B8D4E8",
  "#C5D8C0",
  "#E8C5D4",
  "#D4C5E8",
  "#E8D4B8",
  "#B8E8D4",
  "#E8B8C5",
  "#C5B8E8",
  "#D4E8B8",
  "#E8E0B8",
];

export const STORAGE_KEY = "mediatracker-data";

export const EMPTY_MONTHLY_FAVORITES = (): Record<Month, string | null> => ({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: null,
  12: null,
});
