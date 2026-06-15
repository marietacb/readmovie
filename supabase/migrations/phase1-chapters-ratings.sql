-- Migración Fase 1: capítulos totales + medias estrellas en valoraciones de libros
-- Ejecuta en Supabase si ya tenías la tabla books creada

alter table public.books
  add column if not exists total_chapters integer;

alter table public.books
  alter column rating type numeric(3,1) using rating::numeric(3,1);

alter table public.books
  alter column romance_rating type numeric(3,1) using romance_rating::numeric(3,1);

alter table public.books
  alter column hype_rating type numeric(3,1) using hype_rating::numeric(3,1);
