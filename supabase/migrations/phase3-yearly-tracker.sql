-- Fase 3: favoritos por año + bracket Book of the Year
-- Seguro para reejecutar

alter table public.profiles
  add column if not exists book_of_year_brackets jsonb not null default '{}';

-- monthly_favorites pasa a formato anidado por año, ej.:
-- { "2025": { "1": "book-id", "2": null, ... }, "2026": { ... } }
-- Los datos planos { "1": "id" } se migran automáticamente en la app al cargar.
